<#
.SYNOPSIS
  Keeps the Next.js dev server for this project up on http://localhost:3000.

.DESCRIPTION
  Health-checks localhost:3000. If it does not respond:
    - kills any stale process squatting on the port
    - after repeated consecutive failures, clears .next (guards against a
      corrupted build cache - the same failure mode hit earlier when a
      `next build` ran against a live dev server's .next directory)
    - relaunches `npm run dev` as a detached background process, so it
      keeps running after this script (and the scheduled task that invoked
      it) exits.

  Designed to be run periodically (e.g. every few minutes) by a Windows
  Scheduled Task - see setup-dev-autostart.ps1. Safe to run manually too.
  Each run is short-lived: it either confirms the server is healthy and
  exits, or kicks off a restart and exits without waiting for it.
#>

$ErrorActionPreference = "Stop"

$ProjectDir  = Split-Path -Parent $PSScriptRoot
$Port        = 3000
$Url         = "http://localhost:$Port"
$LogDir      = Join-Path $ProjectDir "logs"
$LogFile     = Join-Path $LogDir "dev-watchdog.log"
$ServerLog   = Join-Path $LogDir "dev-server.log"
$FailCountFile = Join-Path $LogDir ".dev-watchdog-failcount"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log([string]$Message) {
    $line = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -Path $LogFile -Value $line
}

function Test-DevServerUp {
    try {
        $resp = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing
        return $resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500
    } catch [System.Net.WebException] {
        # Any HTTP response at all (even a 4xx/5xx from the app) means the
        # server process is alive and answering.
        if ($_.Exception.Response) { return $true }
        return $false
    } catch {
        return $false
    }
}

if (Test-DevServerUp) {
    Remove-Item -Path $FailCountFile -ErrorAction SilentlyContinue
    exit 0
}

Write-Log "Dev server not responding on $Url - attempting restart."

# Track consecutive failures so we only nuke .next after repeated trouble,
# not on every ordinary restart.
$failCount = 0
if (Test-Path $FailCountFile) {
    $raw = Get-Content $FailCountFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($raw -match '^\d+$') { $failCount = [int]$raw }
}
$failCount++
Set-Content -Path $FailCountFile -Value $failCount

# Clear out anything stuck on the port (a hung or zombie node process).
$owners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique
foreach ($processId in $owners) {
    try {
        Write-Log "Killing stale process $processId holding port $Port."
        Stop-Process -Id $processId -Force -ErrorAction Stop
    } catch {
        Write-Log "Could not stop process ${processId}: $($_.Exception.Message)"
    }
}

if ($failCount -ge 3) {
    $nextDir = Join-Path $ProjectDir ".next"
    if (Test-Path $nextDir) {
        Write-Log "Repeated failures ($failCount) - clearing .next before restart."
        Remove-Item -Recurse -Force $nextDir -ErrorAction SilentlyContinue
    }
    Remove-Item -Path $FailCountFile -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1

$cmd = "cd /d `"$ProjectDir`" && npm run dev >> `"$ServerLog`" 2>&1"
Start-Process -FilePath "$env:ComSpec" -ArgumentList "/c", $cmd -WindowStyle Hidden

Write-Log "Relaunched 'npm run dev' (detached). Logs: $ServerLog"

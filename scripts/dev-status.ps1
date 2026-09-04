<#
.SYNOPSIS
  Quick manual check: is the dev server up, and is the watchdog task installed?
#>

$ProjectDir = Split-Path -Parent $PSScriptRoot
$TaskName   = "UAEDataCompliance-DevWatchdog"

try {
    $resp = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "Dev server: UP (HTTP $($resp.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Dev server: DOWN" -ForegroundColor Red
}

$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($task) {
    $info = Get-ScheduledTaskInfo -TaskName $TaskName
    Write-Host "Watchdog task: installed (state: $($task.State), last run: $($info.LastRunTime), last result: $($info.LastTaskResult))"
} else {
    Write-Host "Watchdog task: NOT installed - run scripts\setup-dev-autostart.ps1" -ForegroundColor Yellow
}

$logFile = Join-Path $ProjectDir "logs\dev-watchdog.log"
if (Test-Path $logFile) {
    Write-Host "`nLast watchdog log lines:"
    Get-Content $logFile -Tail 5
}

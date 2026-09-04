<#
.SYNOPSIS
  Registers a Windows Scheduled Task that keeps the project's dev server
  running: at logon, and every 5 minutes thereafter as a self-healing check.

.DESCRIPTION
  Idempotent - safe to re-run. Uses dev-watchdog.ps1, which only acts when
  http://localhost:3000 is not responding, so the periodic trigger is a
  no-op whenever the server is already healthy.

  Run once, interactively, as the user who will be developing:
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\setup-dev-autostart.ps1

  To remove it later: scripts\remove-dev-autostart.ps1
#>

$ErrorActionPreference = "Stop"

$ProjectDir  = Split-Path -Parent $PSScriptRoot
$WatchdogPs1 = Join-Path $ProjectDir "scripts\dev-watchdog.ps1"
$TaskName    = "UAEDataCompliance-DevWatchdog"

if (-not (Test-Path $WatchdogPs1)) {
    throw "Could not find $WatchdogPs1"
}

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$WatchdogPs1`""

$logonTrigger  = New-ScheduledTaskTrigger -AtLogOn
$repeatTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 5) `
    -RepetitionDuration (New-TimeSpan -Days 3650)

$settings = New-ScheduledTaskSettingsSet `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Write-Host "Task '$TaskName' already exists - replacing it."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger @($logonTrigger, $repeatTrigger) `
    -Settings $settings `
    -Description "Keeps 'npm run dev' for the UAE Data Compliance site up on localhost:3000: starts it at logon and checks/restarts it every 5 minutes." `
    | Out-Null

Write-Host "Scheduled task '$TaskName' registered (at logon + every 5 min)."
Write-Host "Running it once now to bring the dev server up..."
Start-ScheduledTask -TaskName $TaskName
Start-Sleep -Seconds 2
Write-Host "Done. Check logs\dev-watchdog.log and logs\dev-server.log for status."
Write-Host "To remove: scripts\remove-dev-autostart.ps1"

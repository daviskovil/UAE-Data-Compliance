<#
.SYNOPSIS
  Unregisters the dev-server auto-start/watchdog scheduled task created by
  setup-dev-autostart.ps1. Does not stop a dev server that is currently
  running - stop that yourself (Ctrl+C in its window, or Stop-Process on
  the node process) if you want it down too.
#>

$ErrorActionPreference = "Stop"
$TaskName = "UAEDataCompliance-DevWatchdog"

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Removed scheduled task '$TaskName'."
} else {
    Write-Host "No scheduled task named '$TaskName' found."
}

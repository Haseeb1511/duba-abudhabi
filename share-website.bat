@echo off
title Dubai-Abu Dhabi Website - Public Link Generator
echo ========================================================
echo   Starting local server & Public Tunnel (SSH)...
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = 5500; " ^
  "if (-not (Get-NetTCPConnection -LocalPort 5500 -ErrorAction SilentlyContinue)) { " ^
  "  Start-Process python -ArgumentList '-m http.server 5500' -WindowStyle Hidden; " ^
  "  Start-Sleep -Seconds 2; " ^
  "} " ^
  "Write-Host 'Connecting tunnel via OpenSSH (localhost.run)...' -ForegroundColor Cyan; " ^
  "ssh -o StrictHostKeyChecking=no -R 80:127.0.0.1:5500 nokey@localhost.run"


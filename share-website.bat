@echo off
title Dubai-Abu Dhabi Website - Public Link Generator
echo ========================================================
echo   Starting local server & ngrok public tunnel...
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = 8000; " ^
  "if (Get-NetTCPConnection -LocalPort 5500 -ErrorAction SilentlyContinue) { $port = 5500; Write-Host 'Detected VS Code Live Server on port 5500' -ForegroundColor Cyan; } " ^
  "else { Start-Process python -ArgumentList '-m http.server 8000' -WindowStyle Hidden; Write-Host 'Started local python server on port 8000' -ForegroundColor Cyan; } " ^
  "if (-not (Get-Process ngrok -ErrorAction SilentlyContinue)) { Start-Process ngrok -ArgumentList ('http ' + $port) -WindowStyle Hidden; Start-Sleep -Seconds 3; } " ^
  "try { " ^
  "  $link = (Invoke-RestMethod http://127.0.0.1:4040/api/tunnels).tunnels[0].public_url; " ^
  "  Set-Clipboard -Value $link; " ^
  "  Write-Host ''; " ^
  "  Write-Host '========================================================' -ForegroundColor Green; " ^
  "  Write-Host '  YOUR PUBLIC LIVE LINK (COPIED TO CLIPBOARD!):' -ForegroundColor Yellow; " ^
  "  Write-Host ('  ' + $link) -ForegroundColor Green; " ^
  "  Write-Host '========================================================' -ForegroundColor Green; " ^
  "  Write-Host 'You can paste this link directly on WhatsApp or in your browser!'; " ^
  "} catch { " ^
  "  Write-Host 'Error fetching ngrok link. Ensure ngrok is authenticated.' -ForegroundColor Red; " ^
  "}"

echo.
pause

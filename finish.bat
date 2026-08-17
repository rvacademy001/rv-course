@echo off
if exist index.html del /f /q index.html
if exist index_fixed.html rename index_fixed.html index.html
echo SUCCESS: The home page index.html has been updated and repaired!
pause

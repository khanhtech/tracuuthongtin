@echo off
chcp 65001 > nul
echo ========================================================
echo   DONG BO MA NGUON SANG XAMPP (C:\xampp\htdocs)
echo ========================================================

set "SRC=%~dp0"
set "DEST=C:\xampp\htdocs"

echo Dang dong bo thu muc frontend...
robocopy "%SRC%frontend" "%DEST%\frontend" /E /XO /NP /NJS /NJH

echo Dang dong bo thu muc api...
robocopy "%SRC%api" "%DEST%\api" /E /XO /NP /NJS /NJH

echo Dang copy file index va database...
copy /Y "%SRC%index.html" "%DEST%\index.html" > nul
copy /Y "%SRC%database.sql" "%DEST%\database.sql" > nul

echo ========================================================
echo   DA DONG BO THANH CONG!
echo   Dia chi website: https://doantnttgiaoxutanmy.dominico.io.vn/
echo   Dia chi local:   http://localhost/
if "%1"=="--no-pause" goto end
if "%1"=="-n" goto end
pause
:end

@echo off
set "PORT=8080"

if exist .env (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        if not "%%a"=="" if not "%%b"=="" set "%%a=%%b"
    )
)

if "%GITA_BRAIN_MODEL%"=="" (
    set "GITA_BRAIN_MODEL=gemini-3.6-flash"
)
set "PYTHONIOENCODING=utf-8"
set "PYTHONUTF8=1"

echo Starting Gita Brain API Server...
python api\server.py
pause

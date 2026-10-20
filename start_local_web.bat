@echo off
title Веб-сервер экрана загрузки - Жизнь в Мегаполисе
cd /d "%~dp0"

echo ========================================================
echo   Экран загрузки: Жизнь в Мегаполисе
echo   Запуск локального веб-сервера на порту 8080...
echo ========================================================
echo.
echo URL для server.cfg:
echo   sv_loadingurl "http://localhost:8080/?steamid=%%s&mapname=%%m"
echo.
echo Открытие превью в браузере...
start http://localhost:8080/?steamid=STEAM_0:1:23456789^&mapname=rp_evocity_v33x
echo.
echo Сервер запущен. Для остановки закройте это окно или нажмите Ctrl+C.
echo.

python -m http.server 8080
pause

# Загрузочный экран «Жизнь в Мегаполисе» (Garry's Mod DarkRP)

Качественный кинематографичный веб-экран загрузки в стиле кибер-нуар / GTA DarkRP с 4 Full HD артами, анимацией Кена Бернса (плавный зум/панорама), Canvas-частицами, звуковым сопровождением и честным прогресс-баром на основе GMod CEF JavaScript API.

---

## 📸 Слайды и визуальные сцены
1. **Уличные гонки (Street Racing)** — `assets/images/art_racing.jpg`
2. **Полицейская перестрелка (Police & SWAT)** — `assets/images/art_shootout.jpg`
3. **Криминальные разборки (Mafia & Gangs)** — `assets/images/art_mafia.jpg`
4. **Панорама ночного мегаполиса (City Skyline)** — `assets/images/art_skyline.jpg`

---

## 🚀 Варианты запуска

### Вариант 1: Бесплатный GitHub Pages (Рекомендуется для публичного сервера)
Чтобы экран загрузки открывался у всех игроков, заходящих на сервер из интернета:
1. Зайдите на [github.com](https://github.com) и создайте новый публичный репозиторий (например, `megapolis-loading`).
2. Загрузите в него содержимое папки `loading_screen` (файлы `index.html`, папки `css`, `js`, `assets`).
3. Перейдите в **Settings** репозитория -> вкладка **Pages** -> в **Branch** выберите `main` (или `master`) и нажмите **Save**.
4. Через 1 минуту у вас появится постоянный бесплатный адрес с HTTPS:
   ```text
   https://ваш_логин.github.io/megapolis-loading/
   ```
5. Вставьте его в `server/garrysmod/cfg/server.cfg`:
   ```gmod
   sv_loadingurl "https://ваш_логин.github.io/megapolis-loading/?steamid=%s&mapname=%m"
   ```

---

### Вариант 2: Локальный запуск (Для тестов и локальной сети)
1. Запустите файл `start_local_web.bat`.
2. Он запустит веб-сервер на `http://localhost:8080/` и автоматически откроет превью в браузере.
3. В `server/garrysmod/cfg/server.cfg` уже прописано:
   ```gmod
   sv_loadingurl "http://localhost:8080/?steamid=%s&mapname=%m"
   ```

---

## 🛠 Особенности и интеграция
* **Ken Burns Effect:** Слайды плавно масштабируются и перемещаются в 4 разных векторах движения, оживляя статичные кадры.
* **Canvas Particles:** Оптимизированные неоновые частицы пыли и искр на переднем плане.
* **GMod Callbacks:** Реализованы `GameDetails`, `SetFilesTotal`, `SetFilesNeeded`, `DownloadingFile`, `SetStatusChanged`.
* **Standalone Demo Mode:** При открытии в обычном браузере через 1.8 секунды автоматически запускается демо-симуляция загрузки.
* **Звук:** Кнопка Mute/Unmute и регулятор громкости в верхнем правом углу.

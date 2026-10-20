/**
 * Жизнь в Мегаполисе - Loading Screen Master Engine
 * Ken Burns Slider, Server Lore, Audio Controller & GMod CEF Bridge.
 */

(function () {
    'use strict';

    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const tipTag = document.getElementById('tip-tag');
    const tipTitle = document.getElementById('tip-title');
    const tipText = document.getElementById('tip-text');
    const mapNameEl = document.getElementById('map-name');
    const playerNameEl = document.getElementById('player-name');
    const playerSteamIdEl = document.getElementById('player-steamid');
    const statusTextEl = document.getElementById('status-text');
    const percentageTextEl = document.getElementById('percentage-text');
    const progressBarEl = document.getElementById('progress-bar');
    const fileTextEl = document.getElementById('file-text');
    const audioEl = document.getElementById('bg-audio');
    const audioToggleBtn = document.getElementById('audio-toggle');
    const iconVolumeOn = document.getElementById('icon-volume-on');
    const iconVolumeOff = document.getElementById('icon-volume-off');
    const volumeSlider = document.getElementById('volume-slider');

    // Slide Content Cards
    const LORE_SLIDES = [
        {
            tag: "АВТОСПОРТ И ГОНКИ",
            title: "Ночные заезды по шоссе EvoCity",
            text: "Покупайте спорткары в автосалоне, тюнингуйте двигатель и устраивайте нелегальные гонки на проспектах. Но остерегайтесь патрулей дорожной полиции!"
        },
        {
            tag: "ЗАКОН И ПОРЯДОК",
            title: "Полицейский спецназ и тактика SWAT",
            text: "Вступайте в ряды полиции или SWAT, штурмуйте логова криминала, защищайте Центральный Банк от ограблений и поддерживайте закон на улицах города."
        },
        {
            tag: "ТЕМНАЯ СТОРОНА",
            title: "Криминальные синдикаты и мафия",
            text: "Основывайте могущественные группировки, производите контрабанду в подпольных лабораториях, контролируйте районы и проводите масштабные рейды."
        },
        {
            tag: "ЭКОНОМИКА И БИЗНЕС",
            title: "Жизнь в процветающем Мегаполисе",
            text: "Открывайте собственные магазины, покупайте премиальную недвижимость, стройте карьеру в Мэрии или работайте медиком — ваш путь зависит только от вас."
        }
    ];

    let currentSlideIdx = 0;
    const SLIDE_DURATION = 8000; // 8 seconds per slide
    let slideTimer = null;

    // Switch to a specific slide
    function showSlide(index) {
        currentSlideIdx = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            if (i === currentSlideIdx) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        indicators.forEach((ind, i) => {
            if (i === currentSlideIdx) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });

        // Update Lore Content with smooth fade
        const lore = LORE_SLIDES[currentSlideIdx];
        if (lore && tipTitle && tipText && tipTag) {
            tipTag.style.opacity = '0';
            tipTitle.style.opacity = '0';
            tipText.style.opacity = '0';

            setTimeout(() => {
                tipTag.textContent = lore.tag;
                tipTitle.textContent = lore.title;
                tipText.textContent = lore.text;
                tipTag.style.opacity = '1';
                tipTitle.style.opacity = '1';
                tipText.style.opacity = '1';
            }, 300);
        }
    }

    function startSlider() {
        if (slideTimer) clearInterval(slideTimer);
        slideTimer = setInterval(() => {
            showSlide(currentSlideIdx + 1);
        }, SLIDE_DURATION);
    }

    // Allow clicking indicators to change slides manually
    indicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
            showSlide(idx);
            startSlider();
        });
    });

    // ===================================================
    // Audio Player & Web Audio Ambient Fallback
    // ===================================================
    let isMuted = false;
    let webAudioContext = null;

    // Optional Ambient Synth Sound Generator (plays if no mp3 provided)
    function playAmbientDrone() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            webAudioContext = new AudioCtx();

            const osc = webAudioContext.createOscillator();
            const gain = webAudioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(55, webAudioContext.currentTime); // Low A note

            gain.gain.setValueAtTime(0.04, webAudioContext.currentTime);
            osc.connect(gain);
            gain.connect(webAudioContext.destination);
            osc.start();
        } catch (e) {
            // Audio policy blocked without interaction
        }
    }

    function initAudio() {
        if (!audioEl) return;
        audioEl.volume = parseFloat(volumeSlider ? volumeSlider.value : 0.35);

        // Attempt autoplay
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked by browser policy until user clicks anywhere
                const unlock = () => {
                    audioEl.play().catch(() => {});
                    window.removeEventListener('click', unlock);
                    window.removeEventListener('keydown', unlock);
                };
                window.addEventListener('click', unlock);
                window.addEventListener('keydown', unlock);
            });
        }

        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                audioEl.muted = isMuted;
                if (iconVolumeOn && iconVolumeOff) {
                    if (isMuted) {
                        iconVolumeOn.classList.add('hidden');
                        iconVolumeOff.classList.remove('hidden');
                    } else {
                        iconVolumeOn.classList.remove('hidden');
                        iconVolumeOff.classList.add('hidden');
                    }
                }
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                audioEl.volume = vol;
                if (vol === 0) {
                    audioEl.muted = true;
                    if (iconVolumeOn && iconVolumeOff) {
                        iconVolumeOn.classList.add('hidden');
                        iconVolumeOff.classList.remove('hidden');
                    }
                } else {
                    audioEl.muted = false;
                    isMuted = false;
                    if (iconVolumeOn && iconVolumeOff) {
                        iconVolumeOn.classList.remove('hidden');
                        iconVolumeOff.classList.add('hidden');
                    }
                }
            });
        }
    }

    // ===================================================
    // URL Query Parameters Parsing (SteamID & Map)
    // ===================================================
    function parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);

        const steamid = urlParams.get('steamid');
        if (steamid && playerSteamIdEl) {
            playerSteamIdEl.textContent = steamid;
            if (playerNameEl && playerNameEl.textContent === 'Подключение...') {
                playerNameEl.textContent = 'Игрок ' + steamid.slice(-4);
            }
        }

        const mapname = urlParams.get('mapname');
        if (mapname && mapNameEl) {
            mapNameEl.textContent = mapname;
        }
    }

    // ===================================================
    // Garry's Mod CEF JavaScript Callbacks Bridge
    // ===================================================
    let totalFiles = 0;
    let filesNeeded = 0;
    let isGModClient = false;

    // Called by GMod on initial connect
    window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode) {
        isGModClient = true;
        if (mapname && mapNameEl) {
            mapNameEl.textContent = mapname;
        }
        if (steamid && playerSteamIdEl) {
            playerSteamIdEl.textContent = steamid;
            if (playerNameEl && playerNameEl.textContent === 'Подключение...') {
                playerNameEl.textContent = 'Игрок ' + steamid.slice(-4);
            }
        }
        if (statusTextEl) {
            statusTextEl.textContent = 'Подключение к серверу...';
        }
    };

    // Called with total count of files to download
    window.SetFilesTotal = function (total) {
        isGModClient = true;
        totalFiles = Math.max(1, total);
        updateProgress();
    };

    // Called with remaining files needed
    window.SetFilesNeeded = function (needed) {
        isGModClient = true;
        filesNeeded = Math.max(0, needed);
        updateProgress();
    };

    // Called when a new file download begins
    window.DownloadingFile = function (fileName) {
        isGModClient = true;
        if (fileTextEl) {
            // Shorten filename if excessively long
            const clean = fileName.replace(/\\/g, '/');
            fileTextEl.textContent = 'Загрузка: ' + clean;
        }
        if (statusTextEl) {
            statusTextEl.textContent = 'Загрузка контента сервера...';
        }
    };

    // Called when GMod internal connection status changes
    window.SetStatusChanged = function (status) {
        isGModClient = true;
        if (statusTextEl && status) {
            statusTextEl.textContent = status;
        }
    };

    function updateProgress() {
        if (totalFiles <= 0) return;
        const downloaded = Math.max(0, totalFiles - filesNeeded);
        const pct = Math.min(100, Math.max(0, Math.round((downloaded / totalFiles) * 100)));

        if (progressBarEl) {
            progressBarEl.style.width = pct + '%';
        }
        if (percentageTextEl) {
            percentageTextEl.textContent = pct + '%';
        }
    }

    // ===================================================
    // Standalone Browser Demo Simulation Mode
    // ===================================================
    function runDemoSimulation() {
        if (isGModClient) return; // Running in real GMod client, do not override

        let demoPercent = 0;
        const demoSteps = [
            { pct: 15, status: "Подключение к серверу...", file: "Получение сведений о карте rp_evocity_v33x..." },
            { pct: 35, status: "Загрузка контента мастерской...", file: "Загрузка: models/player/custom_police.mdl" },
            { pct: 55, status: "Загрузка текстур и материалов...", file: "Загрузка: materials/models/cars/tdm_subaru.vtf" },
            { pct: 75, status: "Инициализация Lua скриптов...", file: "Загрузка: lua/autorun/sh_megapolis_daynight.lua" },
            { pct: 90, status: "Синхронизация данных игрока...", file: "Загрузка: data/darkrp/inventory_items.txt" },
            { pct: 100, status: "Добро пожаловать в Мегаполис!", file: "Клиент готов. Вход в игру..." }
        ];

        let stepIdx = 0;
        const demoInterval = setInterval(() => {
            if (isGModClient) {
                clearInterval(demoInterval);
                return;
            }

            demoPercent = Math.min(100, demoPercent + 1);
            if (progressBarEl) progressBarEl.style.width = demoPercent + '%';
            if (percentageTextEl) percentageTextEl.textContent = demoPercent + '%';

            if (stepIdx < demoSteps.length && demoPercent >= demoSteps[stepIdx].pct) {
                if (statusTextEl) statusTextEl.textContent = demoSteps[stepIdx].status;
                if (fileTextEl) fileTextEl.textContent = demoSteps[stepIdx].file;
                stepIdx++;
            }

            if (demoPercent >= 100) {
                clearInterval(demoInterval);
                // Loop simulation for continuous preview if kept open
                setTimeout(() => {
                    if (!isGModClient) runDemoSimulation();
                }, 4000);
            }
        }, 120);
    }

    // Initialize everything on DOM load
    window.addEventListener('DOMContentLoaded', () => {
        showSlide(0);
        startSlider();
        parseURLParams();
        initAudio();

        // Check if opened in a normal browser after 1.8 seconds
        setTimeout(() => {
            if (!isGModClient) {
                if (playerNameEl && playerNameEl.textContent === 'Подключение...') {
                    playerNameEl.textContent = 'Демонстрационный Режим';
                }
                runDemoSimulation();
            }
        }, 1800);
    });
})();

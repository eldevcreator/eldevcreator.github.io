document.addEventListener('DOMContentLoaded', () => {
    // Анимация заголовка
    function animateTitle() {
        const title = document.title;
        let index = 0;
        const interval = setInterval(() => {
            document.title = title.slice(0, index);
            index++;
            if (index > title.length) {
                clearInterval(interval);
                setTimeout(animateTitle, 1000);
            }
        }, 200);
    }
    animateTitle();

    // Основные элементы
    const overlay = document.getElementById('overlay');
    const audio = document.getElementById('background-music');
    const profile = document.getElementById('profile');
    const elements = document.querySelectorAll('.hidden-item');
    const volumeButton = document.getElementById('volume-button');
    const volumeSlider = document.getElementById('volume');
    const cursorTrail = document.getElementById('cursor-trail');
    const viewCounter = document.getElementById('views');
    const backgroundRect = document.getElementById('background-rect');
    const bioButton = document.querySelector('.bio-button');
    const bioText = document.querySelector('.bio-text');
    const nowPlaying = document.getElementById('now-playing');
    const trackInfo = document.getElementById('track-info');

    let views = localStorage.getItem('views') || 0;
    views = parseInt(views) + 1;
    localStorage.setItem('views', views);
    viewCounter.textContent = views;

    async function getYouTubeSubscribers() {
        try {
            const apiKey = 'google_api_key';
            const channelId = 'UClvApXvadLh8XlvMvQvivKA';
            
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
            );
            
            const data = await response.json();
            
            if (data.items && data.items[0]) {
                const subs = data.items[0].statistics.subscriberCount;
                document.getElementById('youtube-subs').textContent = 
                    Number(subs).toLocaleString();
            } else {
                document.getElementById('youtube-subs').textContent = "N/A";
            }
        } catch (error) {
            console.error('YouTube API Error:', error);
            document.getElementById('youtube-subs').textContent = "Ошибка";
            tryAlternativeYouTubeMethod();
        }
    }

    async function tryAlternativeYouTubeMethod() {
        try {
            const channelUrl = 'https://www.youtube.com/@eldevcreator';
            const response = await fetch(`https://mixerno.space/api/youtube-channel-counter/user/${encodeURIComponent(channelUrl)}`);
            const data = await response.json();
            
            if (data.counts && data.counts[0] && data.counts[0].count) {
                document.getElementById('youtube-subs').textContent = 
                    Number(data.counts[0].count).toLocaleString();
            }
        } catch (error) {
            console.error('Alternative YouTube method failed:', error);
        }
    }

    async function getTwitchFollowers() {
        try {

            const clientId = 'YOUR_TWITCH_CLIENT_ID';
            const accessToken = 'YOUR_TWITCH_ACCESS_TOKEN';
            const channelName = 'eldevcreator';
            
            // Получаем ID пользователя
            const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            const userData = await userResponse.json();
            
            if (userData.data && userData.data[0]) {
                const userId = userData.data[0].id;
                
                // Получаем количество подписчиков
                const followersResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${userId}&first=1`, {
                    headers: {
                        'Client-ID': clientId,
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                const followersData = await followersResponse.json();
                document.getElementById('twitch-followers').textContent = 
                    followersData.total.toLocaleString();
            } else {
                document.getElementById('twitch-followers').textContent = "N/A";
            }
        } catch (error) {
            console.error('Twitch API Error:', error);
            document.getElementById('twitch-followers').textContent = "Ошибка";
        }
    }

    // Инициализация и обновление счетчиков
    function initializeCounters() {
        // Первоначальная загрузка
        getYouTubeSubscribers();
        getTwitchFollowers();
        
        // Обновляем каждые 5 минут (из-за ограничений API)
        setInterval(getYouTubeSubscribers, 300000); // 5 минут
        setInterval(getTwitchFollowers, 300000);    // 5 минут
    }

    // ========== ОСТАЛЬНАЯ ЛОГИКА ========== //

    // Обработчик клика по оверлею
    overlay.addEventListener('click', async () => {
        try {
            await audio.play();
            overlay.style.display = 'none';
            profile.classList.add('profile-visible');

            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('item-visible');
                }, index * 150);
            });

            // Инициализация счетчиков после показа профиля
            initializeCounters();
            
            getCurrentTrack();
            setInterval(getCurrentTrack, 5000);
        } catch (error) {
            console.error('Ошибка воспроизведения:', error);
            alert('Разрешите воспроизведение аудио!');
        }
    });

    // Управление громкостью
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    volumeButton.addEventListener('click', () => {
        volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
    });

    // Эффект снега для курсора
    function createSnow() {
        const particle = document.createElement('div');
        particle.classList.add('cursor-particle');
        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `-10px`;
        cursorTrail.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
    setInterval(createSnow, 100);

    // 3D эффект для фона
    document.addEventListener('mousemove', (e) => {
        const rect = backgroundRect.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / rect.height) * -5;
        const rotateY = (mouseX / rect.width) * 5;

        backgroundRect.style.transform = `
            translate(-50%, -50%)
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
        backgroundRect.style.boxShadow = `
            ${-mouseX / 20}px ${-mouseY / 20}px 30px rgba(0, 0, 0, 0.5)
        `;
    });

    document.addEventListener('mouseleave', () => {
        backgroundRect.style.transform = `
            translate(-50%, -50%)
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
        `;
        backgroundRect.style.boxShadow = `0 0 50px rgba(0, 0, 0, 0.3)`;
    });

    // Био кнопка
    if (bioButton && bioText) {
        bioButton.addEventListener('click', () => {
            if (bioText.classList.contains('visible')) {
                bioText.classList.remove('visible');
                bioText.classList.add('hidden');
            } else {
                bioText.classList.remove('hidden');
                bioText.classList.add('visible');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (bioText.classList.contains('visible') && 
            !bioButton.contains(e.target) && 
            !bioText.contains(e.target)) {
            bioText.classList.remove('visible');
            bioText.classList.add('hidden');
        }
    });

    // Last.fm текущий трек
    const lastFmApiKey = '48c88a7502bc703003147a37bf3939c3';
    const lastFmUser = 'eldevcreator';

    async function getCurrentTrack() {
        try {
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUser}&api_key=${lastFmApiKey}&format=json&limit=1`
            );
            const data = await response.json();

            if (data.recenttracks && data.recenttracks.track.length > 0) {
                const track = data.recenttracks.track[0];
                const trackName = track.name;
                const artistName = track.artist['#text'];
                const isNowPlaying = track['@attr']?.nowplaying === 'true';

                if (isNowPlaying) {
                    trackInfo.textContent = `${trackName} - ${artistName}`;
                    nowPlaying.classList.add('visible');
                } else {
                    trackInfo.textContent = 'Ничего не играет.';
                    nowPlaying.classList.remove('visible');
                }
            } else {
                trackInfo.textContent = 'Не удалось загрузить данные.';
                nowPlaying.classList.remove('visible');
            }
        } catch (error) {
            console.error('Last.fm Error:', error);
            nowPlaying.classList.remove('visible');
        }
    }

    setInterval(getCurrentTrack, 1000);
    getCurrentTrack();
});

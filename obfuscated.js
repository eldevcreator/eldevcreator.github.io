document.addEventListener('DOMContentLoaded', () => {
    const videoBackground = document.createElement('video');
    videoBackground.id = 'video-bg';
    videoBackground.src = 'video/video.mp4';
    videoBackground.autoplay = true;
    videoBackground.muted = true;
    videoBackground.loop = true;
    videoBackground.playsinline = true;
    videoBackground.style.position = 'fixed';
    videoBackground.style.top = '0';
    videoBackground.style.left = '0';
    videoBackground.style.width = '100vw';
    videoBackground.style.height = '100vh';
    videoBackground.style.objectFit = 'cover';
    videoBackground.style.zIndex = '-1';
    document.body.prepend(videoBackground);

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
    setTimeout(animateTitle, 1000);

    const overlay = document.getElementById('overlay');
    const audio = document.getElementById('background-music');
    const profile = document.getElementById('profile');
    const elements = document.querySelectorAll('.hidden-item');
    const volumeButton = document.getElementById('volume-button');
    const volumeControl = document.getElementById('volume-control');
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

    function playMedia() {
        audio.volume = 0.5;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                videoBackground.muted = false;
                overlay.style.display = 'none';
                profile.classList.add('profile-visible');
                showElements();
                initializeCounters();
            })
            .catch(error => {
                overlay.style.display = 'flex';
                overlay.querySelector('p').textContent = 'Нажмите для включения звука';
            });
        }
    }

    function showElements() {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('item-visible');
                if (el.id === 'volume-control') {
                    showVolumeControl();
                }
            }, index * 150);
        });
    }

    function showVolumeControl() {
        volumeControl.style.opacity = '0';
        volumeControl.style.transform = 'translateY(20px)';
        setTimeout(() => {
            volumeControl.style.transition = 'all 0.5s ease';
            volumeControl.style.opacity = '1';
            volumeControl.style.transform = 'translateY(0)';
        }, 300);
    }

    async function getYouTubeSubscribers() {
        try {
            const apiKey = 'AIzaSyC1INfbCv8zPkZA56nbfQCWH5oser9Botc';
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

    function initializeCounters() {
        getYouTubeSubscribers();
        setInterval(getYouTubeSubscribers, 300000);
    }

    overlay.addEventListener('click', async () => {
        try {
            await playMedia();
        } catch (error) {
            console.error('Ошибка воспроизведения:', error);
        }
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    volumeButton.addEventListener('click', () => {
        if (volumeSlider.style.display === 'none') {
            volumeSlider.style.display = 'block';
            setTimeout(() => {
                volumeSlider.style.opacity = '1';
                volumeSlider.style.transform = 'translateX(0)';
            }, 10);
        } else {
            volumeSlider.style.opacity = '0';
            volumeSlider.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                volumeSlider.style.display = 'none';
            }, 300);
        }
    });

    volumeSlider.style.display = 'none';
    volumeSlider.style.opacity = '0';
    volumeSlider.style.transform = 'translateX(-10px)';
    volumeSlider.style.transition = 'all 0.3s ease';

    const cursorParticles = [];
    const maxParticles = 10;

    document.addEventListener('mousemove', (e) => {
        const particle = document.createElement('div');
        particle.classList.add('cursor-particle');
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        cursorTrail.appendChild(particle);

        cursorParticles.push(particle);

        if (cursorParticles.length > maxParticles) {
            const oldParticle = cursorParticles.shift();
            oldParticle.style.opacity = '0';
            setTimeout(() => oldParticle.remove(), 300);
        }

        setTimeout(() => {
            particle.style.opacity = '0';
            setTimeout(() => particle.remove(), 300);
        }, 500);

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

    if (bioButton && bioText) {
        bioButton.addEventListener('click', () => {
            bioText.classList.toggle('visible');
            bioText.classList.toggle('hidden');
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

    async function getCurrentTrack() {
        const lastFmApiKey = '48c88a7502bc703003147a37bf3939c3';
        const lastFmUser = 'eldevcreator';

        try {
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUser}&api_key=${lastFmApiKey}&format=json&limit=1`
            );
            const data = await response.json();

            if (data.recenttracks?.track?.length > 0) {
                const track = data.recenttracks.track[0];
                trackInfo.textContent = track['@attr']?.nowplaying === 'true' 
                    ? `${track.name} - ${track.artist['#text']}`
                    : 'Ничего не играет.';
                nowPlaying.classList.toggle('visible', track['@attr']?.nowplaying === 'true');
            }
        } catch (error) {
            nowPlaying.classList.remove('visible');
        }
    }

    setTimeout(playMedia, 1500);
});

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    document.getElementById('cursor-trail').style.display = 'none';
    document.body.style.cursor = 'default';

    const style = document.createElement('style');
    style.textContent = `
        .cursor-particle, #background-rect::before {
            display: none !important;
        }
        #background-rect {
            transform: translate(-50%, -50%) !important;
            box-shadow: 0 0 30px rgba(0,0,0,0.5) !important;
        }
        #video-bg {
            opacity: 0.5 !important;
        }
    `;
    document.head.appendChild(style);
}

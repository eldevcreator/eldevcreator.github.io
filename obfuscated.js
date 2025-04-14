document.addEventListener('DOMContentLoaded', () => {
    const videoBackground = document.createElement('video');
    videoBackground.id = 'video-bg';
    videoBackground.src = 'video/video.mp4';
    videoBackground.loop = true;
    videoBackground.playsinline = true;
    videoBackground.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; object-fit:cover; z-index:-1; opacity:0.7;';
    document.body.prepend(videoBackground);

    function animateTitle() {
        const title = document.title;
        let index = 0;
        const interval = setInterval(() => {
            document.title = title.slice(0, index);
            index++;
            if (index > title.length) clearInterval(interval);
        }, 200);
        setTimeout(animateTitle, 1000);
    }
    animateTitle();

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

    let views = parseInt(localStorage.getItem('views') || 0) + 1;
    localStorage.setItem('views', views);
    viewCounter.textContent = views;

    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const particle = document.createElement('div');
        particle.style.cssText = `
            position:fixed;
            width:8px;
            height:8px;
            background:rgba(255,255,255,0.7);
            border-radius:50%;
            pointer-events:none;
            left:${e.pageX - 4}px;
            top:${e.pageY - 4}px;
            transition:all 0.6s ease;
        `;
        cursorTrail.appendChild(particle);
        
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(2)';
            setTimeout(() => particle.remove(), 600);
        }, 50);
    });

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        profile.classList.add('profile-visible');
        videoBackground.play();
        
        elements.forEach((el, index) => {
            setTimeout(() => el.classList.add('item-visible'), index * 150);
        });

        audio.play().catch(() => alert('Разрешите воспроизведение аудио!'));
        getYouTubeSubscribers();
        setInterval(getCurrentTrack, 5000);
    });

    volumeSlider.addEventListener('input', () => audio.volume = volumeSlider.value);

    volumeButton.addEventListener('click', () => {
        volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('mousemove', (e) => {
        const rect = backgroundRect.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        backgroundRect.style.transform = `
            translate(-50%, -50%)
            perspective(1000px)
            rotateX(${(e.clientY - centerY) / 20}deg)
            rotateY(${-(e.clientX - centerX) / 20}deg)
        `;
    });

    bioButton.addEventListener('click', () => {
        bioText.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
        if (!bioButton.contains(e.target) && !bioText.contains(e.target)) {
            bioText.classList.remove('visible');
        }
    });

    async function getYouTubeSubscribers() {
        try {
            const response = await fetch(`https://mixerno.space/api/youtube-channel-counter/user/${encodeURIComponent('https://www.youtube.com/@eldevcreator')}`);
            const data = await response.json();
            document.getElementById('youtube-subs').textContent = data.counts?.[0]?.count?.toLocaleString() || 'N/A';
        } catch {
            document.getElementById('youtube-subs').textContent = 'Ошибка';
        }
    }

    async function getCurrentTrack() {
        try {
            const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=eldevcreator&api_key=48c88a7502bc703003147a37bf3939c3&format=json&limit=1`);
            const data = await response.json();
            const track = data.recenttracks?.track?.[0];
            trackInfo.textContent = track?.['@attr']?.nowplaying === 'true' ? `${track.name} - ${track.artist['#text']}` : 'Ничего не играет';
            nowPlaying.classList.toggle('visible', track?.['@attr']?.nowplaying === 'true');
        } catch {
            nowPlaying.classList.remove('visible');
        }
    }

    if (/Mobi|Android/i.test(navigator.userAgent)) {
        document.body.style.cursor = 'default';
        const style = document.createElement('style');
        style.textContent = '#background-rect{transform:translate(-50%,-50%)!important; box-shadow:0 0 30px rgba(0,0,0,0.5)!important;}';
        document.head.appendChild(style);
    }
});

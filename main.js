document.addEventListener('DOMContentLoaded', () => {

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
            console.error('YouTube API Error:', error);
            document.getElementById('youtube-subs').textContent = "Ошибка";
            tryAlternativeYouTubeMethod();
        }
    }
                

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

            initializeCounters();
            
            getCurrentTrack();
            setInterval(getCurrentTrack, 5000);
        }
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    volumeButton.addEventListener('click', () => {
        volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
    });

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
});

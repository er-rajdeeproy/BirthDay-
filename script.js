(() => {
  'use strict';

  function init() {
    const openButton = document.getElementById('openBtn');
    const overlay = document.getElementById('startOverlay');
    const heartsContainer = document.getElementById('hearts');

    if (!openButton || !overlay) {
      console.error('Birthday page: start button or overlay was not found.');
      return;
    }

    let player = null;
    let youtubeReady = false;
    let experienceStarted = false;
    let pendingPlay = false;

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('youtube-player', {
        videoId: 'JAP_Acr8jUM',
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: 'JAP_Acr8jUM',
          playsinline: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            youtubeReady = true;
            if (pendingPlay) playMusic();
          }
        }
      });
    };

    function playMusic() {
      if (!player || typeof player.playVideo !== 'function') return;
      try {
        player.unMute();
        player.setVolume(100);
        player.playVideo();
      } catch (error) {
        console.warn('Music could not be started:', error);
      }
    }

    function startExperience(event) {
      if (event) event.preventDefault();
      if (experienceStarted) return;
      experienceStarted = true;
      pendingPlay = true;

      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      openButton.disabled = true;

      if (youtubeReady) playMusic();

      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      window.setTimeout(() => {
        overlay.style.display = 'none';
      }, 750);
    }

    openButton.addEventListener('click', startExperience);
    openButton.addEventListener('touchend', startExperience, { passive: false });

    function createHeart() {
      if (!heartsContainer) return;
      const heart = document.createElement('span');
      const symbols = ['💖', '💕', '💗', '❤️', '🌸', '✨'];
      heart.className = 'heart';
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${Math.random() * 95}vw`;
      heart.style.animationDuration = `${5 + Math.random() * 5}s`;
      heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 140}px`);
      heartsContainer.appendChild(heart);
      window.setTimeout(() => heart.remove(), 10000);
    }

    if (heartsContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.setInterval(createHeart, 450);
    }

    const youtubeScript = document.createElement('script');
    youtubeScript.src = 'https://www.youtube.com/iframe_api';
    youtubeScript.async = true;
    document.head.appendChild(youtubeScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

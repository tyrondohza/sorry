const openingScreen = document.getElementById('opening-screen');
const enterButton = document.getElementById('enter-button');
const readButton = document.getElementById('read-button');
const musicButton = document.getElementById('music-button');
const controlLabel = musicButton?.querySelector('.control-label');
const backgroundSong = document.getElementById('background-song');
const letter = document.getElementById('letter');
const closingMessage = document.getElementById('closing-message');
const particleLayer = document.querySelector('.ambient-particles');
const petalLayer = document.querySelector('.petal-layer');
const cursorLayer = document.querySelector('.cursor-hearts');

const createFloatingElements = () => {
  for (let index = 0; index < 28; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.setProperty('--left', `${Math.random() * 100}%`);
    particle.style.setProperty('--size', `${1 + Math.random() * 3}px`);
    particle.style.setProperty('--duration', `${10 + Math.random() * 15}s`);
    particle.style.setProperty('--delay', `${Math.random() * -20}s`);
    particle.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
    particle.style.setProperty('--opacity', `${0.25 + Math.random() * 0.55}`);
    particleLayer?.appendChild(particle);
  }

  for (let index = 0; index < 10; index += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--left', `${Math.random() * 100}%`);
    petal.style.setProperty('--duration', `${15 + Math.random() * 12}s`);
    petal.style.setProperty('--delay', `${Math.random() * -22}s`);
    petal.style.setProperty('--drift', `${-160 + Math.random() * 320}px`);
    petalLayer?.appendChild(petal);
  }
};

const scrollToLetter = () => {
  letter?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

enterButton?.addEventListener('click', async () => {
  openingScreen?.classList.add('is-hidden');
  if (backgroundSong) {
    backgroundSong.volume = 0.32;
    try {
      await backgroundSong.play();
      musicButton?.setAttribute('aria-pressed', 'true');
      if (controlLabel) controlLabel.textContent = 'Sound on';
    } catch {
      if (controlLabel) controlLabel.textContent = 'Tap for sound';
    }
  }
  window.setTimeout(scrollToLetter, 700);
});

readButton?.addEventListener('click', scrollToLetter);

const toggleAmbientSound = async () => {
  if (!backgroundSong) return;
  const isPlaying = musicButton?.getAttribute('aria-pressed') === 'true';

  if (isPlaying) {
    backgroundSong.pause();
  } else {
    backgroundSong.volume = 0.32;
    await backgroundSong.play();
  }

  musicButton?.setAttribute('aria-pressed', String(!isPlaying));
  if (controlLabel) controlLabel.textContent = isPlaying ? 'Sound off' : 'Sound on';
};

musicButton?.addEventListener('click', toggleAmbientSound);

const addCursorHeart = (event) => {
  if (window.matchMedia('(pointer: coarse)').matches || !cursorLayer) return;

  const heart = document.createElement('span');
  heart.className = 'cursor-heart';
  heart.textContent = '❤';
  heart.style.left = `${event.clientX}px`;
  heart.style.top = `${event.clientY}px`;
  heart.style.setProperty('--size', `${8 + Math.random() * 8}px`);
  heart.style.setProperty('--drift', `${-24 + Math.random() * 48}px`);
  cursorLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), 900);
};

let lastPointerTime = 0;
document.addEventListener('pointermove', (event) => {
  const now = Date.now();
  if (now - lastPointerTime > 110) {
    addCursorHeart(event);
    lastPointerTime = now;
  }
});

if (closingMessage && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      closingMessage.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(closingMessage);
}

createFloatingElements();

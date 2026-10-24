const intro = document.getElementById('intro');
const main = document.getElementById('mainContent');
const startButton = document.getElementById('startButton');
const surpriseButton = document.getElementById('surpriseButton');
const finalMessage = document.getElementById('finalMessage');
const effects = document.getElementById('effects');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

startButton.addEventListener('click', () => {
  main.classList.remove('hidden');
  intro.classList.add('fade-out');
  startButton.disabled = true;
  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('home').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
  }, 950);
  createHearts(12);
  startAmbientHearts();
  observeReveals();
});

function createHeart() {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > .5 ? '♡' : '♥';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (14 + Math.random() * 20) + 'px';
  heart.style.animationDuration = (5 + Math.random() * 4) + 's';
  effects.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove(), {once:true});
}
function createHearts(count=1) {
  for (let i=0; i<count; i++) setTimeout(createHeart, i * 140);
}
let ambientStarted = false;
function startAmbientHearts() {
  if (ambientStarted || reduceMotion) return;
  ambientStarted = true;
  setInterval(() => {
    if (!document.hidden && !main.classList.contains('hidden')) createHeart();
  }, 1800);
}

function observeReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  items.forEach(item => observer.observe(item));
}

document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    const image = card.dataset.photo;
    lightboxImage.src = image;
    lightboxImage.alt = card.querySelector('img').alt;
    lightbox.classList.remove('hidden');
    closeLightbox.focus();
  });
});
function closePhoto() {
  lightbox.classList.add('hidden');
  lightboxImage.src = '';
}
closeLightbox.addEventListener('click', closePhoto);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closePhoto();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closePhoto();
});

surpriseButton.addEventListener('click', () => {
  finalMessage.classList.remove('hidden');
  surpriseButton.textContent = 'Birthday wishes, just for you ♡';
  surpriseButton.disabled = true;
  surpriseButton.style.opacity = '.75';
  createHearts(22);
  createConfetti(90);
  finalMessage.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'center'});
});

function createConfetti(count=60) {
  if (reduceMotion) return;
  const colors = ['#ffabc5','#ed668e','#f4d6b0','#ffffff'];
  for (let i=0; i<count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = Math.random()*100 + 'vw';
    piece.style.animationDelay = Math.random()*1.1 + 's';
    piece.style.animationDuration = (2 + Math.random()*2) + 's';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    effects.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove(), {once:true});
  }
}

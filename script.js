// Scroll progress bar
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(window.scrollY / total) * 100}%`;
}, { passive: true });

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
  hamburger.classList.add('active');
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Scroll reveal via IntersectionObserver
const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

reveals.forEach(el => revealObserver.observe(el));

// ── Depoimentos carousel ─────────────────────────────────────────────────────
const DEFAULT_REVIEWS = [
  {
    stars: 5,
    text: 'O capuccino com cacau 55% é simplesmente incrível. Cada gole é uma experiência única — cremoso, intenso e acolhedor. Me tornei cliente fiel!',
    author: 'Mariana S.'
  },
  {
    stars: 5,
    text: 'O BOOM Dali mudou minha rotina matinal. Me sinto com muito mais energia e leveza durante o dia. Um produto que realmente faz diferença.',
    author: 'Fernanda L.'
  },
  {
    stars: 5,
    text: 'Amei o kit degustação! As combinações são perfeitas e tudo muito bem apresentado. Um mimo para o paladar. Já recomendei para amigas.',
    author: 'Ana Clara M.'
  },
  {
    stars: 5,
    text: 'Atendimento impecável e produtos de altíssima qualidade. Dali é aquele lugar que você quer frequentar sempre e presentear quem ama.',
    author: 'Juliana P.'
  },
  {
    stars: 5,
    text: 'O iogurte com granola e geleia é maravilhoso — leve, nutritivo e delicioso. Não consigo imaginar meu café da manhã sem ele.',
    author: 'Camila R.'
  },
  {
    stars: 5,
    text: 'A bisnaguinha de cenoura com creme de avelã é o lanche perfeito. Prático, saboroso e saudável. Dali entende o que a gente precisa!',
    author: 'Letícia M.'
  }
];

function initDepoimentos(reviews) {
  const track = document.getElementById('dep-track');
  const dotsEl = document.getElementById('dep-dots');
  if (!track || !dotsEl) return;

  const inner = document.createElement('div');
  inner.className = 'dep-inner';

  reviews.forEach(r => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<i class="fa-${i < r.stars ? 'solid' : 'regular'} fa-star"></i>`
    ).join('');
    const card = document.createElement('div');
    card.className = 'dep-card';
    card.innerHTML =
      `<div class="dep-stars">${stars}</div>` +
      `<p class="dep-text">${r.text}</p>` +
      (r.author ? `<span class="dep-author">${r.author}</span>` : '');
    inner.appendChild(card);
  });

  track.innerHTML = '';
  track.appendChild(inner);

  let current = 0;

  function perView() {
    return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }

  function maxIdx() {
    return Math.max(0, reviews.length - perView());
  }

  function cardWidth() {
    const cards = inner.querySelectorAll('.dep-card');
    if (!cards.length) return 0;
    const gap = parseFloat(getComputedStyle(inner).gap) || 20;
    return cards[0].offsetWidth + gap;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx()));
    inner.style.transform = `translateX(-${current * cardWidth()}px)`;
    dotsEl.querySelectorAll('.dep-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    const prev = track.closest('.dep-track-wrap').querySelector('.dep-prev');
    const next = track.closest('.dep-track-wrap').querySelector('.dep-next');
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current >= maxIdx();
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const count = maxIdx() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'dep-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  buildDots();
  goTo(0);

  const wrap = track.closest('.dep-track-wrap');
  wrap.querySelector('.dep-prev').addEventListener('click', () => goTo(current - 1));
  wrap.querySelector('.dep-next').addEventListener('click', () => goTo(current + 1));

  // Touch swipe
  let startX = 0;
  inner.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  inner.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });

  // Keyboard navigation when section is focused
  document.addEventListener('keydown', e => {
    const dep = document.getElementById('depoimentos');
    if (!dep) return;
    const rect = dep.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft') goTo(current - 1);
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(Math.min(current, maxIdx())); }, 150);
  });
}

document.addEventListener('DOMContentLoaded', () => initDepoimentos(DEFAULT_REVIEWS));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

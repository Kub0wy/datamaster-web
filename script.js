const canvas = document.getElementById('binaryCanvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let particles = [];
let rafId;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles(rect.width, rect.height);
}

function createParticles(width, height) {
  particles = [];
  const rows = Math.max(22, Math.floor(height / 18));
  const cols = Math.max(24, Math.floor(width / 26));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const t = col / (cols - 1);
      const spread = (1 - t) * height * 0.42 + 14;
      const centerY = height * 0.49;
      const yBase = centerY + ((row / (rows - 1)) - 0.5) * spread;
      const x = width * 0.08 + t * width * 0.72;
      const jitter = (1 - t) * 28;
      particles.push({
        x: x + (Math.random() - 0.5) * jitter,
        y: yBase + (Math.random() - 0.5) * jitter,
        baseX: x,
        baseY: yBase,
        value: Math.random() > 0.5 ? '1' : '0',
        alpha: 0.18 + t * 0.78,
        speed: 0.0007 + Math.random() * 0.0012,
        phase: Math.random() * Math.PI * 2,
        size: 8 + (1 - t) * 6
      });
    }
  }
}

function draw(time = 0) {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  const glow = ctx.createRadialGradient(rect.width * 0.73, rect.height * 0.5, 0, rect.width * 0.73, rect.height * 0.5, rect.width * 0.34);
  glow.addColorStop(0, 'rgba(79,157,255,.18)');
  glow.addColorStop(1, 'rgba(79,157,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  particles.forEach((p, index) => {
    const t = (p.baseX - rect.width * 0.08) / (rect.width * 0.72);
    const wave = prefersReducedMotion ? 0 : Math.sin(time * p.speed + p.phase) * (1 - t) * 6;
    const pulse = prefersReducedMotion ? 1 : 0.76 + Math.sin(time * 0.0018 + index * 0.12) * 0.24;
    ctx.font = `${p.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillStyle = `rgba(${160 + Math.floor(t * 80)}, ${180 + Math.floor(t * 45)}, 255, ${p.alpha * pulse})`;
    ctx.fillText(p.value, p.x, p.y + wave);
  });

  if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
draw();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const closeButton = document.querySelector('.menu-close');

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

menuButton?.addEventListener('click', () => setMenu(true));
closeButton?.addEventListener('click', () => setMenu(false));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

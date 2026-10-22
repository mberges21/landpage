// Press kit: reveal-on-scroll, print button, copy-bio buttons (no inline scripts, for the CSP)
const es = document.documentElement.lang === 'es';
const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('on'); obs.unobserve(x.target); } }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
window.addEventListener('beforeprint', () => document.querySelectorAll('.reveal').forEach(el => el.classList.add('on')));
document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));

const L = es ? { copied: 'Copiado ✓', manual: 'Selecciona y copia', copy: 'Copiar' } : { copied: 'Copied ✓', manual: 'Select & copy', copy: 'Copy' };
document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', async () => {
  const text = [...document.getElementById(btn.dataset.copy).querySelectorAll('p')].map(p => p.textContent.trim()).join('\n\n');
  try { await navigator.clipboard.writeText(text); btn.textContent = L.copied; }
  catch { btn.textContent = L.manual; }
  setTimeout(() => btn.textContent = L.copy, 2000);
}));
document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

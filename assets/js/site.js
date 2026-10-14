// Reveal on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Mobile menu
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }

// Mark the current page in the nav
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('current');
});

// Nav background on scroll + sticky mobile CTA once past the hero
const nav = document.getElementById('nav');
const sticky = document.querySelector('.sticky-cta');
const hero = document.querySelector('.hero, .page-hero');
const contact = document.getElementById('contact');
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  if (sticky) {
    const pastHero = hero ? window.scrollY > hero.offsetHeight * .7 : true;
    const atContact = contact && window.scrollY + window.innerHeight > contact.offsetTop + 120;
    sticky.classList.toggle('show', pastHero && !atContact);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Prefill the service dropdown from any CTA with data-service
const serviceSelect = document.getElementById('f-service');
if (serviceSelect) {
  document.querySelectorAll('[data-service]').forEach(el => {
    el.addEventListener('click', () => {
      const opt = [...serviceSelect.options].find(o => o.value === el.dataset.service);
      if (opt) serviceSelect.value = opt.value;
    });
  });
}

// Until a Formspree ID is set, fall back to opening the visitor's email app
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    if (!form.action.includes('YOUR_FORM_ID')) return;
    e.preventDefault();
    const d = new FormData(form);
    const extra = [...d.entries()]
      .filter(([k]) => !['name', 'email', 'service', 'message'].includes(k) && d.get(k))
      .map(([k, v]) => `${k}: ${v}`).join('\n');
    const subject = encodeURIComponent(`${d.get('service') || 'Enquiry'} — ${d.get('name')}`);
    const body = encodeURIComponent(`${d.get('message')}\n\n${extra ? extra + '\n\n' : ''}— ${d.get('name')} (${d.get('email')})`);
    window.location.href = `mailto:marcelo@marcelo-berges.com?subject=${subject}&body=${body}`;
  });
}

// Decorative waveform (Studio)
(function () {
  const g = document.getElementById('waveBars');
  if (!g) return;
  let html = '';
  for (let i = 0; i < 150; i++) {
    const t = i / 150;
    const h = 20 + Math.abs(Math.sin(t * 19) * Math.cos(t * 7.3) + Math.sin(t * 43) * .35) * 160 * (0.4 + Math.sin(t * Math.PI) * .6);
    html += `<rect x="${i * 8}" y="${110 - h / 2}" width="3" height="${h}" rx="1.5"/>`;
  }
  g.innerHTML = html;
})();

document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

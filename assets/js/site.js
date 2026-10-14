// Reveal on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Mobile menu
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }

// Mark the current page in the nav
const here = location.pathname.replace(/index\.html$/, '');
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && href.length > 4 && href === here) a.classList.add('current');
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

// Send the contact form straight to Marcelo's inbox (FormSubmit) and confirm on the page
const L = document.documentElement.lang === 'es' ? {
  sending: 'Enviando…', received: 'Mensaje recibido', thanks: 'Gracias',
  body: 'Tu mensaje ya está en camino. Leo cada uno personalmente y te responderé pronto.',
  error: 'Algo ha fallado al enviar tu mensaje. Inténtalo de nuevo o escríbeme a',
} : {
  sending: 'Sending…', received: 'Message received', thanks: 'Thank you',
  body: 'Your message is on its way to me. I read every one personally and will get back to you soon.',
  error: 'Something went wrong sending your message. Please try again, or write to me at',
};
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.textContent;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = new FormData(form);
    if (d.get('_honey')) return; // spam bot filled the hidden field
    d.set('_subject', `${d.get('service') || 'Enquiry'} — ${d.get('name')} · marcelo-berges.com`);
    d.set('page', document.title);
    button.disabled = true;
    button.textContent = L.sending;
    try {
      const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: d,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === 'false') throw new Error(json.message || res.status);
      const first = (d.get('name') || '').toString().split(' ')[0].replace(/[<>&"]/g, '');
      form.innerHTML = `<div class="form-sent"><span class="eyebrow">${L.received}</span>
        <h3>${L.thanks}, ${first}.</h3>
        <p>${L.body}</p></div>`;
    } catch (err) {
      button.disabled = false;
      button.textContent = buttonText;
      status.innerHTML = `${L.error} <a href="mailto:marcelo@marcelo-berges.com">marcelo@marcelo-berges.com</a>.`;
      status.classList.add('error');
    }
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

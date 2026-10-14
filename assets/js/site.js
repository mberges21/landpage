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
  replyTo: 'Te responderé a', confirm: 'En unos minutos recibirás un email de confirmación. Si no llega (revisa también spam), puede que el email esté mal escrito.',
  fix: '¿Email incorrecto? Corregir', didYouMean: '¿Quisiste decir', corrected: 'email corregido',
  error: 'Algo ha fallado al enviar tu mensaje. Inténtalo de nuevo o escríbeme a',
} : {
  sending: 'Sending…', received: 'Message received', thanks: 'Thank you',
  body: 'Your message is on its way to me. I read every one personally and will get back to you soon.',
  replyTo: "I'll reply to", confirm: "You'll get a confirmation email in a few minutes. If it doesn't arrive (check spam too), the address may be mistyped.",
  fix: 'Wrong email? Fix it', didYouMean: 'Did you mean', corrected: 'corrected email',
  error: 'Something went wrong sending your message. Please try again, or write to me at',
};
const esc = v => String(v || '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

// Spot common email-domain typos (gmial.com, hotmial.es, outlok.com…) and offer a one-click fix
const DOMAINS = ['gmail.com', 'hotmail.com', 'hotmail.es', 'outlook.com', 'outlook.es', 'yahoo.com', 'yahoo.es',
  'icloud.com', 'me.com', 'live.com', 'msn.com', 'protonmail.com', 'proton.me', 'gmx.com', 'gmx.es', 'telefonica.net'];
function distance(a, b) { // edit distance where swapping two neighbouring letters counts as one mistake
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) m[i][j] = Math.min(m[i][j], m[i - 2][j - 2] + 1);
    }
  return m[a.length][b.length];
}
function suggestEmail(email) {
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || DOMAINS.includes(domain)) return null;
  const fixedTld = domain.replace(/\.(con|cmo|ocm|vom|comm|om)$/, '.com').replace(/\.(ess|se)$/, '.es');
  let best = DOMAINS.includes(fixedTld) ? fixedTld : null, bestD = 3;
  if (!best) for (const d of DOMAINS) {
    const dist = distance(domain, d);
    if (dist < bestD && dist <= (domain.length >= 8 ? 2 : 1)) { best = d; bestD = dist; }
  }
  if (!best && fixedTld !== domain) best = fixedTld;
  return best ? email.slice(0, at + 1) + best : null;
}

const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.textContent;
  const emailInput = form.querySelector('#f-email');
  const hint = document.getElementById('emailHint');
  let resending = false;

  const checkEmail = () => {
    if (!hint) return;
    const s = suggestEmail(emailInput.value.trim());
    hint.hidden = !s;
    if (s) hint.innerHTML = `${L.didYouMean} <button type="button">${esc(s)}</button>?`;
  };
  emailInput.addEventListener('blur', checkEmail);
  emailInput.addEventListener('input', () => { if (hint && !hint.hidden) checkEmail(); });
  hint?.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    emailInput.value = e.target.textContent;
    hint.hidden = true;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = new FormData(form);
    if (d.get('_honey')) return; // spam bot filled the hidden field
    d.set('_subject', `${d.get('service') || 'Enquiry'} — ${d.get('name')}${resending ? ' (' + L.corrected + ')' : ''} · marcelo-berges.com`);
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
      const first = esc((d.get('name') || '').toString().split(' ')[0]);
      const sent = document.createElement('div');
      sent.className = 'form-sent';
      sent.innerHTML = `<span class="eyebrow">${L.received}</span>
        <h3>${L.thanks}, ${first}.</h3>
        <p>${L.body}</p>
        <p class="sent-email">${L.replyTo} <strong>${esc(d.get('email'))}</strong></p>
        <p class="sent-note">${L.confirm}</p>
        <button type="button" class="text-link fix-email">${L.fix}</button>`;
      form.classList.add('sent');
      form.appendChild(sent);
      sent.querySelector('.fix-email').addEventListener('click', () => {
        sent.remove();
        form.classList.remove('sent');
        button.disabled = false;
        button.textContent = buttonText;
        resending = true;
        emailInput.focus();
        emailInput.select();
      });
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

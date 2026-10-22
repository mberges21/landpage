// Merch shop: renders products from assets/data/merch.json (synced from Printful by
// scripts/sync_printful.py), keeps a small order list, and fills the order-request form.
// Payment is manual for now: the request reaches Marcelo, who replies with a PayPal link.
(async function () {
  const es = document.documentElement.lang === 'es';
  const T = es ? {
    size: 'Talla', qty: 'Cantidad', add: 'Añadir al pedido', added: 'Añadido ✓', remove: 'Quitar',
    empty: 'Tu pedido está vacío — elige una prenda arriba.', total: 'Subtotal',
    needItem: 'Añade al menos una prenda a tu pedido antes de enviarlo.', from: 'desde',
    shipping: 'El envío se confirma junto con tu enlace de pago.', loading: 'Cargando productos…',
    error: 'No se pudieron cargar los productos. Escríbeme a marcelo@marcelo-berges.com.',
  } : {
    size: 'Size', qty: 'Quantity', add: 'Add to order', added: 'Added ✓', remove: 'Remove',
    empty: 'Your order is empty — pick a piece above.', total: 'Subtotal',
    needItem: 'Add at least one item to your order before sending it.', from: 'from',
    shipping: 'Shipping is confirmed together with your payment link.', loading: 'Loading products…',
    error: "Products couldn't load. Write to me at marcelo@marcelo-berges.com.",
  };
  const esc = s => String(s ?? '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  const money = (n, cur = 'EUR') => new Intl.NumberFormat(es ? 'es-ES' : 'en-IE', { style: 'currency', currency: cur }).format(n);

  const grid = document.getElementById('merchGrid');
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const orderField = document.getElementById('orderSummary');
  const totalField = document.getElementById('orderTotal');
  const form = document.getElementById('contactForm');
  if (!grid) return;

  // order list survives a page reload (but not a new browser session)
  let cart = [];
  try { cart = JSON.parse(sessionStorage.getItem('mb-cart') || '[]'); } catch (e) { cart = []; }
  const save = () => { try { sessionStorage.setItem('mb-cart', JSON.stringify(cart)); } catch (e) {} };

  let data, extra = {};
  try {
    const base = new URL('../data/', document.currentScript?.src || location.origin + '/assets/js/');
    const [r1, r2] = await Promise.all([fetch(new URL('merch.json', base), { cache: 'no-cache' }),
                                         fetch(new URL('merch-extra.json', base), { cache: 'no-cache' })]);
    data = await r1.json();
    if (r2.ok) extra = await r2.json();
  } catch (e) {
    grid.innerHTML = `<p class="merch-msg">${T.error}</p>`;
    return;
  }

  grid.innerHTML = data.products.map(p => {
    const x = (extra[p.key] || {})[es ? 'es' : 'en'] || {};
    const prices = p.variants.map(v => v.price);
    const min = Math.min(...prices), cur = p.variants[0]?.currency || 'EUR';
    const priceLabel = prices.every(v => v === min) ? money(min, cur) : `${T.from} ${money(min, cur)}`;
    const imgs = p.images.map((im, i) =>
      `<button type="button" class="thumb${i ? '' : ' on'}" data-src="${esc(im.src)}" aria-label="${esc(p.name)} ${i + 1}"><img src="${esc(im.src)}" alt="" loading="lazy"></button>`).join('');
    const sizes = p.variants.map((v, i) =>
      `<button type="button" class="size${i ? '' : ' on'}" data-variant="${v.id}">${esc(v.size)}</button>`).join('');
    return `
      <article class="merch-card reveal on" data-key="${esc(p.key)}">
        <div class="merch-gallery">
          <div class="merch-main"><img src="${esc(p.images[0]?.src)}" alt="${esc(p.name)} — ${esc(x.type || '')}"></div>
          ${p.images.length > 1 ? `<div class="merch-thumbs">${imgs}</div>` : ''}
        </div>
        <div class="merch-info">
          <span class="eyebrow">${esc(x.type || '')}</span>
          <h3>${esc(p.name)}</h3>
          <div class="merch-price" data-price>${priceLabel}</div>
          ${x.desc ? `<p class="merch-desc">${esc(x.desc)}</p>` : ''}
          ${x.details ? `<ul class="merch-details">${x.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
          <div class="merch-label">${T.size}</div>
          <div class="merch-sizes">${sizes}</div>
          <div class="merch-buy">
            <label class="merch-qty">${T.qty}<input type="number" min="1" max="10" value="1"></label>
            <button type="button" class="btn btn-primary merch-add">${T.add}</button>
          </div>
        </div>
      </article>`;
  }).join('');

  // gallery thumbnails, size choice, add to order
  grid.querySelectorAll('.merch-card').forEach(card => {
    const p = data.products.find(pr => pr.key === card.dataset.key);
    const main = card.querySelector('.merch-main img');
    const priceEl = card.querySelector('[data-price]');
    card.querySelectorAll('.thumb').forEach(t => t.addEventListener('click', () => {
      card.querySelectorAll('.thumb').forEach(o => o.classList.toggle('on', o === t));
      main.src = t.dataset.src;
    }));
    card.querySelectorAll('.size').forEach(b => b.addEventListener('click', () => {
      card.querySelectorAll('.size').forEach(o => o.classList.toggle('on', o === b));
      const v = p.variants.find(v => String(v.id) === b.dataset.variant);
      priceEl.textContent = money(v.price, v.currency);
    }));
    const addBtn = card.querySelector('.merch-add');
    addBtn.addEventListener('click', () => {
      const vid = card.querySelector('.size.on')?.dataset.variant;
      const v = p.variants.find(v => String(v.id) === vid);
      const qty = Math.max(1, Math.min(10, parseInt(card.querySelector('.merch-qty input').value, 10) || 1));
      const line = cart.find(l => l.variant === v.id);
      if (line) line.qty = Math.min(10, line.qty + qty);
      else cart.push({ variant: v.id, product: p.name, size: v.size, colour: v.colour, price: v.price, currency: v.currency, qty });
      save(); renderCart();
      addBtn.textContent = T.added;
      setTimeout(() => (addBtn.textContent = T.add), 1600);
    });
  });

  function renderCart() {
    if (!cartList) return;
    if (!cart.length) {
      cartList.innerHTML = `<p class="cart-empty">${T.empty}</p>`;
    } else {
      cartList.innerHTML = cart.map((l, i) => `
        <div class="cart-line">
          <div><b>${esc(l.product)}</b><span>${esc([l.colour, l.size].filter(Boolean).join(' · '))} × ${l.qty}</span></div>
          <div class="cart-right"><span>${money(l.price * l.qty, l.currency)}</span>
            <button type="button" data-i="${i}" class="cart-remove" aria-label="${T.remove}">×</button></div>
        </div>`).join('');
      cartList.querySelectorAll('.cart-remove').forEach(b => b.addEventListener('click', () => {
        cart.splice(+b.dataset.i, 1); save(); renderCart();
      }));
    }
    const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const cur = cart[0]?.currency || 'EUR';
    if (cartTotal) cartTotal.textContent = money(total, cur);
    if (orderField) orderField.value = cart.map(l =>
      `${l.qty} × ${l.product} — ${[l.colour, l.size].filter(Boolean).join(' / ')} — ${money(l.price * l.qty, l.currency)} (Printful variant ${l.variant})`).join('\n');
    if (totalField) totalField.value = cart.length ? `${money(total, cur)} + shipping` : '';
  }
  renderCart();

  // don't send an empty order; once sent, forget the saved copy (but keep it on the page so
  // "Wrong email? Fix it" can resend the same order)
  document.addEventListener('submit', e => {
    if (e.target !== form || cart.length) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const st = document.getElementById('formStatus');
    if (st) { st.textContent = T.needItem; st.classList.add('error'); }
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }, true);
  if (form) new MutationObserver(() => {
    if (form.classList.contains('sent')) { try { sessionStorage.removeItem('mb-cart'); } catch (e) {} }
  }).observe(form, { attributes: true, attributeFilter: ['class'] });
})();

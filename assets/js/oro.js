// "Oro en la sombra": a mark lives almost invisible in the dark;
// a slow lamp reveals part of it, light walks its real contour, rare sparks, incense smoke.
// Used for the hero (Tolima pendant, The Met 1979.206.497, public domain) and for his own logo symbol watermarks.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gold = [242, 182, 94], pale = [255, 230, 180], ember = [224, 122, 60];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  function oro(cv, o) {
    const x = cv.getContext('2d'), img = new Image(), k = o.k;   // k: per-use intensity
    const mass = document.createElement('canvas'), lamp = document.createElement('canvas'), veil = document.createElement('canvas'), rim = document.createElement('canvas');
    let W, H, d, box, iw, ih, piece, edges = [], hash = new Map(), sc = 1, vis = [], walkers = [], sparks = [], wisps = [], stepT = 0, on = false, last = 0;
    function trace() {
      iw = img.naturalWidth; ih = img.naturalHeight; const st = iw < 400 ? 1 : 2;
      const c = document.createElement('canvas'); c.width = iw; c.height = ih; const cc = c.getContext('2d'); cc.drawImage(img, 0, 0);
      const px = cc.getImageData(0, 0, iw, ih), p = px.data, A = new Float32Array(iw * ih);
      for (let i = 0, j = 0; i < p.length; i += 4, j++) {
        const r = p[i], g = p[i + 1], b = p[i + 2], lum = (r * .3 + g * .59 + b * .11) / 255;
        const a = o.light ? (p[i + 3] / 255) * Math.min(1, lum * 1.6) : Math.max(0, Math.min(1, (r - b - 30) / 70)), kk = o.light ? 1 : .45 + .8 * lum;
        A[j] = a; p[i] = Math.min(255, gold[0] * kk); p[i + 1] = Math.min(255, gold[1] * kk); p[i + 2] = Math.min(255, gold[2] * kk); p[i + 3] = a * 255;
      }
      cc.putImageData(px, 0, 0); piece = c;
      const at = (u, v) => (u < 0 || v < 0 || u >= iw || v >= ih) ? 0 : A[v * iw + u];
      for (let v = 1; v < ih - 1; v += st) for (let u = 1; u < iw - 1; u += st) {
        if (at(u, v) < .5 || (at(u - st, v) >= .5 && at(u + st, v) >= .5 && at(u, v - st) >= .5 && at(u, v + st) >= .5)) continue;
        const id = edges.length; edges.push([u, v]); const key = (u >> 2) + ',' + (v >> 2);
        if (!hash.has(key)) hash.set(key, []); hash.get(key).push(id);
      }
    }
    function near(id) { const [ex, ey] = edges[id], out = [];
      for (let gx = (ex >> 2) - 1; gx <= (ex >> 2) + 1; gx++) for (let gy = (ey >> 2) - 1; gy <= (ey >> 2) + 1; gy++) { const c = hash.get(gx + ',' + gy); if (!c) continue;
        for (const q of c) { if (q === id) continue; const dx = edges[q][0] - ex, dy = edges[q][1] - ey; if (dx * dx + dy * dy <= 9) out.push(q); } }
      return out; }
    const toX = v => box[0] + v * sc, toY = v => box[1] + v * sc;
    function size() {
      d = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
      cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
      for (const c of [mass, lamp, veil, rim]) { c.width = W * d; c.height = H * d; }
      box = o.place(W, H, iw, ih); sc = box[3] / ih;
      // it dissolves into the night: strong at its heart, gone at its edges
      const m = mass.getContext('2d'); m.setTransform(d, 0, 0, d, 0, 0); m.clearRect(0, 0, W, H);
      m.filter = `blur(${o.blur}px)`; m.drawImage(piece, ...box); m.filter = 'none';
      const cx = box[0] + box[2] * .5, cy = box[1] + box[3] * .5, fg = m.createRadialGradient(cx, cy, 0, cx, cy, Math.max(box[2], box[3]) * .55);
      fg.addColorStop(0, 'rgba(0,0,0,1)'); fg.addColorStop(.4, 'rgba(0,0,0,.55)'); fg.addColorStop(1, 'rgba(0,0,0,0)');
      m.globalCompositeOperation = 'destination-in'; m.fillStyle = fg; m.fillRect(0, 0, W, H); m.globalCompositeOperation = 'source-over';
      const r = rim.getContext('2d'); r.setTransform(d, 0, 0, d, 0, 0); r.clearRect(0, 0, W, H); r.fillStyle = rgba(pale, .9);
      edges.forEach(e => r.fillRect(toX(e[0]) - .5, toY(e[1]) - .5, 1.1, 1.1));
      r.globalCompositeOperation = 'destination-in'; r.fillStyle = fg; r.fillRect(0, 0, W, H); r.globalCompositeOperation = 'source-over';
      vis = edges.map((e, i) => i).filter(i => { const X = toX(edges[i][0]), Y = toY(edges[i][1]); return X > 6 && X < W - 6 && Y > 6 && Y < H - 6; });
    }
    function spawnWalker() { if (!vis.length) return; const id = vis[Math.random() * vis.length | 0]; walkers.push({ id, dir: [0, 0], trail: [], seen: new Set([id]), life: 5000 + Math.random() * 5000, age: 0 }); }
    function step(w) {
      const cands = near(w.id).filter(q => !w.seen.has(q)); if (!cands.length) return false;
      const [ex, ey] = edges[w.id]; let best = cands[0], bs = -9;
      for (const q of cands) { const dx = edges[q][0] - ex, dy = edges[q][1] - ey, n = Math.hypot(dx, dy) || 1, s = (dx * w.dir[0] + dy * w.dir[1]) / n + Math.random() * .15; if (s > bs) { bs = s; best = q; } }
      const dx = edges[best][0] - ex, dy = edges[best][1] - ey, n = Math.hypot(dx, dy) || 1; w.dir = [dx / n, dy / n];
      w.trail.push(w.id); if (w.trail.length > 18) w.trail.shift(); w.id = best; w.seen.add(best); if (w.seen.size > 60) w.seen.delete(w.seen.values().next().value);
      return true;
    }
    function frame(t, dt) {
      x.clearRect(0, 0, W, H);
      // incense
      x.globalCompositeOperation = 'lighter';
      if (o.smoke && !reduce && Math.random() < dt / o.smoke.every && wisps.length < o.smoke.max) {
        const a = Math.random() < o.smoke.fromPiece ? [box[0] + box[2] * (.3 + .4 * Math.random()), box[1] + box[3] * (.6 + .4 * Math.random())] : [W * (.05 + .9 * Math.random()), H * (.9 + .1 * Math.random())];
        wisps.push({ x: a[0], y: a[1], age: 0, life: 11000 + Math.random() * 6000, ph: Math.random() * 6.28, c: Math.random() < .6 ? gold : ember }); }
      wisps = wisps.filter(w => { if (!reduce) w.age += dt; const u = w.age / w.life; if (u >= 1) return false;
        const y = w.y - w.age * .028, xx = w.x + Math.sin(w.ph + w.age * .0004) * 26 * u, r = o.smoke.r0 + u * o.smoke.r1, a = o.smoke.a * Math.sin(Math.PI * u);
        const g = x.createRadialGradient(xx, y, 0, xx, y, r); g.addColorStop(0, rgba(w.c, a)); g.addColorStop(1, rgba(w.c, 0)); x.fillStyle = g; x.beginPath(); x.arc(xx, y, r, 0, 6.28); x.fill(); return true; });
      x.globalCompositeOperation = 'source-over';
      // the mark in the shadow, barely there
      x.globalAlpha = .02 * k; x.drawImage(mass, 0, 0, W, H); x.globalAlpha = 1;
      // a slow lamp wanders over it and reveals only a part
      const lx = box[0] + box[2] * (.5 + .36 * Math.sin(t * .000071 + o.ph) * Math.cos(t * .000023)), ly = box[1] + box[3] * (.5 + .35 * Math.sin(t * .000047 + 1.3 + o.ph)), R = Math.max(box[2], box[3]) * (.2 + .05 * Math.sin(t * .00011));
      const vl = veil.getContext('2d'); vl.setTransform(d, 0, 0, d, 0, 0); vl.clearRect(0, 0, W, H); vl.globalCompositeOperation = 'lighter';
      const lg = vl.createRadialGradient(lx, ly, 0, lx, ly, R); lg.addColorStop(0, 'rgba(255,255,255,1)'); lg.addColorStop(.45, 'rgba(255,255,255,.5)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
      vl.fillStyle = lg; vl.fillRect(0, 0, W, H);
      walkers.forEach(w => { const hx = toX(edges[w.id][0]), hy = toY(edges[w.id][1]), wg = vl.createRadialGradient(hx, hy, 0, hx, hy, 36);
        wg.addColorStop(0, 'rgba(255,255,255,.5)'); wg.addColorStop(1, 'rgba(255,255,255,0)'); vl.fillStyle = wg; vl.fillRect(hx - 36, hy - 36, 72, 72); });
      vl.globalCompositeOperation = 'source-over';
      const lp = lamp.getContext('2d'); lp.setTransform(1, 0, 0, 1, 0, 0); lp.clearRect(0, 0, lamp.width, lamp.height); lp.drawImage(mass, 0, 0);
      lp.globalCompositeOperation = 'destination-in'; lp.drawImage(veil, 0, 0); lp.globalCompositeOperation = 'source-over';
      x.save(); x.shadowColor = rgba(gold, .4); x.shadowBlur = 22; x.globalAlpha = .28 * k; x.drawImage(lamp, 0, 0, W, H); x.restore();
      x.globalCompositeOperation = 'lighter';
      x.globalAlpha = (.012 + .009 * Math.sin(t * .0005)) * k; x.drawImage(rim, 0, 0, W, H); x.globalAlpha = 1;
      // light walking along the real contour
      if (!reduce && Math.random() < dt / 2200 && walkers.length < o.walkers) spawnWalker();
      stepT += dt; while (stepT > 55) { stepT -= 55; walkers = walkers.filter(w => step(w)); }
      walkers = walkers.filter(w => { w.age += dt; const f = Math.min(1, w.age / 900, (w.life - w.age) / 900); if (f <= 0) return false;
        w.trail.forEach((id, i) => { const q = (i + 1) / w.trail.length; x.fillStyle = rgba(pale, .16 * q * f * k); x.beginPath(); x.arc(toX(edges[id][0]), toY(edges[id][1]), .9 + q * .6, 0, 6.28); x.fill(); });
        const hx = toX(edges[w.id][0]), hy = toY(edges[w.id][1]), gg = x.createRadialGradient(hx, hy, 0, hx, hy, 9);
        gg.addColorStop(0, rgba(pale, .4 * f * k)); gg.addColorStop(1, rgba(gold, 0)); x.fillStyle = gg; x.beginPath(); x.arc(hx, hy, 9, 0, 6.28); x.fill(); return true; });
      // rare sparks on the mark, and embers drifting up through the whole space
      if (!reduce && vis.length && Math.random() < dt / 6000) { const e = edges[vis[Math.random() * vis.length | 0]]; sparks.push({ x: toX(e[0]), y: toY(e[1]), a: 1, v: 0 }); }
      if (!reduce && o.embers && Math.random() < dt / o.embers) sparks.push({ x: W * Math.random(), y: H * (.35 + .6 * Math.random()), a: 1, v: .012 + Math.random() * .015 });
      sparks = sparks.filter(sp => { sp.a -= dt * (sp.v ? .0004 : .0008); sp.y -= sp.v * dt; if (sp.a <= 0) return false; const r = 6 * sp.a + 2;
        x.strokeStyle = rgba(pale, .45 * sp.a); x.lineWidth = .8; x.beginPath(); x.moveTo(sp.x - r, sp.y); x.lineTo(sp.x + r, sp.y); x.moveTo(sp.x, sp.y - r); x.lineTo(sp.x, sp.y + r); x.stroke(); return true; });
      x.globalCompositeOperation = 'source-over';
    }
    function loop(t) { if (!on) { last = 0; return; } const dt = last ? Math.min(50, t - last) : 16; last = t; frame(t, dt); if (!reduce) requestAnimationFrame(loop); }
    img.onload = () => { trace(); size(); addEventListener('resize', size); spawnWalker();
      // only animate while it is on screen
      new IntersectionObserver(es => es.forEach(e => { const was = on; on = e.isIntersecting; if (on && !was) requestAnimationFrame(loop); })).observe(cv); };
    img.src = o.src;
  }

  // the hero: half of the Tolima pendant lives outside the photo, cut by its left edge
  const heroEl = document.querySelector('header.hero, header.page-hero');
  let hero = null;
  if (heroEl) { hero = document.createElement('canvas'); hero.setAttribute('aria-hidden', 'true');
    hero.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen';
    const bg = heroEl.querySelector('.hero-bg'); bg ? bg.after(hero) : heroEl.prepend(hero); }
  if (hero) oro(hero, { src: '/assets/img/oro/tolima.png', k: .8, blur: 1.6, ph: 0, walkers: 3, embers: 1600,
    smoke: { every: 1100, max: 8, fromPiece: .35, a: .085, r0: 50, r1: 200 },
    place: (W, H, iw, ih) => { const bh = H * (W > 760 ? .92 : .62), bw = iw * bh / ih; return [-bw * .5, (H - bh) * .42, bw, bh]; } });

  // only incense and embers, no mark: a breath between the sections that carry his symbol
  function air(cv, o) {
    const x = cv.getContext('2d'); let W, H, d, wisps = [], sparks = [], on = false, last = 0;
    function size() { d = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0); }
    function frame(dt) {
      x.clearRect(0, 0, W, H); x.globalCompositeOperation = 'lighter';
      if (Math.random() < dt / o.every && wisps.length < o.max) wisps.push({ x: W * (.05 + .9 * Math.random()), y: H * (.85 + .15 * Math.random()), age: 0, life: 12000 + Math.random() * 6000, ph: Math.random() * 6.28, c: Math.random() < .6 ? gold : ember });
      wisps = wisps.filter(w => { w.age += dt; const u = w.age / w.life; if (u >= 1) return false;
        const y = w.y - w.age * .03, xx = w.x + Math.sin(w.ph + w.age * .0004) * 30 * u, r = 50 + u * 190, a = o.a * Math.sin(Math.PI * u);
        const g = x.createRadialGradient(xx, y, 0, xx, y, r); g.addColorStop(0, rgba(w.c, a)); g.addColorStop(1, rgba(w.c, 0)); x.fillStyle = g; x.beginPath(); x.arc(xx, y, r, 0, 6.28); x.fill(); return true; });
      if (Math.random() < dt / o.embers) sparks.push({ x: W * Math.random(), y: H * (.4 + .6 * Math.random()), a: 1, v: .012 + Math.random() * .015 });
      sparks = sparks.filter(sp => { sp.a -= dt * .0004; sp.y -= sp.v * dt; if (sp.a <= 0) return false; const r = 6 * sp.a + 2;
        x.strokeStyle = rgba(pale, .45 * sp.a); x.lineWidth = .8; x.beginPath(); x.moveTo(sp.x - r, sp.y); x.lineTo(sp.x + r, sp.y); x.moveTo(sp.x, sp.y - r); x.lineTo(sp.x, sp.y + r); x.stroke(); return true; });
      x.globalCompositeOperation = 'source-over';
    }
    function loop(t) { if (!on) { last = 0; return; } const dt = last ? Math.min(50, t - last) : 16; last = t; frame(dt); requestAnimationFrame(loop); }
    size(); addEventListener('resize', size);
    if (!reduce) new IntersectionObserver(es => es.forEach(e => { const was = on; on = e.isIntersecting; if (on && !was) requestAnimationFrame(loop); })).observe(cv);
  }
  function layer(sec) {
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    const c = document.createElement('canvas'); c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;mix-blend-mode:screen';
    sec.prepend(c); return c;
  }
  const sym = (ph, place) => ({ src: '/assets/img/symbol-light.png', light: true, k: 1, blur: 1.2, ph, walkers: 2, embers: 4000,
    smoke: { every: 2400, max: 4, fromPiece: .5, a: .05, r0: 44, r1: 160 }, place });
  // his symbol stays exactly where the CSS already puts it (::after watermark), on whatever page it lives
  ['work', 'about', 'products'].forEach((id, i) => {
    const sec = document.getElementById(id); if (!sec) return;
    const st = getComputedStyle(sec, '::after'); if (!st.content || st.content === 'none') return;
    // snapshot the watermark's place before hiding it (the style object is live)
    const n = v => parseFloat(v) || 0, sz = n(st.width) || 620, w0 = sec.clientWidth, h0 = sec.clientHeight;
    const L0 = n(st.left), R0 = n(st.right), T0 = n(st.top), B0 = n(st.bottom), rightSide = L0 + sz / 2 > w0 / 2, low = T0 + sz / 2 > h0 / 2;
    sec.classList.add('oro-on');   // hides the static watermark: the living one replaces it
    oro(layer(sec), sym(i + 1, (W, H) => {
      const X = rightSide ? W - sz - R0 : L0, Y = low ? H - sz - B0 : T0;
      return [X, Y, sz, sz]; }));
  });
  // pages without his watermark (Perform, Studio, Academy, Dance…): the living symbol in every other section,
  // alternating sides like on the home page (right/top, then left/bottom)
  if (!document.querySelector('.oro-on')) {
    [...document.querySelectorAll('section.section')].filter((s, i) => i % 2 === 0).slice(0, 3).forEach((sec, j) => {
      const right = j % 2 === 0;
      oro(layer(sec), sym(j + 4, (W, H) => right ? [W - 620 + 160, 40, 620, 620] : [-180, H - 620 + 120, 620, 620]));
    });
  }
  // one continuous night over the whole page: incense and embers drift across everything as you scroll,
  // so no section is left outside (lightly, it sits above the content but never takes the clicks)
  const veilAll = document.createElement('canvas'); veilAll.setAttribute('aria-hidden', 'true');
  veilAll.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:5;mix-blend-mode:screen';
  document.body.appendChild(veilAll);
  air(veilAll, { every: 1700, max: 6, a: .045, embers: 1500 });
})();

// The "latest release" card is written into each page. This keeps it current:
// if assets/data/latest-release.json (refreshed daily from Deezer by
// .github/workflows/latest-release.yml) lists a newer release, the card is redrawn.
(async function () {
  const dataUrl = new URL('../data/latest-release.json', document.currentScript.src);
  const cards = document.querySelectorAll('[data-latest-release]');
  if (!cards.length) return;
  const es = document.documentElement.lang === 'es';
  const esc = s => String(s || '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  try {
    const res = await fetch(dataUrl, { cache: 'no-cache' });
    if (!res.ok) return;
    const r = await res.json();
    if (!r.deezer_id) return;
    const date = r.release_date
      ? new Date(r.release_date + 'T12:00:00').toLocaleDateString(es ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const kind = { single: 'Single', ep: 'EP', album: es ? 'Álbum' : 'Album' }[r.type] || '';
    const html = `
      <img src="${esc(r.cover)}" alt="${esc(r.name)} — cover" loading="lazy">
      <div class="release-info">
        <small>${[kind, date].filter(Boolean).map(esc).join(' · ')}</small>
        <b>${esc(r.name)}</b>
        <span>${esc(r.label)}</span>
        <div class="release-links">
          <a class="btn btn-primary" href="${esc(r.spotify_url)}" target="_blank" rel="noopener">${es ? 'Escuchar en Spotify' : 'Listen on Spotify'} ↗</a>
          <a class="text-link" href="${esc(r.deezer_url)}" target="_blank" rel="noopener">Deezer ↗</a>
        </div>
      </div>`;
    cards.forEach(el => {
      if (el.dataset.id === String(r.deezer_id)) return; // already showing it
      if (el.tagName === 'IFRAME') {                      // page from an older version
        const card = document.createElement('div');
        card.className = 'release-card';
        el.replaceWith(card);
        el = card;
      }
      el.dataset.id = r.deezer_id;
      el.innerHTML = html;
    });
  } catch (e) { /* keep the card already in the page */ }
})();

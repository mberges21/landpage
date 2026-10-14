// Replace the fallback "latest release" player with a release card built from
// assets/data/latest-release.json, which is refreshed daily from Deezer by
// .github/workflows/latest-release.yml.
(async function () {
  const dataUrl = new URL('../data/latest-release.json', document.currentScript.src);
  const frames = document.querySelectorAll('[data-latest-release]');
  if (!frames.length) return;
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
    const kind = { single: 'Single', ep: 'EP', album: 'Album' }[r.type] || '';
    frames.forEach(f => {
      const card = document.createElement('div');
      card.className = 'release-card';
      card.innerHTML = `
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
      f.replaceWith(card);
    });
    document.querySelectorAll('[data-latest-label]').forEach(el => el.textContent = es ? 'Último lanzamiento' : 'Latest release');
  } catch (e) { /* keep the fallback player already in the HTML */ }
})();

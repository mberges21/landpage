// Swap the "latest release" Spotify player to whatever assets/data/latest-release.json says.
// That file is refreshed daily by .github/workflows/latest-release.yml.
(async function () {
  const frames = document.querySelectorAll('[data-latest-release]');
  if (!frames.length) return;
  try {
    const res = await fetch('assets/data/latest-release.json', { cache: 'no-cache' });
    if (!res.ok) return;
    const r = await res.json();
    if (!r.id) return;
    const src = `https://open.spotify.com/embed/${r.type || 'album'}/${r.id}?utm_source=generator&theme=0`;
    const label = `Latest release — ${r.name}${r.label ? ' · ' + r.label : ''}`;
    frames.forEach(f => {
      if (!f.src.includes(r.id)) f.src = src;
      f.title = r.name;
    });
    document.querySelectorAll('[data-latest-label]').forEach(el => el.textContent = label);
  } catch (e) { /* keep the fallback player already in the HTML */ }
})();

// Bandcamp releases on the shop page, from assets/data/bandcamp.json (scripts/sync_bandcamp.py).
// "Listen" swaps in Bandcamp's own small player; buying happens on Bandcamp.
(async function () {
  const box = document.getElementById('bandcampGrid');
  if (!box) return;
  const es = document.documentElement.lang === 'es';
  const T = es
    ? { edit: 'Edit exclusivo', album: 'Álbum', single: 'Single', listen: '▶ Escuchar', buy: 'Comprar en Bandcamp ↗', all: 'Todo', edits: 'Edits y remixes', releases: 'Álbumes y singles' }
    : { edit: 'Exclusive edit', album: 'Album', single: 'Single', listen: '▶ Listen', buy: 'Buy on Bandcamp ↗', all: 'All', edits: 'Edits & remixes', releases: 'Albums & singles' };
  const esc = s => String(s ?? '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  // tidy titles like "Charanguito(Marcelo Berges Edit)" → "Charanguito" + note "Marcelo Berges Edit"
  const split = t => {
    const m = t.match(/^(.*?)\s*[(-]\s*\(?([^()]*(?:edit|remix)[^()]*)\)?\s*$/i);
    return m ? [m[1].replace(/[_\s-]+$/, ''), m[2].trim()] : [t, ''];
  };

  let releases;
  try {
    const url = new URL('../data/bandcamp.json', document.currentScript?.src || location.origin + '/assets/js/');
    releases = (await (await fetch(url, { cache: 'no-cache' })).json()).releases;
  } catch (e) { box.closest('section')?.remove(); return; }

  const order = { edit: 0, single: 1, album: 2 };
  releases.sort((a, b) => order[a.category] - order[b.category]);

  box.innerHTML = releases.map(r => {
    const [title, note] = split(r.title);
    return `
      <article class="bc-card" data-cat="${r.category === 'edit' ? 'edit' : 'release'}">
        <div class="bc-art"><img src="${esc(r.art)}" alt="${esc(r.title)}" loading="lazy">
          ${r.category === 'edit' ? `<span class="bc-badge">${T.edit}</span>` : ''}</div>
        <div class="bc-body">
          <span class="bc-kind">${r.category === 'edit' ? T.edit : T[r.category]}</span>
          <h3>${esc(title)}</h3>
          ${note ? `<p class="bc-note">${esc(note)}</p>` : ''}
          <div class="bc-player" hidden></div>
          <div class="bc-actions">
            <button type="button" class="bc-listen" data-kind="${esc(r.kind)}" data-id="${Number(r.id)}">${T.listen}</button>
            <a class="text-link" href="${esc(r.url)}" target="_blank" rel="noopener">${T.buy}</a>
          </div>
        </div>
      </article>`;
  }).join('');

  box.querySelectorAll('.bc-listen').forEach(b => b.addEventListener('click', () => {
    const player = b.closest('.bc-body').querySelector('.bc-player');
    if (!player.hidden) return;
    player.innerHTML = `<iframe title="Bandcamp player" loading="lazy"
      src="https://bandcamp.com/EmbeddedPlayer/${b.dataset.kind}=${b.dataset.id}/size=small/bgcol=ffffff/linkcol=c45a20/transparent=true/"></iframe>`;
    player.hidden = false;
    b.remove();
  }));

  // filter chips
  const chips = document.getElementById('bandcampFilter');
  if (chips) {
    chips.innerHTML = [['all', T.all], ['edit', T.edits], ['release', T.releases]]
      .map(([k, l], i) => `<button type="button" data-f="${k}" class="${i ? '' : 'on'}">${l}</button>`).join('');
    chips.querySelectorAll('button').forEach(c => c.addEventListener('click', () => {
      chips.querySelectorAll('button').forEach(o => o.classList.toggle('on', o === c));
      box.querySelectorAll('.bc-card').forEach(card => {
        card.hidden = c.dataset.f !== 'all' && card.dataset.cat !== c.dataset.f;
      });
    }));
  }
})();

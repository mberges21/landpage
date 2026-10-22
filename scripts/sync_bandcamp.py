"""Read the releases on marceloberges.bandcamp.com/music and write assets/data/bandcamp.json.

No account or key needed — it reads the public page. Runs daily with the latest-release
workflow, so new Bandcamp releases appear in the shop by themselves.
"""
import html
import json
import os
import re
import sys
import urllib.request

BASE = 'https://marceloberges.bandcamp.com'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'data', 'bandcamp.json')


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (marcelo-berges.com sync)'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', 'replace')


def clean(text):
    return html.unescape(re.sub(r'<[^>]+>', ' ', text)).replace('\xa0', ' ').strip()


def main():
    page = get(BASE + '/music')
    items = []
    for kind, item_id, inner in re.findall(r'<li[^>]*data-item-id="(album|track)-(\d+)"[^>]*>(.*?)</li>', page, re.S):
        href = re.search(r'href="([^"]+)"', inner)
        title = re.search(r'<p class="title">(.*?)</p>', inner, re.S)
        art = re.search(r'(?:data-original|src)="(https://f4\.bcbits\.com/img/a(\d+)_\d+\.jpg)"', inner)
        if not (href and title):
            continue
        # drop Bandcamp's "artist-override" credit line that follows some titles
        raw = re.sub(r'<span class="artist-override">.*?</span>', '', title.group(1), flags=re.S)
        name = re.sub(r'\s+', ' ', clean(raw)).replace('_', ' — ')
        url = href.group(1)
        url = url if url.startswith('http') else BASE + url
        lower = name.lower()
        is_edit = any(w in lower for w in ('edit', 'remix', 'rework', 'bootleg'))
        items.append({
            'id': int(item_id),
            'kind': kind,
            'title': name,
            'category': 'edit' if is_edit else ('album' if kind == 'album' else 'single'),
            'url': url,
            # _10 = 1200 px artwork, _16 = 700 px (lighter for cards)
            'art': f'https://f4.bcbits.com/img/a{art.group(2)}_16.jpg' if art else '',
        })
    if not items:
        sys.exit('No releases found on Bandcamp — page layout may have changed')

    current = []
    if os.path.exists(OUT):
        current = json.load(open(OUT)).get('releases', [])
    if current == items:
        print('Bandcamp: no changes')
        return
    with open(OUT, 'w') as f:
        json.dump({'releases': items}, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f'Bandcamp: wrote {len(items)} releases')


if __name__ == '__main__':
    main()

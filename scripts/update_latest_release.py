"""Find Marcelo Bergés' newest release and write it to assets/data/latest-release.json.

Uses Deezer's public catalogue API (no key or subscription needed). Runs daily from
.github/workflows/latest-release.yml.

To feature a specific release instead of the newest one, set "pinned": true in the JSON file.
"""
import json
import os
import sys
import urllib.parse
import urllib.request

DEEZER_ARTIST_ID = os.environ.get('DEEZER_ARTIST_ID', '13985481')
ARTIST_NAME = 'Marcelo Berges'
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'data', 'latest-release.json')


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'marcelo-berges.com release check'})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    if 'error' in data:
        sys.exit(f'Deezer error: {data["error"]}')
    return data


def main():
    current = {}
    if os.path.exists(OUT):
        with open(OUT) as f:
            current = json.load(f)
    if current.get('pinned'):
        print('Pinned release, not updating:', current.get('name'))
        return

    albums, url = [], f'https://api.deezer.com/artist/{DEEZER_ARTIST_ID}/albums?limit=100'
    while url:
        page = get(url)
        albums += page.get('data', [])
        url = page.get('next')

    # skip various-artists compilations, they're not really "a new release"
    albums = [a for a in albums if a.get('record_type') != 'compile' and a.get('release_date')]
    if not albums:
        sys.exit('No releases found on Deezer')

    newest = max(albums, key=lambda a: a['release_date'])
    details = get(f'https://api.deezer.com/album/{newest["id"]}')
    query = urllib.parse.quote(f'{newest["title"]} {ARTIST_NAME}')

    release = {
        'deezer_id': newest['id'],
        'name': newest['title'],
        'type': newest.get('record_type', ''),
        'label': details.get('label', ''),
        'release_date': newest['release_date'],
        'cover': details.get('cover_xl') or newest.get('cover_xl', ''),
        'deezer_url': details.get('link', f'https://www.deezer.com/album/{newest["id"]}'),
        'spotify_url': f'https://open.spotify.com/search/{query}',
    }
    if release['deezer_id'] == current.get('deezer_id'):
        print('Already up to date:', release['name'])
        return

    with open(OUT, 'w') as f:
        json.dump(release, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f"New latest release: {release['name']} ({release['release_date']})")


if __name__ == '__main__':
    main()

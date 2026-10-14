"""Find Marcelo Bergés' newest release on Spotify and write it to assets/data/latest-release.json.

Runs daily from .github/workflows/latest-release.yml. Needs SPOTIFY_CLIENT_ID and
SPOTIFY_CLIENT_SECRET (a free app from https://developer.spotify.com/dashboard).

To feature a specific release instead of the newest one, set "pinned": true in the JSON file.
"""
import base64
import json
import os
import sys
import urllib.parse
import urllib.request

ARTIST_ID = os.environ.get('SPOTIFY_ARTIST_ID', '7DDff2V6L8Gj20uCcQkhZc')
MARKET = os.environ.get('SPOTIFY_MARKET', 'ES')
# album/single = own releases; appears_on = remixes and features on other artists' releases
GROUPS = os.environ.get('SPOTIFY_GROUPS', 'album,single,appears_on')
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'data', 'latest-release.json')


def request(url, data=None, headers=None):
    req = urllib.request.Request(url, data=data, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def token():
    cid, secret = os.environ['SPOTIFY_CLIENT_ID'], os.environ['SPOTIFY_CLIENT_SECRET']
    auth = base64.b64encode(f'{cid}:{secret}'.encode()).decode()
    return request('https://accounts.spotify.com/api/token',
                   data=b'grant_type=client_credentials',
                   headers={'Authorization': f'Basic {auth}',
                            'Content-Type': 'application/x-www-form-urlencoded'})['access_token']


def sort_key(album):
    # release_date precision can be year, month or day — pad so they compare correctly
    d = album['release_date']
    return d + {'year': '-01-01', 'month': '-01'}.get(album.get('release_date_precision'), '')


def main():
    current = {}
    if os.path.exists(OUT):
        with open(OUT) as f:
            current = json.load(f)
    if current.get('pinned'):
        print('Pinned release, not updating:', current.get('name'))
        return

    headers = {'Authorization': f'Bearer {token()}'}
    query = urllib.parse.urlencode({'include_groups': GROUPS, 'market': MARKET, 'limit': 50})
    url = f'https://api.spotify.com/v1/artists/{ARTIST_ID}/albums?{query}'
    albums = []
    while url:
        page = request(url, headers=headers)
        albums += page['items']
        url = page.get('next')

    # skip various-artists compilations, they're not really "a new release"
    albums = [a for a in albums if a.get('album_type') != 'compilation']
    if not albums:
        sys.exit('No releases found on Spotify')

    newest = max(albums, key=sort_key)
    details = request(f'https://api.spotify.com/v1/albums/{newest["id"]}?market={MARKET}', headers=headers)

    release = {
        'id': newest['id'],
        'type': 'album',
        'name': newest['name'],
        'label': details.get('label', ''),
        'release_date': newest['release_date'],
        'url': newest['external_urls']['spotify'],
    }
    if release['id'] == current.get('id'):
        print('Already up to date:', release['name'])
        return

    with open(OUT, 'w') as f:
        json.dump(release, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f"New latest release: {release['name']} ({release['release_date']})")


if __name__ == '__main__':
    main()

"""Pull the products of Marcelo's Printful store into the website.

Writes assets/data/merch.json and downloads product images to assets/img/merch/.
The API token is read from tools/printful-token.txt (git-ignored) or the PRINTFUL_TOKEN
environment variable — it is never written anywhere else.

Run from the project folder:
    SSL_CERT_FILE=/etc/ssl/cert.pem python3 scripts/sync_printful.py
"""
import json
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TOKEN_FILE = os.path.join(ROOT, 'tools', 'printful-token.txt')
OUT_JSON = os.path.join(ROOT, 'assets', 'data', 'merch.json')
IMG_DIR = os.path.join(ROOT, 'assets', 'img', 'merch')
API = 'https://api.printful.com'

# Sizes in wearing order, so S comes before XL whatever order Printful returns
SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']


def token():
    t = os.environ.get('PRINTFUL_TOKEN')
    if not t and os.path.exists(TOKEN_FILE):
        t = open(TOKEN_FILE).read().strip()
    if not t:
        sys.exit('No Printful token: put it in tools/printful-token.txt')
    return t


def get(path, tok):
    req = urllib.request.Request(API + path, headers={'Authorization': f'Bearer {tok}',
                                                       'User-Agent': 'marcelo-berges.com merch sync'})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    if data.get('code') != 200:
        sys.exit(f'Printful error on {path}: {data.get("error") or data.get("result")}')
    return data['result']


def slug(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def corner_is_transparent(path):
    """True if a PNG's top-left pixel is see-through (i.e. a real cut-out background).
    Printful marks most previews as 'has alpha' even when they're fully opaque."""
    import struct, zlib
    with open(path, 'rb') as f:
        data = f.read()
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        return False
    width, _h, depth, colour = struct.unpack('>IIBB', data[16:26])
    bpp = {6: 4, 4: 2}.get(colour)           # 6 = RGBA, 4 = grey + alpha (8-bit each)
    if not bpp or depth != 8:
        return False
    idat, i = b'', 8
    while i < len(data):
        n = struct.unpack('>I', data[i:i + 4])[0]
        if data[i + 4:i + 8] == b'IDAT':
            idat += data[i + 8:i + 8 + n]
            if len(idat) > 65536:
                break
        i += 12 + n
    first_row = zlib.decompressobj().decompress(idat, 1 + width * bpp)
    # first pixel of the first row is unaffected by PNG row filters, so its alpha byte is exact
    return len(first_row) > bpp and first_row[bpp] < 250


def download(url, name):
    os.makedirs(IMG_DIR, exist_ok=True)
    ext = os.path.splitext(url.split('?')[0])[1] or '.png'
    path = os.path.join(IMG_DIR, name + ext)
    req = urllib.request.Request(url, headers={'User-Agent': 'marcelo-berges.com merch sync'})
    with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f:
        f.write(r.read())
    # shrink with macOS's built-in sips (keeps pages fast). Images with a transparent
    # background stay PNG so they sit cleanly on the site's coloured background.
    dims = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path], capture_output=True, text=True).stdout
    longest = max([int(n) for n in re.findall(r'pixel(?:Width|Height): (\d+)', dims)] or [0])
    if corner_is_transparent(path):
        if longest > 900:                     # sips -Z would also enlarge small images, so only shrink
            subprocess.run(['sips', '-Z', '900', path], capture_output=True)
        return '/assets/img/merch/' + name + ext
    jpg = os.path.join(IMG_DIR, name + '.jpg')
    if subprocess.run(['sips', '-Z', str(min(1200, longest or 1200)), '-s', 'format', 'jpeg', '-s', 'formatOptions', '82',
                       path, '--out', jpg], capture_output=True).returncode == 0:
        if path != jpg:
            os.remove(path)
        return '/assets/img/merch/' + name + '.jpg'
    return '/assets/img/merch/' + name + ext


def size_of(variant_name):
    # "Kamatjui / M" or "Kamatjui / Black / M" → last part is usually the size;
    # one-size items (beanies, mugs…) have no "/" at all
    if '/' not in variant_name:
        return 'One size'
    return variant_name.split('/')[-1].strip()


def main():
    tok = token()
    products = []
    for item in get('/store/products?limit=100', tok):
        if item.get('is_ignored'):
            continue
        detail = get(f'/store/products/{item["id"]}', tok)
        sp, variants = detail['sync_product'], detail['sync_variants']
        key = slug(sp['name'])

        images = []
        if sp.get('thumbnail_url'):
            images.append({'src': download(sp['thumbnail_url'], f'{key}-mockup'), 'label': 'mockup'})
        # print-file previews (front artwork etc.) from the first variant
        for f in variants[0].get('files', []) if variants else []:
            if f.get('type') == 'default' and f.get('preview_url'):
                images.append({'src': download(f['preview_url'], f'{key}-front-print'), 'label': 'front'})

        vs = []
        for v in variants:
            if v.get('availability_status') in ('discontinued', 'out_of_stock'):
                continue
            catalog_name = v['product'].get('name', '')       # e.g. "Cotton Heritage M2480 (Team Red / M)"
            colour = ''
            m = re.search(r'\(([^/)]+?)\s*(?:/|\))', catalog_name)   # "(Black / M)" or "(Black)
            if m:
                colour = m.group(1).strip()
            vs.append({
                'id': v['id'],
                'size': size_of(v['name']),
                'colour': colour,
                'price': float(v['retail_price']),
                'currency': v.get('currency', 'EUR'),
            })
        vs.sort(key=lambda v: SIZE_ORDER.index(v['size']) if v['size'] in SIZE_ORDER else 99)
        base = re.sub(r'\s*\(.*\)$', '', variants[0]['product'].get('name', '')) if variants else ''
        products.append({'id': sp['id'], 'key': key, 'name': sp['name'], 'garment': base,
                         'images': images, 'variants': vs})
        print(f'  {sp["name"]}: {len(vs)} variants, {len(images)} images')

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, 'w') as f:
        json.dump({'products': products}, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f'Wrote {len(products)} product(s) to assets/data/merch.json')


if __name__ == '__main__':
    main()

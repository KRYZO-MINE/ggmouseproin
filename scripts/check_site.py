"""Check public pages, internal links, metadata, JSON-LD and sitemap coverage."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path=path; self.links=[]; self.ids=set(); self.h1=0
        self.canon=[]; self.descriptions=[]; self.titles=[]; self.title=False
        self.schema=False; self.buffer=''; self.schemas=[]
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True
        if tag=='link' and a.get('rel')=='canonical': self.canon.append(a['href'])
        if tag=='meta' and a.get('name')=='description': self.descriptions.append(a.get('content',''))
        if tag=='script' and a.get('type')=='application/ld+json': self.schema=True; self.buffer=''
    def handle_data(self, data):
        if self.title: self.titles.append(data)
        if self.schema: self.buffer+=data
    def handle_endtag(self, tag):
        if tag=='title': self.title=False
        if tag=='script' and self.schema:
            self.schemas.append(json.loads(self.buffer)); self.schema=False

paths=list(ROOT.glob('*.html'))+list((ROOT/'Free-Fire').glob('*.html'))
pages={p.resolve():Page(p) for p in paths if p.name!='template.html'}
errors=[];titles=set();canonicals=set()
for path,p in pages.items():
    label=path.relative_to(ROOT)
    if p.h1!=1: errors.append(f'{label}: expected one h1, got {p.h1}')
    if len(p.canon)!=1 or len(p.descriptions)!=1 or not p.descriptions[0]: errors.append(f'{label}: missing or duplicate SEO metadata')
    title=''.join(p.titles)
    if not title or title in titles: errors.append(f'{label}: missing/duplicate title')
    titles.add(title)
    if p.canon:
        expected='https://www.ggmousepro.in'+('/' if path.name=='index.html' else '/'+label.with_suffix('').as_posix())
        if p.canon[0]!=expected: errors.append(f'{label}: canonical mismatch')
        canonicals.add(p.canon[0])
    for href in p.links:
        u=urlsplit(href)
        if u.scheme or u.netloc: continue
        target=(ROOT/u.path.lstrip('/') if u.path.startswith('/') else path.parent/u.path) if u.path else path
        if u.path=='/': target=ROOT/'index.html'
        if not target.suffix: target=target.with_suffix('.html')
        target=target.resolve()
        if not target.exists(): errors.append(f'{label}: missing link {href}')
        elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids: errors.append(f'{label}: missing anchor {href}')
sitemap={node.text for node in ET.parse(ROOT/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
if sitemap!=canonicals: errors.append(f'Sitemap mismatch: {sitemap.symmetric_difference(canonicals)}')
if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print(f'PASS: {len(pages)} pages; titles, descriptions, H1s, canonicals, JSON-LD, local links/anchors, sitemap.')

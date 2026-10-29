from pathlib import Path
import csv,json,re
root=Path(__file__).resolve().parents[1]
a=root/'data/segment-character-map.csv'; b=root/'web/segment-character-map.csv'
assert a.read_bytes()==b.read_bytes(),'CSV copies differ'
rows=list(csv.DictReader(a.open(encoding='utf-8-sig')))
assert len(rows)==66
html=(root/'web/index.html').read_text(encoding='utf-8')
data=json.loads(re.search(r'export const glyphs = (\[.*?\]);', (root/'web/js/data/glyphs.js').read_text(encoding='utf-8'), re.S).group(1))
assert [(x['char'],x['mask']) for x in data]==[(x['输入'],(int(x['共阴逻辑码'],16) if x['共阴逻辑码'] else None)) for x in rows]
for row in rows:
 if row['共阴逻辑码']:
  assert int(row['共阴逻辑码'],16)^int(row['共阳段电平码'],16)==255
 else:
  assert not row['共阳段电平码']
for page in list(root.rglob('*.md'))+list((root/'web').rglob('*.html')):
 text=page.read_text(encoding='utf-8')
 links=re.findall(r'(?:href|src)="([^"]+)"',text) if page.suffix=='.html' else re.findall(r'\]\(([^)]+)\)',text)
 for link in links:
  if link.startswith(('#','http:','https:','mailto:')):continue
  assert (page.parent/link.split('#')[0]).exists(),f'{page}: missing {link}'
print('PASS: 66 mappings, CSV sync, polarity, local links')

# 浏览器 ES 模块依赖必须存在，避免仅入口 HTML 检查通过。
for module in (root / 'web/js').rglob('*.js'):
 for target in re.findall(r"from ['\"]([^'\"]+)['\"]", module.read_text(encoding='utf-8')):
  assert (module.parent / target).exists(), f'Missing module: {target}'

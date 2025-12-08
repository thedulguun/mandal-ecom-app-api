import re, pathlib
root = pathlib.Path('downloaded-next-static')
pat = re.compile(r'concat\(i,\"(/[^\"]+)')
found = {}
for path in root.rglob('*.js'):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    for m in pat.finditer(text):
        found.setdefault(m.group(1), set()).add(str(path.relative_to(root)))
for ep in sorted(found):
    print(ep)

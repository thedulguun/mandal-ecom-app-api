import re, pathlib
root = pathlib.Path('downloaded-next-static')
pat = re.compile(r"['\"]/api/v1[^'\"\s]*")
found = {}
for path in root.rglob('*.js'):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    for m in pat.finditer(text):
        ep = m.group(0)[1:]  # drop leading quote
        found.setdefault(ep, set()).add(str(path.relative_to(root)))
for ep in sorted(found):
    print(ep)

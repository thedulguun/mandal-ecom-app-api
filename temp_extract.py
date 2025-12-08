import re, pathlib
root = pathlib.Path('downloaded-next-static')
patterns = [
    re.compile(r"/api/v1[^\"'\\\s)]+"),
    re.compile(r"\\/api\\/v1[^\"'\\\s)]+")
]
endpoints = {}
for path in root.rglob('*.js'):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    for pat in patterns:
        for m in pat.finditer(text):
            s = m.group(0)
            # unescape if needed
            s = s.replace('\\/','/').replace('\\\\','\\')
            endpoints.setdefault(s, set()).add(str(path.relative_to(root)))
for ep in sorted(endpoints):
    print(ep)

import pathlib
root = pathlib.Path('downloaded-next-static')
for path in root.rglob('*.js'):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    if '/api/v1' not in text:
        continue
    idx = text.find('/api/v1')
    print('---', path.relative_to(root))
    snippet = text[max(0, idx-120): idx+200]
    print(snippet.replace('\n',' ')[:320])

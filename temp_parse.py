import pathlib,re
root=pathlib.Path('downloaded-next-static')
files=['chunks/6148-e830d5f6e72dc33f.js','chunks/8052-c9149479089c8882.js','chunks/pages/checkDelivery-465cdeec9e98ba07.js','chunks/pages/delivery/[id]\\[boolean]-67f9a51c800e9988.js','chunks/pages/branch/create-65d2b9b7ec968069.js','chunks/pages/branch-3689d891d88551f4.js','chunks/pages/branch/[id]-fcf262e0a5a01173.js','chunks/pages/user/create-6841e956386ac35b.js','chunks/pages/report/customer/[id]-ce50c9a8a474accb.js','chunks/9142-f696f30a328a55f5.js','chunks/4480-867b033a01b3ca25.js','chunks/2929-63b9e3420e5e6b48.js','chunks/4864-4fbb6db43e6d76e9.js','chunks/pages/index-b85806c02dc35e68.js']
for f in files:
    p=root/f
    if not p.exists():
        continue
    txt=p.read_text(encoding='utf-8',errors='ignore')
    if '/api/v1' not in txt and 'concat(i,' not in txt:
        continue
    print('\n---', f)
    for m in re.finditer(r"concat\([a-z],\"(/[^\"]+)\"", txt):
        print('concat path', m.group(1))
    for m in re.finditer(r"\"/api/v1[^\"]*\"", txt):
        s=m.group(0).strip('"')
        print('literal',s)

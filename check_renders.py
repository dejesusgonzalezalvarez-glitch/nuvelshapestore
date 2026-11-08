import os
import re

renders = set()
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.liquid'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    for m in re.finditer(r"render\s+'([^']+)'", content):
                        renders.add(m.group(1))
            except Exception as e:
                print(f"Error reading {path}: {e}")

for r in sorted(renders):
    print(r)

# Check if snippets exist
snippet_dir = 'snippets'
for r in renders:
    snippet_path = os.path.join(snippet_dir, r + '.liquid')
    if not os.path.exists(snippet_path):
        print(f"MISSING SNIPPET: {r}")
    else:
        print(f"OK: {r}")
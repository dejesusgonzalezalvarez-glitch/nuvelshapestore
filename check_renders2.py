import os
import re

with open('sections/main-product.liquid', 'r', encoding='utf-8') as f:
    content = f.read()

renders = re.findall(r"render\s+'([^']+)'", content)
print('Renders in main-product.liquid:')
for r in sorted(set(renders)):
    exists = os.path.exists(f'snippets/{r}.liquid')
    print(f'  {r} - {"OK" if exists else "MISSING"}')
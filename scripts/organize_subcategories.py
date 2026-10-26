import os
import json
import shutil

with open('data/wallpapers.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

wallpapers = data['wallpapers']

base_dir = os.path.abspath('categorized')
print(f"Organizing subcategories under: {base_dir}")

created_links = 0
skipped = 0

for wp in wallpapers:
    device = wp.get('device', 'Mobile')
    category = wp.get('category', 'Abstract & 3D')
    subcategory = wp.get('subcategory', '3D Shapes & Spatial Math')
    filename = wp.get('filename')
    
    # Target directory: categorized/<Device>/<Category>/<Subcategory>
    target_dir = os.path.join(base_dir, device, category, subcategory)
    os.makedirs(target_dir, exist_ok=True)
    
    target_path = os.path.join(target_dir, filename)
    
    # Source file
    orig_folder = wp.get('originalFolder')
    orig_file = wp.get('originalFilename')
    source_path = os.path.abspath(os.path.join(orig_folder, orig_file))
    
    if not os.path.exists(target_path):
        if os.path.exists(source_path):
            try:
                os.link(source_path, target_path)
                created_links += 1
            except Exception as e:
                # If hardlink fails, fallback to copy or skip
                try:
                    shutil.copy2(source_path, target_path)
                    created_links += 1
                except Exception:
                    skipped += 1
        else:
            skipped += 1

print(f"Created {created_links} subcategory hardlinks. Skipped: {skipped}")

import json

with open('data/wallpapers.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for cat in data['categories']:
    cat_name = cat['name']
    cat_wps = [w for w in data['wallpapers'] if w['category'] == cat_name]
    print(f"=== {cat_name} ({len(cat_wps)}) ===")
    sample_tags = set()
    sample_titles = []
    for w in cat_wps:
        for t in w.get('tags', []):
            if len(t) > 2 and not t.isdigit() and not t.startswith('wp_'):
                sample_tags.add(t)
        if len(sample_titles) < 5 and not w['title'].startswith('0') and not w['title'].startswith('1') and not w['title'].startswith('2'):
            sample_titles.append(w['title'])
    
    print("  Sample tags:", list(sample_tags)[:15])
    print("  Sample titles:", sample_titles[:5])

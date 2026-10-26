import os
import sys
import re
import json
import time
import math
from collections import Counter
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

import torch
from torchvision import models

# Load MobileNetV3 model for zero-shot image classification
print("Loading vision model (MobileNetV3)...")
weights = models.MobileNet_V3_Small_Weights.DEFAULT
model = models.mobilenet_v3_small(weights=weights).eval()
preprocess = weights.transforms()
imagenet_categories = weights.meta['categories']
print(f"Model loaded with {len(imagenet_categories)} ImageNet classes.")

# Target Categories
CATEGORIES = {
    "Anime & Manga": {
        "slug": "anime-manga",
        "description": "Japanese animation, manga art, iconic characters, and anime aesthetics",
        "keywords": [
            "anime", "manga", "otaku", "naruto", "sasuke", "kakashi", "itachi", "goku", "vegeta",
            "dragonball", "luffy", "zoro", "onepiece", "gojo", "sukuna", "toji", "jujutsu", "jjk",
            "tanjiro", "nezuko", "demonslayer", "kimetsu", "tokyorevengers", "mikey", "sanomanjiro",
            "bleach", "ichigo", "aot", "eren", "levi", "attackontitan", "berserk", "guts", "deathnote",
            "light", "ryuk", "waifu", "kawaii", "genshin", "honkai", "avatar", "matchingpfp",
            "mangaboy", "mangagirl", "animewall", "pfp", "shonen", "seinen", "inuyasha", "evangelion",
            "ghibli", "totoro", "spiritedaway", "chainsawman", "denji", "makima", "power", "solo leveling",
            "sungjinwoo", "vinlandsaga", "hunterxhunter", "killua", "gon", "hisoka", "boruto"
        ],
        "imagenet": [
            "comic book", "cartoon", "mask", "wig", "stage", "theater curtain", "costume", "puppet"
        ]
    },
    "Cars & Automotive": {
        "slug": "cars-automotive",
        "description": "Supercars, hypercars, JDM legends, luxury sedans, and automotive photography",
        "keywords": [
            "car", "cars", "automotive", "supercar", "hypercar", "porsche", "ferrari", "lamborghini",
            "bmw", "mercedes", "amg", "audi", "nissan", "gtr", "skyline", "supra", "toyota", "mclaren",
            "bugatti", "mustang", "ford", "corvette", "chevrolet", "dodge", "challenger", "charger",
            "jdm", "drift", "drifting", "racer", "speed", "motorsport", "formula1", "f1", "turbo",
            "exhaust", "wheel", "rims", "astonmartin", "bentley", "rollsroyce", "pagani", "koenigsegg",
            "honda", "nsx", "subaru", "wrx", "mazda", "rx7", "miata", "lexus", "lfa"
        ],
        "imagenet": [
            "sports car", "racer", "convertible", "limousine", "grille", "car wheel", "cab",
            "minivan", "jeep", "pickup", "beach wagon", "tow truck", "trailer truck", "model T",
            "police van", "fire engine", "garbage truck", "motor scooter", "moped"
        ]
    },
    "Nature & Landscapes": {
        "slug": "nature-landscapes",
        "description": "Majestic mountains, sunsets, serene lakes, lush forests, and scenic wonders",
        "keywords": [
            "nature", "landscape", "mountain", "mountains", "forest", "trees", "lake", "river",
            "waterfall", "sunset", "sunrise", "beach", "ocean", "sea", "autumn", "winter", "snow",
            "clouds", "valley", "hills", "fjord", "cliff", "coast", "woods", "jungle", "desert",
            "sand", "dune", "rain", "fog", "mist", "meadow", "fields", "wildflowers", "canyon",
            "water", "sky", "horizon", "scenery", "outdoor", "earth"
        ],
        "imagenet": [
            "alp", "promontory", "seashore", "lakeside", "cliff", "valley", "volcano", "sandbar",
            "coral reef", "geyser", "dam", "fountain"
        ]
    },
    "Cyberpunk & Sci-Fi": {
        "slug": "cyberpunk-sci-fi",
        "description": "Futuristic neon cities, dystopian landscapes, synthwave vibes, and sci-fi technology",
        "keywords": [
            "cyberpunk", "scifi", "sci-fi", "cyber", "neon", "synthwave", "retrowave", "vaporwave",
            "futuristic", "dystopia", "dystopian", "mecha", "robot", "cyborg", "android", "bladerunner",
            "matrix", "hologram", "future", "cybercity", "nightcity", "neonlight", "glitch",
            "techwear", "cybernetic", "cyberpunk2077"
        ],
        "imagenet": [
            "gasmask", "neon sign", "space suit", "crash helmet", "laser", "scoreboard", "traffic light"
        ]
    },
    "Dark & AMOLED": {
        "slug": "dark-amoled",
        "description": "Pure black backgrounds, OLED-optimized visuals, minimalist shadows, and noir mood",
        "keywords": [
            "amoled", "oled", "dark", "pitchblack", "minimal", "minimalist", "minimalism", "monochrome",
            "black", "noir", "shadow", "silhouette", "darkness", "stealth", "matte", "clean"
        ],
        "imagenet": []
    },
    "Abstract & 3D": {
        "slug": "abstract-3d",
        "description": "3D geometric renders, liquid fluid gradients, digital textures, and surreal visual art",
        "keywords": [
            "abstract", "3d", "3dartist", "render", "blender", "cinema4d", "c4d", "octane", "gradient",
            "fluid", "liquid", "geometry", "geometric", "digitalart", "generativeart", "generative",
            "aiart", "diffusion", "stablediffusion", "dalle", "midjourney", "fractal", "surreal",
            "surrealism", "texture", "shapes", "colorful", "artistic", "visuals", "pattern"
        ],
        "imagenet": [
            "bubble", "balloon", "spiral", "pinwheel", "kaleidoscope", "coil", "origami",
            "jigsaw puzzle", "maze"
        ]
    },
    "Gaming & Superheroes": {
        "slug": "gaming-superheroes",
        "description": "Iconic game heroes, Marvel and DC characters, comic art, and gaming worlds",
        "keywords": [
            "game", "gaming", "gamer", "playstation", "xbox", "nintendo", "pcgaming", "steam",
            "zelda", "mario", "pokemon", "witcher", "geralt", "godofwar", "kratos", "halo", "masterchief",
            "eldenring", "darksouls", "bloodborne", "valorant", "csgo", "counterstrike", "overwatch",
            "marvel", "avengers", "ironman", "spiderman", "batman", "superman", "joker", "dc", "dccomics",
            "deadpool", "wolverine", "xmen", "venom", "thor", "captainamerica", "superhero", "fortnite",
            "apexlegends", "leagueoflegends", "riotgames", "assassinscreed", "cyberpunkgame"
        ],
        "imagenet": [
            "joystick", "home theater", "slot machine", "pinball", "scoreboard", "shield", "suit of armor"
        ]
    },
    "Space & Cosmos": {
        "slug": "space-cosmos",
        "description": "Deep space galaxies, swirling nebulas, astronaut journeys, and planetary vistas",
        "keywords": [
            "space", "cosmos", "cosmic", "galaxy", "milkyway", "nebula", "astronaut", "planet",
            "planets", "earth", "moon", "mars", "saturn", "jupiter", "stars", "starry", "starlight",
            "astronomy", "astrophotography", "telescope", "hubble", "jameswebb", "nasa", "spacex",
            "supernova", "blackhole", "interstellar", "orbit", "solar", "solarsystem", "meteor", "comet"
        ],
        "imagenet": [
            "space shuttle", "astronomy", "planetarium", "radio telescope"
        ]
    },
    "Urban & Architecture": {
        "slug": "urban-architecture",
        "description": "City skylines, architectural wonders, atmospheric streets, and night cityscapes",
        "keywords": [
            "city", "urban", "street", "architecture", "building", "skyscraper", "skyline", "tokyo",
            "newyork", "nyc", "london", "paris", "bridge", "tower", "downtown", "metropolis", "road",
            "highway", "alley", "alleyway", "subway", "metro", "pavement", "facade", "streetphotography"
        ],
        "imagenet": [
            "suspension bridge", "steel arch bridge", "viaduct", "pier", "beacon", "lighthouse",
            "church", "mosque", "bell cote", "cinema", "triumphal arch", "monastery", "palace"
        ]
    },
    "Animals & Wildlife": {
        "slug": "animals-wildlife",
        "description": "Wild predators, majestic birds, loyal canines, graceful cats, and wildlife photography",
        "keywords": [
            "animal", "animals", "wildlife", "cat", "cats", "kitten", "dog", "dogs", "puppy",
            "wolf", "wolves", "lion", "tiger", "leopard", "cheetah", "panther", "jaguar", "bear",
            "eagle", "hawk", "falcon", "owl", "bird", "birds", "fox", "deer", "stag", "horse",
            "elephant", "whale", "dolphin", "shark", "reptile", "snake", "dragon", "wild"
        ],
        "imagenet": [
            "tabby", "tiger cat", "Persian cat", "Siamese cat", "Egyptian cat", "tiger", "jaguar",
            "lion", "leopard", "snow leopard", "cheetah", "cougar", "grey wolf", "red wolf", "coyote",
            "dingo", "dhole", "African hunting dog", "golden retriever", "Labrador retriever",
            "German shepherd", "husky", "malamute", "rottweiler", "boxer", "Great Dane", "bear",
            "brown bear", "polar bear", "sloth bear", "giant panda", "bald eagle", "vulture", "great grey owl",
            "macaw", "toucan", "hummingbird", "killer whale"
        ]
    }
}

# Invert ImageNet lookup for fast category matching
IMAGENET_TO_CATEGORY = {}
for cat_name, cat_data in CATEGORIES.items():
    for in_class in cat_data["imagenet"]:
        IMAGENET_TO_CATEGORY[in_class.lower()] = cat_name

def analyze_image_properties(img_path):
    """Calculate dimensions, orientation, luminance, amoled ratio, and dominant colors."""
    try:
        with Image.open(img_path) as img:
            w, h = img.size
            fmt = (img.format or "jpg").lower()
            
            # Orientation & Aspect Ratio
            if h > w * 1.15:
                orientation = "portrait"
                gcd = math.gcd(w, h)
                rw, rh = round(w / gcd), round(h / gcd)
                if rw <= 16 and rh <= 32:
                    aspect_ratio = f"{rw}:{rh}"
                else:
                    aspect_ratio = f"9:{round(9 * h / w)}"
            elif w > h * 1.15:
                orientation = "landscape"
                gcd = math.gcd(w, h)
                rw, rh = round(w / gcd), round(h / gcd)
                if rw <= 32 and rh <= 16:
                    aspect_ratio = f"{rw}:{rh}"
                else:
                    aspect_ratio = f"{round(16 * w / h)}:9"
            else:
                orientation = "square"
                aspect_ratio = "1:1"
            
            # Fast thumbnail for color/luminance analysis
            thumb = img.convert('RGB').resize((64, 64))
            pixels = list(thumb.getdata())
            
            # Calculate luminance and pure black ratio
            total_lum = 0
            black_count = 0
            for r, g, b in pixels:
                lum = 0.299 * r + 0.587 * g + 0.114 * b
                total_lum += lum
                if lum < 15:
                    black_count += 1
            
            avg_lum = total_lum / len(pixels)
            black_ratio = black_count / len(pixels)
            
            # Dominant colors
            quantized = thumb.quantize(colors=3, method=Image.Quantize.MEDIANCUT).convert('RGB')
            color_counts = Counter(quantized.getdata())
            dominant_colors = []
            for (r, g, b), _ in color_counts.most_common(3):
                dominant_colors.append(f"#{r:02x}{g:02x}{b:02x}")
            
            dominant_color = dominant_colors[0] if dominant_colors else "#111827"
            
            return {
                "width": w,
                "height": h,
                "format": fmt,
                "orientation": orientation,
                "aspectRatio": aspect_ratio,
                "avgLuminance": avg_lum,
                "blackRatio": black_ratio,
                "dominantColor": dominant_color,
                "colorPalette": dominant_colors
            }
    except Exception as e:
        return None

def extract_tags_and_title(filename):
    """Extract semantic tags and readable title from filename."""
    name, _ = os.path.splitext(filename)
    # Extract hashtag or underscore words
    raw_tokens = re.findall(r'[a-zA-Z0-9]{2,}', name)
    tags = []
    stopwords = {"jpg", "jpeg", "png", "webp", "heic", "thumb", "copy", "img", "image", "like", "follow", "who", "want", "post", "extra", "large", "pictures", "get", "tutorial", "from", "highlights"}
    
    for t in raw_tokens:
        tl = t.lower()
        if tl not in stopwords and not tl.isdigit() and len(tl) > 2:
            tags.append(tl)
    
    # Generate clean human title
    title_words = [w.capitalize() for w in tags[:4]]
    if title_words:
        title = " ".join(title_words)
    else:
        # Fallback for hash or date names
        title = f"Wallpaper {name[:8].upper()}"
        
    return tags, title

def classify_wallpaper(filename, img_props, model_pred):
    """Scores all categories based on filename keywords, visual model prediction, and luminance."""
    scores = {cat: 0.0 for cat in CATEGORIES}
    
    name_lower = filename.lower()
    
    # 1. Filename keyword matching (Strong signal)
    for cat_name, cat_data in CATEGORIES.items():
        for kw in cat_data["keywords"]:
            if kw in name_lower:
                scores[cat_name] += 4.0
    
    # 2. Vision model matching (Moderate signal)
    if model_pred:
        pred_lower = model_pred.lower()
        if pred_lower in IMAGENET_TO_CATEGORY:
            matched_cat = IMAGENET_TO_CATEGORY[pred_lower]
            scores[matched_cat] += 3.5
        else:
            # Partial substring matching with imagenet classes
            for in_class, cat_name in IMAGENET_TO_CATEGORY.items():
                if in_class in pred_lower:
                    scores[cat_name] += 2.5
                    break
    
    # 3. Luminance / Dark / AMOLED signal
    if img_props:
        if img_props["blackRatio"] > 0.45 or img_props["avgLuminance"] < 25:
            scores["Dark & AMOLED"] += 4.5
        elif img_props["blackRatio"] > 0.30:
            scores["Dark & AMOLED"] += 2.0
            
    # Pick highest category, fallback to Abstract & 3D if no strong signal
    best_cat = max(scores, key=scores.get)
    if scores[best_cat] == 0:
        best_cat = "Abstract & 3D"
        
    return best_cat

def sanitize_filename(name, max_len=60):
    """Create Windows-safe filename."""
    base, ext = os.path.splitext(name)
    clean_base = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', base)
    clean_base = re.sub(r'_+', '_', clean_base).strip('_.')
    if not clean_base:
        clean_base = "wallpaper"
    if len(clean_base) > max_len:
        clean_base = clean_base[:max_len]
    return f"{clean_base}{ext.lower()}"

def main():
    t_start = time.time()
    source_dirs = ['WALL-E', 'wallpaper']
    output_dir = 'categorized'
    
    os.makedirs(output_dir, exist_ok=True)
    for cat in CATEGORIES:
        os.makedirs(os.path.join(output_dir, cat), exist_ok=True)
    
    all_files = []
    for sdir in source_dirs:
        if os.path.exists(sdir):
            for fname in os.listdir(sdir):
                fpath = os.path.join(sdir, fname)
                if os.path.isfile(fpath):
                    ext = os.path.splitext(fname)[1].lower()
                    if ext in ['.jpg', '.jpeg', '.png', '.webp', '.heic']:
                        all_files.append((sdir, fname, fpath))
                        
    total_count = len(all_files)
    print(f"Total wallpapers found across sources: {total_count}")
    
    wallpapers_data = []
    category_counts = Counter()
    processed_count = 0
    errors = 0
    
    print("Beginning categorization and hardlink generation...")
    
    # Process in batches for vision inference
    for sdir, fname, fpath in all_files:
        try:
            # 1. Properties
            props = analyze_image_properties(fpath)
            if not props:
                errors += 1
                continue
                
            # 2. Vision prediction
            model_pred = None
            try:
                with Image.open(fpath) as img:
                    rgb = img.convert('RGB')
                    tensor = preprocess(rgb).unsqueeze(0)
                    with torch.no_grad():
                        out = model(tensor)
                        model_pred = imagenet_categories[out.argmax().item()]
            except Exception:
                pass
                
            # 3. Classification
            category = classify_wallpaper(fname, props, model_pred)
            category_counts[category] += 1
            
            # 4. Clean tags and title
            tags, title = extract_tags_and_title(fname)
            tags.append(CATEGORIES[category]["slug"])
            
            # 5. Create safe destination name and hardlink
            safe_name = sanitize_filename(fname)
            cat_folder = os.path.join(output_dir, category)
            dest_path = os.path.join(cat_folder, safe_name)
            
            # Avoid name collisions
            collision_idx = 1
            while os.path.exists(dest_path):
                b, e = os.path.splitext(safe_name)
                dest_path = os.path.join(cat_folder, f"{b}_{collision_idx}{e}")
                collision_idx += 1
                
            # Create hardlink
            try:
                os.link(fpath, dest_path)
            except Exception:
                # Fallback to copy if hardlink fails
                import shutil
                shutil.copy2(fpath, dest_path)
                
            rel_dest = os.path.relpath(dest_path, ".")
            file_id = f"wp_{len(wallpapers_data) + 1:05d}"
            
            wallpapers_data.append({
                "id": file_id,
                "title": title,
                "category": category,
                "categorySlug": CATEGORIES[category]["slug"],
                "filename": os.path.basename(dest_path),
                "originalFolder": sdir,
                "originalFilename": fname,
                "path": rel_dest.replace("\\", "/"),
                "width": props["width"],
                "height": props["height"],
                "orientation": props["orientation"],
                "aspectRatio": props["aspectRatio"],
                "is4K": props["width"] >= 3840 or props["height"] >= 2160,
                "isAmoled": props["blackRatio"] > 0.40,
                "dominantColor": props["dominantColor"],
                "colorPalette": props["colorPalette"],
                "tags": list(set(tags))[:10],
                "sizeBytes": os.path.getsize(fpath),
                "format": props["format"]
            })
            
            processed_count += 1
            if processed_count % 250 == 0 or processed_count == total_count:
                elapsed = time.time() - t_start
                rate = processed_count / elapsed
                remaining = (total_count - processed_count) / rate if rate > 0 else 0
                print(f"[{processed_count}/{total_count}] ({processed_count/total_count*100:.1f}%) "
                      f"Speed: {rate:.1f} img/s | ETA: {remaining:.0f}s")
                      
        except Exception as e:
            errors += 1
            if errors < 10:
                print(f"Error processing {fname}: {e}")
                
    # Save wallpapers.json
    os.makedirs("data", exist_ok=True)
    json_path = os.path.join("data", "wallpapers.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
            "totalWallpapers": len(wallpapers_data),
            "categories": [
                {
                    "name": name,
                    "slug": data["slug"],
                    "description": data["description"],
                    "count": category_counts[name]
                }
                for name, data in CATEGORIES.items()
            ],
            "wallpapers": wallpapers_data
        }, f, indent=2, ensure_ascii=False)
        
    t_end = time.time()
    print("\n" + "="*50)
    print(f"SUCCESS: Categorized {len(wallpapers_data)} wallpapers in {t_end - t_start:.1f} seconds!")
    print(f"Errors skipped: {errors}")
    print("\nCategory Breakdown:")
    for cat, count in category_counts.most_common():
        pct = count / len(wallpapers_data) * 100
        print(f"  - {cat:24}: {count:5} images ({pct:5.1f}%)")
    print("="*50)

if __name__ == "__main__":
    main()

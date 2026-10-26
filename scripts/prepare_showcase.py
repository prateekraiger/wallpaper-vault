import os
import sys
import json
import shutil
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

def main():
    print("Preparing device-aware showcase wallpapers and thumbnails for Next.js...")
    
    with open("data/wallpapers.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    wallpapers = data["wallpapers"]
    categories = data["categories"]
    
    os.makedirs("public/wallpapers", exist_ok=True)
    os.makedirs("public/thumbnails", exist_ok=True)
    
    showcase_ids = set()
    
    for cat in categories:
        cname = cat["name"]
        cat_wps = [w for w in wallpapers if w["category"] == cname]
        
        # Pick top desktop wallpapers
        desktops = [w for w in cat_wps if w["device"] == "Desktop"]
        desktops.sort(key=lambda x: (x["width"] * x["height"]), reverse=True)
        for w in desktops[:5]:
            showcase_ids.add(w["id"])
            
        # Pick top mobile wallpapers
        mobiles = [w for w in cat_wps if w["device"] == "Mobile"]
        mobiles.sort(key=lambda x: (x["width"] * x["height"]), reverse=True)
        for w in mobiles[:5]:
            showcase_ids.add(w["id"])
            
        # Pick top square wallpapers
        squares = [w for w in cat_wps if w["device"] == "Square & Avatars"]
        squares.sort(key=lambda x: (x["width"] * x["height"]), reverse=True)
        for w in squares[:2]:
            showcase_ids.add(w["id"])
            
    print(f"Selected {len(showcase_ids)} showcase wallpapers across devices and categories.")
    
    # Process showcase files
    for wp in wallpapers:
        if wp["id"] in showcase_ids:
            wp["isShowcase"] = True
            src_path = wp["path"]
            dst_showcase = os.path.join("public/wallpapers", wp["filename"])
            dst_thumb = os.path.join("public/thumbnails", f"{wp['id']}.webp")
            
            if os.path.exists(src_path):
                if not os.path.exists(dst_showcase):
                    try:
                        shutil.copy2(src_path, dst_showcase)
                    except Exception:
                        pass
                        
                if not os.path.exists(dst_thumb):
                    try:
                        with Image.open(src_path) as img:
                            img = img.convert("RGB")
                            w, h = img.size
                            new_w = 480
                            new_h = int(h * (new_w / w))
                            thumb = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                            thumb.save(dst_thumb, "WEBP", quality=80)
                    except Exception as e:
                        print(f"Error creating thumbnail for {wp['id']}: {e}")
                        
            wp["thumbUrl"] = f"/thumbnails/{wp['id']}.webp"
            wp["url"] = f"/wallpapers/{wp['filename']}"
        else:
            wp["isShowcase"] = False
            wp["thumbUrl"] = f"/api/wallpaper/{wp['id']}?thumb=true"
            wp["url"] = f"/api/wallpaper/{wp['id']}"
            
    with open("data/wallpapers.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print("Showcase assets generation complete!")

if __name__ == "__main__":
    main()

import os
import sys
import json
import shutil

sys.stdout.reconfigure(encoding='utf-8')

def main():
    print("Re-organizing folders by Device (Desktop, Mobile, Square & Avatars)...")
    
    with open("data/wallpapers.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    wallpapers = data["wallpapers"]
    
    # Target device folders
    devices = {
        "landscape": "Desktop",
        "portrait": "Mobile",
        "square": "Square & Avatars"
    }
    
    base_dir = "categorized"
    
    # Remove old flat category folders if needed or build device hierarchy
    for dev_name in devices.values():
        for cat in data["categories"]:
            os.makedirs(os.path.join(base_dir, dev_name, cat["name"]), exist_ok=True)
            
    device_counts = {"Desktop": 0, "Mobile": 0, "Square & Avatars": 0}
    
    for wp in wallpapers:
        orient = wp["orientation"]
        device_folder = devices.get(orient, "Mobile")
        cat_name = wp["category"]
        fname = wp["filename"]
        
        # Source could be in categorized/cat_name or in original source
        old_cat_path = os.path.join(base_dir, cat_name, fname)
        orig_source = os.path.join(wp["originalFolder"], wp["originalFilename"])
        
        target_path = os.path.join(base_dir, device_folder, cat_name, fname)
        
        # Link to target_path
        if not os.path.exists(target_path):
            src_file = old_cat_path if os.path.exists(old_cat_path) else orig_source
            if os.path.exists(src_file):
                try:
                    os.link(src_file, target_path)
                except Exception:
                    try:
                        shutil.copy2(src_file, target_path)
                    except Exception as e:
                        print(f"Error copying {fname}: {e}")
                        
        wp["device"] = device_folder
        wp["deviceSlug"] = device_folder.lower().replace(" & ", "-").replace(" ", "-")
        wp["path"] = target_path.replace("\\", "/")
        device_counts[device_folder] += 1
        
    # Clean up the previous flat categorized folders that are now moved into Desktop/Mobile
    for cat in data["categories"]:
        old_folder = os.path.join(base_dir, cat["name"])
        if os.path.exists(old_folder):
            try:
                # Remove files and folder
                for f in os.listdir(old_folder):
                    os.remove(os.path.join(old_folder, f))
                os.rmdir(old_folder)
            except Exception:
                pass
                
    # Update data
    data["deviceCounts"] = device_counts
    with open("data/wallpapers.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print("\nOrganization by Device Complete!")
    print(f"  - 🖥️  Desktop Wallpapers (Landscape) : {device_counts['Desktop']}")
    print(f"  - 📱 Mobile Wallpapers (Portrait)   : {device_counts['Mobile']}")
    print(f"  - 🔲 Square & Avatars Wallpapers    : {device_counts['Square & Avatars']}")
    print(f"  Total Wallpapers: {len(wallpapers)}")

if __name__ == "__main__":
    main()

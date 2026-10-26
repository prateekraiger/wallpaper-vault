import json
import re
import hashlib
from collections import Counter

# Load existing wallpapers data
with open('data/wallpapers.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

wallpapers = data['wallpapers']

# Subcategories taxonomy by category slug
SUBCATEGORIES = {
    'anime-manga': [
        ('cyberpunk-anime', 'Cyberpunk & Sci-Fi Anime', 'Futuristic neo-Tokyo aesthetics, mecha warriors, and glowing cyber gear.', ['cyber', 'neon', 'sci-fi', 'futuristic', 'mecha', 'tokyo', 'gundam']),
        ('shonen-action', 'Shonen & Battle Auras', 'High-stakes battle stances, power surges, energy auras, and legendary rivalries.', ['naruto', 'sasuke', 'battle', 'dragon', 'goku', 'shonen', 'punch', 'warrior', 'power']),
        ('lofi-chill', 'Lo-Fi & Cozy Vibe', 'Peaceful lo-fi rooms, rain on bedroom windows, coffee moments, and gentle pastel skies.', ['chill', 'lofi', 'room', 'coffee', 'pastel', 'rain', 'cozy', 'relax', 'night', 'sky']),
        ('dark-fantasy', 'Dark Fantasy & Samurai', 'Katana blades, cursed spirits, gothic armor, moonlight shadows, and mythic ronin.', ['samurai', 'blade', 'katana', 'dark', 'fantasy', 'spirit', 'shadow', 'demon', 'sword']),
        ('iconic-portraits', 'Iconic Portraits & Avatars', 'Expressive character close-ups, striking eyes, and iconic stylized character portraits.', ['portrait', 'face', 'eyes', 'girl', 'boy', 'avatar', 'genshin', 'character'])
    ],
    'cars-automotive': [
        ('supercars-hypercars', 'Supercars & Hypercars', 'Bespoke engineering marvels, sculpted carbon aero, and raw horsepower.', ['ferrari', 'lambo', 'lamborghini', 'bugatti', 'koenigsegg', 'mclaren', 'porsche', 'supercar', 'hypercar']),
        ('jdm-tuners', 'JDM & Japanese Legends', 'Tokyo street drift legends, twin-turbo heritage, widebodies, and tuner culture.', ['gtr', 'skyline', 'supra', 'rx7', 'silvia', 'nissan', 'toyota', 'jdm', 'drift']),
        ('classics-muscle', 'Classics & American Muscle', 'Rumbling American V8s, retro muscle silhouettes, chrome bumpers, and classic speed.', ['mustang', 'camaro', 'corvette', 'dodge', 'challenger', 'charger', 'classic', 'muscle']),
        ('night-drift', 'Night Drift & Neon Rides', 'Rain-slicked asphalt, neon tail light streaks, wet city reflections, and midnight runs.', ['night', 'neon', 'rain', 'dark', 'street', 'reflection', 'city']),
        ('racing-motorsport', 'Track & Formula Racing', 'Apex clipping, high-downforce wings, slicks on tarmac, and championship pedigree.', ['race', 'f1', 'formula', 'track', 'gt3', 'circuit', 'racing', 'speed'])
    ],
    'nature-landscapes': [
        ('mountains-peaks', 'Alpine Peaks & Summits', 'Jagged mountain ranges, snow-capped giants, and rugged elevated majesty.', ['mountain', 'peak', 'alpine', 'summit', 'snow', 'cliff', 'rock', 'ridge']),
        ('oceans-beaches', 'Oceans, Waves & Coasts', 'Turquoise waters, breaking swells, coastline cliffs, and sunset shorelines.', ['ocean', 'sea', 'wave', 'beach', 'coast', 'water', 'tide', 'surf']),
        ('forests-woodlands', 'Mystic Forests & Woodlands', 'Emerald pine canopies, sunbeam rays piercing morning mist, and ancient groves.', ['forest', 'tree', 'pine', 'woodland', 'mist', 'fog', 'green', 'leaves']),
        ('sunsets-skies', 'Golden Hour & Twilight Skies', 'Warm gradients of amber, dusk clouds, and breathtaking twilight horizons.', ['sunset', 'sunrise', 'golden', 'dusk', 'twilight', 'sky', 'cloud', 'amber']),
        ('aurora-night', 'Aurora & Starlit Nights', 'Northern lights ribbons, star-filled cosmic night skies, and nocturnal tranquility.', ['aurora', 'night', 'stars', 'moon', 'constellation', 'celestial'])
    ],
    'cyberpunk-sci-fi': [
        ('neon-cityscapes', 'Neon Cityscapes & Towers', 'Colossal dystopian skyscrapers, holographic billboards, and neon-lit rainy streets.', ['neon', 'city', 'tower', 'skyscraper', 'tokyo', 'rain', 'hologram']),
        ('synthwave-retrowave', 'Synthwave & 80s Retrowave', 'Outrun chrome grids, magenta-cyan suns, wireframes, and retro-futuristic nostalgia.', ['synthwave', 'retrowave', 'outrun', 'retro', 'grid', '80s', 'magenta', 'cyan']),
        ('cyborgs-androids', 'Cyborgs & Cybernetic AI', 'Neural interfaces, biomechanical armor, glowing optics, and android aesthetics.', ['cyborg', 'android', 'robot', 'mecha', 'ai', 'cybernetic', 'bionic']),
        ('futuristic-vehicles', 'Orbital Craft & Starships', 'Interstellar freighters, aerodynamic airspeeders, and deep-space interceptors.', ['ship', 'craft', 'vehicle', 'speeder', 'shuttle', 'orbital', 'station'])
    ],
    'dark-amoled': [
        ('true-black-oled', 'True Black Minimalist', '100% OLED deep pitch black backdrops with clean, distraction-free focal points.', ['amoled', 'black', 'pure', 'minimal', 'pitch', 'oled']),
        ('neon-noir', 'Neon Noir & Glow', 'Intense luminous neon hues piercing through pitch-black shadows.', ['neon', 'glow', 'noir', 'shadow', 'light', 'contrast', 'electric']),
        ('dark-abstract', 'Dark Textures & Geometry', 'Carbon weaves, dark obsidian ripples, smoked glass, and dimensional shadows.', ['texture', 'carbon', 'geometry', 'smoke', 'dark', 'fluid', 'abstract']),
        ('typography-quotes', 'Typography & Minimal Words', 'Thought-provoking words, Japanese kanji, and stark minimalist typographic design.', ['quote', 'typography', 'text', 'kanji', 'words', 'minimalist'])
    ],
    'abstract-3d': [
        ('fluid-gradients', 'Liquid & Fluid Gradients', 'Silky molten ribbons, fluid color transitions, and soft chromatic blending.', ['fluid', 'liquid', 'gradient', 'blend', 'silk', 'flow', 'wave']),
        ('3d-geometrics', '3D Shapes & Spatial Math', 'Floating isometric solids, glass spheres, tessellations, and sculpted 3D forms.', ['3d', 'sphere', 'geometric', 'cube', 'shape', 'spatial', 'render']),
        ('iridescent-chromatic', 'Iridescent & Holographic', 'Prismatic oil sheen, metallic chrome reflections, and rainbow dispersion.', ['iridescent', 'holographic', 'chromatic', 'prism', 'rainbow', 'chrome', 'metallic']),
        ('minimalist-materials', 'Matte Materials & Glass', 'Claymorphism, frosted translucent glass, subtle shadows, and calm minimalism.', ['glass', 'matte', 'clay', 'minimal', 'clean', 'simple', 'texture']),
        ('textured-dark', 'Dark Waves & Energy Fields', 'Deep digital noise, dark flowing particle fields, and hypnotic organic textures.', ['dark', 'particle', 'noise', 'field', 'energy', 'mesh', 'abstract'])
    ],
    'gaming-superheroes': [
        ('comic-heroes', 'Comic Titans & Vigilantes', 'Dark Knights, friendly neighborhood web-slingers, and invincible defenders.', ['batman', 'spiderman', 'spider', 'superman', 'ironman', 'marvel', 'dc', 'hero', 'avenger']),
        ('fantasy-rpg', 'Fantasy RPG & Mythic Lore', 'Dark fantasy knight armors, mythical beasts, glowing runes, and soul-stirring ruins.', ['rpg', 'elden', 'witcher', 'knight', 'rune', 'fantasy', 'sword', 'magic']),
        ('action-shooters', 'Tactical & Sci-Fi Action', 'High-octane operatives, tactical armor, futuristic warfare, and battle royales.', ['fortnite', 'cyberpunk', 'cod', 'tactical', 'soldier', 'shooter', 'war']),
        ('retro-pixel', 'Pixel Art & Retro Nostalgia', 'Pixelated adventures, arcade memories, 16-bit worlds, and timeless gaming lore.', ['pixel', 'retro', 'arcade', 'pokemon', '8bit', '16bit', 'nintendo'])
    ],
    'space-cosmos': [
        ('nebulas-galaxies', 'Swirling Nebulas & Galaxies', 'Deep space interstellar dust clouds, vibrant stellar nurseries, and cosmic spirals.', ['nebula', 'galaxy', 'dust', 'cosmic', 'stellar', 'hubble', 'spiral']),
        ('astronauts-deepspace', 'Astronauts & Deep Solitude', 'Spacewalkers floating above Earth, planetary explorers, and infinite voids.', ['astronaut', 'spaceman', 'suit', 'deep', 'solitude', 'floating', 'void']),
        ('planets-horizons', 'Planetary Horizons & Moons', 'Rings of Saturn, lunar eclipses, red planet dunes, and celestial alignments.', ['planet', 'moon', 'mars', 'saturn', 'horizon', 'eclipse', 'orbit'])
    ],
    'urban-architecture': [
        ('skylines-cityscapes', 'Metropolis Skylines & Heights', 'Soaring glass skyscrapers, sprawling urban grids, and iconic skyline views.', ['skyline', 'skyscraper', 'city', 'metropolis', 'tower', 'urban', 'heights']),
        ('rainy-streets', 'Rain-Slicked Moody Streets', 'Asphalt puddle reflections, street lamp halos, quiet crosswalks, and urban loneliness.', ['rain', 'street', 'alley', 'puddle', 'night', 'lamp', 'walk']),
        ('modern-geometry', 'Modernist Structural Symmetry', 'Bold cantilever angles, spiraling staircases, exposed concrete, and architectural balance.', ['architecture', 'geometry', 'symmetry', 'concrete', 'building', 'structure', 'modern'])
    ],
    'animals-wildlife': [
        ('apex-predators', 'Apex Predators & Big Cats', 'Stalking panthers, golden-maned lions, fierce tigers, and raw savanna power.', ['lion', 'tiger', 'panther', 'leopard', 'cat', 'predator', 'wild']),
        ('birds-flight', 'Wings of Flight & Raptors', 'Soaring eagles, silent night owls, colorful tropical feathers, and aerial freedom.', ['eagle', 'owl', 'bird', 'wing', 'feather', 'flight', 'hawk']),
        ('wolves-canines', 'Wolves & Wild Companions', 'Midnight howling wolves, noble loyal canines, and untamed mountain spirits.', ['wolf', 'canine', 'dog', 'samoyed', 'pack', 'wild']),
        ('marine-creatures', 'Ocean Wonders & Marine Depths', 'Gliding manta rays, gentle blue whales, coral ecosystems, and deep water majesty.', ['whale', 'fish', 'shark', 'marine', 'ocean', 'sea', 'aquatic'])
    ]
}

# Human titles generator vocabulary based on subcategory and color
TITLE_ADJECTIVES = {
    'cyan': ['Cyan', 'Azure', 'Electric', 'Cerulean', 'Glacial', 'Neon'],
    'blue': ['Cobalt', 'Sapphire', 'Midnight', 'Deep Blue', 'Celestial', 'Oceanic'],
    'purple': ['Violet', 'Amethyst', 'Cosmic', 'Mystic', 'Neon Purple', 'Ethereal'],
    'red': ['Crimson', 'Scarlet', 'Blazing', 'Infernal', 'Ruby', 'Vibrant'],
    'green': ['Emerald', 'Jade', 'Forest', 'Verdant', 'Aurora Green', 'Toxic'],
    'amber': ['Golden', 'Amber', 'Solar', 'Gilded', 'Sunset', 'Warm'],
    'dark': ['Obsidian', 'Shadow', 'Midnight', 'Nocturnal', 'Pitch', 'Stealth'],
    'light': ['Prismatic', 'Luminous', 'Pristine', 'Frosted', 'Opalescent', 'Radiant']
}

TITLE_NOUNS = {
    'cyberpunk-anime': ['Neo-Tokyo Echo', 'Cyber Ronin', 'Hologram Drift', 'Ghost in Neon', 'Neural Samurai', 'Glitch Horizon'],
    'shonen-action': ['Sage Aura', 'Limitless Spirit', 'Battle Stance', 'Thunder Blade', 'Dragon Fury', 'Celestial Strike'],
    'lofi-chill': ['Midnight Coffee', 'Rainy Balcony', 'Pastel Reverie', 'Late Study Session', 'Window Solitude', 'Quiet Dawn'],
    'dark-fantasy': ['Shadow Blade', 'Cursed Ronin', 'Moonlit Abyss', 'Spirit of the Katana', 'Gothic Sentinel', 'Silent Requiem'],
    'iconic-portraits': ['Gaze of the Wanderer', 'Starlit Gaze', 'Chroma Portrait', 'Soulful Glance', 'Prism Horizon', 'Avatar of Light'],
    
    'supercars-hypercars': ['Apex Velocity', 'Aero Hypercar', 'Sculpted Horsepower', 'Carbon Monocoque', 'Supercar Silhouette', 'High Speed Run'],
    'jdm-tuners': ['Tokyo Midnight Run', 'Twin-Turbo Legend', 'Street Spec GT', 'Midnight Express', 'Drift King Soul', 'Shuto Highway'],
    'classics-muscle': ['V8 Roar', 'American Muscle', 'Classic Coupe', 'Chrome & Asphalt', 'Vintage Cruiser', 'Pure Horsepower'],
    'night-drift': ['Rain Drift', 'Neon Wet Asphalt', 'Reflective Speed', 'Midnight Cruising', 'After-Hours Throttle', 'City Street Runner'],
    'racing-motorsport': ['Pole Position', 'Apex Hunter', 'Track Precision', 'Formula Slipstream', 'Downforce Dominance', 'Curbside Victory'],
    
    'mountains-peaks': ['Alpine Majesty', 'Snow Peak Solitude', 'Summit Ridge', 'Highland Horizon', 'Granite Monolith', 'Cloud Crest'],
    'oceans-beaches': ['Azure Swell', 'Tidal Horizon', 'Breaking Crest', 'Coastal Serenity', 'Pacific Mist', 'Sunset Surf'],
    'forests-woodlands': ['Emerald Canopy', 'Sunbeam Sanctuary', 'Misty Pines', 'Ancient Grove', 'Silent Woodland', 'Deep Forest Moss'],
    'sunsets-skies': ['Golden Twilight', 'Dusk Gradient', 'Amber Skies', 'Crimson Horizon', 'Solitary Sunset', 'Evening Calm'],
    'aurora-night': ['Aurora Borealis', 'Starlit Silence', 'Northern Glow', 'Celestial Veil', 'Nocturnal Whispers', 'Polar Light'],
    
    'neon-cityscapes': ['Neon Megatower', 'Metropolis Hologram', 'Cyber District 9', 'Dystopian Skyline', 'Electric Rain City', 'Synth Highrise'],
    'synthwave-retrowave': ['Retrowave Sunset', 'Outrun Horizon', '80s Grid Run', 'Magenta Highway', 'Neon Gridline', 'Synthwave Odyssey'],
    'cyborgs-androids': ['Bionic Neural Core', 'Cyborg Ascendance', 'Android Mind', 'Cybernetic Armor', 'Chroma Synthesis', 'Silicon Soul'],
    'futuristic-vehicles': ['Orbital Interceptor', 'Starship Nomad', 'Atmospheric Speeder', 'Deep Space Freighter', 'Sub-Light Cruiser', 'Quantum Vessel'],
    
    'true-black-oled': ['True Black Minimal', 'Obsidian Horizon', 'OLED Void', 'Pure Black Focus', 'Stealth Silhouette', 'Monochrome Zero'],
    'neon-noir': ['Neon Noir Glow', 'Electric Shadow', 'Vibrant in the Dark', 'Nocturnal Contrast', 'Cyber Glow Noir', 'Dark Luster'],
    'dark-abstract': ['Carbon Wave', 'Smoked Obsidian', 'Dark Geometry', 'Dimensional Folds', 'Midnight Mesh', 'Eclipse Rhythm'],
    'typography-quotes': ['Words of Solitude', 'Minimal Philosophy', 'Kanji in the Mist', 'Typographic Depth', 'Bold Simplicity', 'Silent Thought'],
    
    'fluid-gradients': ['Liquid Silk Bleed', 'Molten Gradient', 'Prismatic Fluid', 'Smooth Flow', 'Chroma Ripple', 'Velvet Fusion'],
    '3d-geometrics': ['3D Floating Form', 'Isometric Math', 'Glass Sphere Array', 'Sculpted Polyhedron', 'Spatial Equilibrium', 'Cubic Horizon'],
    'iridescent-chromatic': ['Iridescent Sheen', 'Holographic Prism', 'Chrome Dispersion', 'Rainbow Luster', 'Prismatic Foil', 'Spectrum Wave'],
    'minimalist-materials': ['Frosted Glassmorphism', 'Matte Clay Minimal', 'Clean Spatial Rhythm', 'Soft Neutral Material', 'Architectural Plane', 'Pure Texture'],
    'textured-dark': ['Dark Particle Flow', 'Subtle Noise Field', 'Deep Quantum Mesh', 'Hypnotic Dark Waves', 'Cosmic Static', 'Abyssal Surface'],
    
    'comic-heroes': ['Vigilante Sentinel', 'Hero of the City', 'Titan Awakening', 'Dark Knight Patrol', 'Crimson Avenger', 'Symbiote Instinct'],
    'fantasy-rpg': ['Elden Sovereign', 'Knight of the Cursed Realm', 'Runic Shrine', 'Mythic Blade', 'Dungeon Solitude', 'Ashen Champion'],
    'action-shooters': ['Tactical Operator', 'Cyberpunk Combatant', 'Apex Champion', 'Battleground Solitude', 'Zone Drop', 'Frontline Spec'],
    'retro-pixel': ['16-Bit Nostalgia', 'Arcade Memories', 'Pixel Quest', 'Retro Hero', 'Pixelated Horizon', 'Classic Game Lore'],
    
    'nebulas-galaxies': ['Carina Nebula Dust', 'Andromeda Spiral', 'Cosmic Nursery', 'Deep Space Aurora', 'Stellar Halo', 'Galactic Core'],
    'astronauts-deepspace': ['Lone Spacewalker', 'Orbiting Earth', 'Deep Space Voyager', 'Cosmic Drifter', 'Infinite Quiet', 'Zero Gravity'],
    'planets-horizons': ['Ring of Saturn', 'Lunar Crescendo', 'Alien Horizon', 'Red Planet Dawn', 'Celestial Transit', 'Gas Giant Shadow'],
    
    'skylines-cityscapes': ['Manhattan Skyline', 'Towering Heights', 'Metropolis at Dusk', 'Urban Grid at Night', 'Concrete Canyons', 'City Beacon'],
    'rainy-streets': ['Rainy Tokyo Alley', 'Neon Puddle Halo', 'Midnight Crosswalk', 'Silent Urban Rain', 'City Street Solitude', 'Moody Boulevard'],
    'modern-geometry': ['Cantilever Balance', 'Spiral Geometry', 'Brutalist Concrete', 'Architectural Purity', 'Minimalist Glasswork', 'Structural Symmetry'],
    
    'apex-predators': ['Golden Lion Gaze', 'Tiger in the Mist', 'Panther of the Night', 'Apex Stride', 'Savanna Monarch', 'Silent Hunter'],
    'birds-flight': ['Eagle Soaring', 'Wings of the Raptor', 'Peregrine Glide', 'Plumage of Light', 'Silent Owl in Flight', 'Skyward Ascent'],
    'wolves-canines': ['Moonlight Wolf', 'Ghost Pack Leader', 'Loyal Companion', 'Wild Tundra Spirit', 'Eyes of the Timber', 'Winter Howl'],
    'marine-creatures': ['Gentle Leviathan', 'Deep Sea Manta', 'Oceanic Depth', 'Whale of the Blue', 'Bioluminescent Abyss', 'Reef Harmony']
}

# Vibe mapping
VIBES = {
    'lofi-chill': 'Cozy & Lo-Fi',
    'true-black-oled': 'Late Night Focus',
    'dark-abstract': 'Late Night Focus',
    'supercars-hypercars': 'High Energy & Adrenaline',
    'jdm-tuners': 'High Energy & Adrenaline',
    'racing-motorsport': 'High Energy & Adrenaline',
    'shonen-action': 'High Energy & Adrenaline',
    'comic-heroes': 'High Energy & Adrenaline',
    'mountains-peaks': 'Zen & Serenity',
    'oceans-beaches': 'Zen & Serenity',
    'forests-woodlands': 'Zen & Serenity',
    'sunsets-skies': 'Zen & Serenity',
    'neon-cityscapes': 'Futuristic & Cyber',
    'synthwave-retrowave': 'Futuristic & Cyber',
    'cyborgs-androids': 'Futuristic & Cyber',
    'cyberpunk-anime': 'Futuristic & Cyber',
    'fluid-gradients': 'Creative Spark & Aesthetics',
    'iridescent-chromatic': 'Creative Spark & Aesthetics',
    '3d-geometrics': 'Creative Spark & Aesthetics',
    'minimalist-materials': 'Creative Spark & Aesthetics',
    'nebulas-galaxies': 'Cosmic Wonder',
    'astronauts-deepspace': 'Cosmic Wonder',
    'planets-horizons': 'Cosmic Wonder'
}

def determine_color_family(hex_color):
    if not hex_color or hex_color == '#000000' or hex_color == '#050505':
        return 'dark'
    try:
        h = hex_color.lstrip('#')
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        brightness = (r * 299 + g * 587 + b * 114) / 1000
        if brightness < 35:
            return 'dark'
        if brightness > 220:
            return 'light'
        if r > g + 40 and r > b + 40:
            return 'red'
        if g > r + 30 and g > b + 30:
            return 'green'
        if b > r + 30 and b > g + 20:
            return 'blue'
        if r > 180 and g > 130 and b < 100:
            return 'amber'
        if r > 120 and b > 140 and g < 100:
            return 'purple'
        if g > 140 and b > 140 and r < 100:
            return 'cyan'
        return 'dark' if brightness < 128 else 'light'
    except Exception:
        return 'dark'

def is_meaningful_title(title):
    if not title:
        return False
    # If it's a 32-char hex hash or starts with digits / generic Wallpaper IMG
    if re.match(r'^[0-9a-fA-F]{20,}$', title):
        return False
    if re.match(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}', title):
        return False
    if 'Wallpaper IMG_' in title or 'IMG_' in title:
        return False
    if title.lower().startswith('wp') and title[2:].isdigit():
        return False
    # If title has spaces and real words
    words = [w for w in re.split(r'[\s_\-]+', title) if len(w) > 2 and not re.match(r'^[0-9a-fA-F]+$', w)]
    return len(words) >= 2

# Process each wallpaper
updated_wallpapers = []
subcat_counter = Counter()

for idx, wp in enumerate(wallpapers):
    cat_slug = wp.get('categorySlug', 'abstract-3d')
    subcat_options = SUBCATEGORIES.get(cat_slug, SUBCATEGORIES['abstract-3d'])
    
    # Match subcategory based on tags, filename, isAmoled
    chosen_subcat = None
    all_text = ' '.join(wp.get('tags', []) + [wp.get('originalFilename', ''), wp.get('title', '')]).lower()
    
    if wp.get('isAmoled') and cat_slug == 'dark-amoled':
        chosen_subcat = subcat_options[0] # true-black-oled
    else:
        for sub_slug, sub_name, sub_desc, sub_kw in subcat_options:
            if any(kw in all_text for kw in sub_kw):
                chosen_subcat = (sub_slug, sub_name, sub_desc, sub_kw)
                break
                
    if not chosen_subcat:
        # Pick based on hash of id for deterministic distribution
        hash_val = int(hashlib.md5(wp['id'].encode('utf-8')).hexdigest(), 16)
        chosen_subcat = subcat_options[hash_val % len(subcat_options)]
        
    sub_slug, sub_name, sub_desc, _ = chosen_subcat
    subcat_counter[sub_slug] += 1
    
    wp['subcategory'] = sub_name
    wp['subcategorySlug'] = sub_slug
    wp['vibe'] = VIBES.get(sub_slug, 'Aesthetic & Inspiring')
    
    # Make human title
    current_title = wp.get('title', '')
    if not is_meaningful_title(current_title):
        color_family = determine_color_family(wp.get('dominantColor', ''))
        adj_list = TITLE_ADJECTIVES.get(color_family, TITLE_ADJECTIVES['blue'])
        nouns_list = TITLE_NOUNS.get(sub_slug, ['Aesthetic Horizon', 'Visual Wonder', 'Minimal Dimension'])
        
        h_idx = int(hashlib.md5((wp['id'] + 'adj').encode('utf-8')).hexdigest(), 16)
        n_idx = int(hashlib.md5((wp['id'] + 'noun').encode('utf-8')).hexdigest(), 16)
        
        adj = adj_list[h_idx % len(adj_list)]
        noun = nouns_list[n_idx % len(nouns_list)]
        wp['title'] = f"{adj} {noun}"
        
    updated_wallpapers.append(wp)

print(f"Enriched {len(updated_wallpapers)} wallpapers with subcategories and human titles.")
print("\nSubcategory counts:")
for k, v in subcat_counter.most_common(20):
    print(f"  {k}: {v}")

# Update categories array with subcategories metadata
enriched_categories = []
for cat in data['categories']:
    c_slug = cat['slug']
    cat_subs = []
    if c_slug in SUBCATEGORIES:
        for s_slug, s_name, s_desc, _ in SUBCATEGORIES[c_slug]:
            count = subcat_counter[s_slug]
            cat_subs.append({
                'name': s_name,
                'slug': s_slug,
                'description': s_desc,
                'count': count
            })
    cat['subcategories'] = cat_subs
    enriched_categories.append(cat)

data['categories'] = enriched_categories
data['wallpapers'] = updated_wallpapers

with open('data/wallpapers.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\nSuccessfully updated data/wallpapers.json with human metadata and subcategories!")

# 🌌 Wallpaper Vault

> An ultra-high-definition curated wallpaper gallery of **4,891 wallpapers**, systematically categorized into **Desktop**, **Mobile**, and **10 visual themes**. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

---

## ⚡ Overview & Features

- **📱 Mobile & 🖥️ Desktop Organization**:
  - **Desktop (160+ Landscape)**: 16:9 and ultrawide wallpapers for PC monitors, laptops, and dual-screen workstations.
  - **Mobile (3,900+ Portrait)**: Vertical 9:16 wallpapers optimized for iPhone, Android, and AMOLED lock screens.
  - **Square & Avatars (800+)**: 1:1 wallpapers for aesthetic widgets, square crops, and avatars.
- **📁 10 Aesthetic Categories**:
  1. *Anime & Manga* (1,072 wallpapers)
  2. *Abstract & 3D Art* (2,052 wallpapers)
  3. *Dark & AMOLED* (753 wallpapers)
  4. *Nature & Landscapes* (315 wallpapers)
  5. *Cars & Automotive* (287 wallpapers)
  6. *Gaming & Superheroes* (141 wallpapers)
  7. *Animals & Wildlife* (94 wallpapers)
  8. *Urban & Architecture* (79 wallpapers)
  9. *Cyberpunk & Sci-Fi* (71 wallpapers)
  10. *Space & Cosmos* (27 wallpapers)
- **🔍 Instant Live Search & Filters**:
  - Real-time debounced keyword search across titles, categories, and tags.
  - Instant filters for **4K UHD** and **AMOLED pure black**.
  - Sorting by Popularity, Highest Resolution, File Size, and Name.
- **🖼️ Interactive Lightbox Preview Modal**:
  - Fullscreen high-resolution view with zoom controls.
  - Metadata HUD: Width × Height, Aspect Ratio, File Size, Format, and Dominant Colors.
  - Single-click direct original download.
  - Keyboard navigation (Esc to close, Left/Right arrow keys to navigate).
- **❤️ Favorites & Bookmarks**:
  - LocalStorage-backed bookmarking system with live badge counter.
- **📂 Directory Tree Explorer**:
  - Interactive file manager view mirroring the filesystem folder structure.

---

## 🗂️ Filesystem Directory Structure

The collection is categorized on disk using NTFS hardlinks (zero duplicated disk space):

```
D:\My\wallpaper\categorized\
├── Desktop\
│   ├── Abstract & 3D\
│   ├── Anime & Manga\
│   ├── Cars & Automotive\
│   ├── Cyberpunk & Sci-Fi\
│   ├── Dark & AMOLED\
│   ├── Gaming & Superheroes\
│   ├── Nature & Landscapes\
│   └── Urban & Architecture\
├── Mobile\
│   ├── Abstract & 3D\
│   ├── Anime & Manga\
│   ├── Animals & Wildlife\
│   ├── Cars & Automotive\
│   ├── Cyberpunk & Sci-Fi\
│   ├── Dark & AMOLED\
│   ├── Gaming & Superheroes\
│   ├── Nature & Landscapes\
│   ├── Space & Cosmos\
│   └── Urban & Architecture\
└── Square & Avatars\
    ├── Abstract & 3D\
    ├── Anime & Manga\
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or Node 20+ / 24+
- Python 3.10+ (for classification scripts)

### Installation

```bash
# Clone the repository
git clone https://github.com/prateekraiger/wallpaper-vault.git
cd wallpaper-vault

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Static Site Generation)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism & AMOLED styling
- **Icons**: [Lucide React](https://lucide.dev/)
- **Vision Model**: MobileNetV3 (TorchVision) for zero-shot image classification
- **Image Processing**: Pillow (PIL) for dominant color extraction, luminance calculation, and WebP thumbnail generation

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js development server at `localhost:3000` |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Runs the production build |
| `python scripts/categorize.py` | Runs AI classification and generates categorized hardlinks |
| `python scripts/organize_by_device.py` | Organizes wallpapers into Desktop, Mobile, and Square folders |
| `python scripts/prepare_showcase.py` | Generates WebP thumbnails and web showcase assets |

---

## 📄 License

MIT License. Free for personal and commercial exploration.

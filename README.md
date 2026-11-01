# EverAfter — Luxury Event & Wedding Digital Guestbook & Photobooth Studio

A modern, high-aesthetic Event & Wedding Digital Guestbook and Photobooth Web Application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase Realtime**.

Designed specifically for celebration aesthetics (champagne gold, warm neutrals, soft rose, and glassmorphism), mobile-first responsiveness (optimized for iOS & Android), and live venue projection on projectors/LED walls. Fully deployable to **GitHub Pages** (or Cloudflare Pages/Vercel) with **zero server costs**.

---

## 🌟 Highlights & Key Features

### 1. 📱 Celebration Front Cover & Guestbook (`/`)
* **Cinematic Backdrop**: Full-bleed wedding venue backdrop photo with subtle contrast vignette, circular couple portrait with champagne gold foil styling, event date, venue location, and social media hashtag.
* **Mobile-First UX**: Specifically prioritized and tested for iOS Safari and Android Chrome, followed by Mac/Windows desktop.
* **Bilingual Switch**: Instant toggle between **English** and **Bahasa Melayu** (customizable in [`src/lib/i18n.tsx`](file:///src/lib/i18n.tsx)).
* **Photo & Selfie Capture with Filters & Frames**:
  * Smartphone camera capture or photo album upload with automatic client-side compression.
  * **4 Real-Time Filters**: Original Natural, Champagne Warm, Classic Noir (B&W), and Blush Romance.
  * **Aesthetic Picture Frames**: Borderless, Classic Polaroid (with handwritten calligraphy), Golden Elegance, Cute Hearts, and Blush Ribbon.
* **Voice Note Recorder**: Browser-native voice recorder with live duration timer, waveform animations, and playback preview.
* **Interactive Signature Pad**: Touch/stylus signature canvas to sign personal messages.
* **Celebration Confetti**: Multi-stage celebration burst on submission (`canvas-confetti`) with an instant "Thank You" screen.

---

### 2. 📸 Photobooth Studio (`/photobooth`)
* **Multi-Shot Photobooth Strips**: Interactive photobooth studio allowing guests to snap a sequence of photos with live countdown timers.
* **Strip Personalization**: Choose background themes, custom stamps, filter styling, and event metadata tags.
* **Instant Device Download**: Fast, high-resolution canvas export downloaded directly to the guest's mobile camera roll or PC.
* **Live Wall Submission**: Guests can optionally submit their photobooth strip directly to the event's live cloud wall.

---

### 3. 📺 Live Projector & Wall Mode (`/wall`)
* **Built for Big Screens**: Designed for venue projectors, LED walls, smart TVs, and monitors.
* **Synchronized Backdrop**: Matches the home page backdrop with auto-contrast adjustment for maximum readability.
* **Auto-Cycling Slideshow**: 7-second spotlight carousel with smooth progress animations and inline audio player for guest voice notes.
* **Grid Modes**: Switch between fullscreen Spotlight mode and a **2×N Mobile Grid** / Desktop Masonry Collage.
* **Real-Time Cloud Sync**: Instantly displays newly approved toasts and photos via Supabase Realtime without requiring page reloads.
* **Scan-to-Sign QR Modal**: High-contrast QR code overlay allowing guests to scan and sign from their venue seats.

---

### 4. 🛡️ Host Moderation Dashboard (`/admin`)
* **PIN Protection**: Fast numeric keypad login (`EVENT_CONFIG.adminPin`).
* **Live Metric Counters**: Total Wishes, Approved on Screen, Hidden/Flagged, Photos Attached, Voice Notes.
* **Photo Upload Limit Tracker**: Real-time counter (e.g. `142 / 500`) tracking uploads across Gallery, Selfies, and Photobooth strips.
* **1-Click Moderation**: Approve or Hide messages in real time (powered by Supabase RLS policies).
* **Data Backups**: One-click **CSV Export** for the couple and a direct shortcut button to the event's **Google Drive** folder.

---

### 5. 🛑 Configurable Photo Upload Limit (Default: 500)
* Protects database and drive storage limits with a global cap set in [`src/config/eventConfig.ts`](file:///src/config/eventConfig.ts).
* Encompasses all photo sources: Mobile Gallery Uploads, Camera Selfies, and Photobooth Strips.
* **Friendly Fallback**: When the photo limit is reached, guest wishes (text notes & audio recordings) **remain open**, and guests can still snap and download photobooth strips locally.

---

### 6. ☁️ Architecture & Zero Hosting Costs
* **Static Export (`output: 'export'`)**: Built as a pure static HTML/JS/CSS application for instantaneous CDN delivery.
* **GitHub Pages Ready**: Preconfigured GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys on push to `main`.
* **Multi-Tenant Supabase**: Use **one single Supabase project** across all customer events. Each event is isolated via a unique `eventId` without needing new database projects.
* **Google Drive Integration**: Guest photos route directly to the couple's private Google Drive folder via Google Apps Script ([`google-drive-apps-script.js`](file:///google-drive-apps-script.js)).

---

## 🛠️ Quick Customer Onboarding Guide

All customer-specific customizations are centralized into **one single configuration file**: [`src/config/eventConfig.ts`](file:///src/config/eventConfig.ts).

```typescript
export const EVENT_CONFIG = {
  // Couple Names
  title: 'Atif & Isma',

  // Event Type
  eventType: {
    en: 'Engagement Celebration',
    ms: 'Majlis Pertunangan',
  },

  // Event Date
  date: {
    en: '26 December 2026',
    ms: '26 Disember 2026',
    numeric: '26.12.2026',
  },

  // Venue & Hashtag
  venue: 'OneTwoKL',
  hashtag: '#AtifFoundIsma',

  // Cover Photos (/public/assets/img/)
  images: {
    avatar: '/assets/img/customer-avatar.jpg',
    background: '/assets/img/customer-venue.jpg',
  },

  // Supabase Isolation (Same project URL/key, unique eventId per customer)
  supabase: {
    eventId: 'atif-isma',
  },

  // Google Drive Integration
  googleDrive: {
    scriptUrl: 'https://script.google.com/macros/s/.../exec',
    folderUrl: 'https://drive.google.com/drive/folders/...',
  },

  // Host Moderation PIN
  adminPin: '1234',

  // Photo Upload Limit
  photoUploadLimit: 500,
};
```

> 📖 **Full Step-by-Step Manual**: See [`CUSTOMER_SETUP_GUIDE.md`](file:///CUSTOMER_SETUP_GUIDE.md) for detailed instructions on preparing new events, Google Drive scripts, Supabase setup, and deployment.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
* **Home Page**: `http://localhost:3000/`
* **Photobooth Studio**: `http://localhost:3000/photobooth`
* **Live Wall**: `http://localhost:3000/wall`
* **Admin Dashboard**: `http://localhost:3000/admin` (Default PIN: `1234`)

### 3. Production Static Build
```bash
npm run build
```
Generates the fully optimized static build inside the `/out` directory.

---

## 🚀 Deployment to GitHub Pages

1. In your GitHub repository, navigate to **Settings ➔ Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push changes to the `main` branch:
   ```bash
   git add .
   git commit -m "chore: setup event config"
   git push origin main
   ```
4. GitHub Actions will automatically compile and publish the site within 60 seconds.

---

## 📂 Project Structure

```
├── .github/workflows/
│   └── deploy.yml                # Automated GitHub Pages CI/CD workflow
├── google-drive-apps-script.js   # Google Apps Script code for Drive uploads
├── CUSTOMER_SETUP_GUIDE.md       # Complete onboarding SOP for new clients
├── public/
│   └── assets/img/               # Couple avatar & venue background assets
├── src/
│   ├── app/
│   │   ├── admin/page.tsx        # Host moderation dashboard & metrics
│   │   ├── photobooth/page.tsx   # Photobooth Studio page
│   │   ├── wall/page.tsx         # Live projector wall & slideshow
│   │   ├── globals.css           # Luxury styles, vignette & typography
│   │   ├── layout.tsx            # Celebration layout & header navigation
│   │   └── page.tsx              # Main guestbook entry form & hero cover
│   ├── components/
│   │   ├── AudioPlayer.tsx       # Inline voice note audio player
│   │   ├── PhotoFilterSelector.tsx # 4-set photo filter picker
│   │   ├── PhotoFrameSelector.tsx  # Polaroid, gold & cute frames
│   │   ├── Photobooth/           # Photobooth canvas, themes & strips
│   │   ├── SignatureCanvas.tsx   # Digital handwriting signature canvas
│   │   └── VoiceRecorder.tsx     # Voice recording with live audio timer
│   ├── config/
│   │   └── eventConfig.ts        # ⭐ Master customer configuration file
│   └── lib/
│       ├── googleDrive.ts        # Google Drive upload client
│       ├── i18n.tsx              # Bilingual English / Malay translation context
│       ├── photoboothCanvas.ts   # Strip rendering and compositing engine
│       └── supabase.ts           # Supabase client with eventId filtering & local fallback
├── next.config.mjs               # Static export configuration
├── tailwind.config.js            # Custom champagne, gold & luxury palettes
└── tsconfig.json                 # TypeScript configuration
```

---

## 📄 License
Created with ❤️ for weddings and celebrations.

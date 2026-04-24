# MR P Auto Tech Ltd — Website

A full production-grade React website for MR P Auto Tech Ltd, Owerri, Imo State.

---

## Getting Started

### Requirements
- Node.js v18+
- npm v9+

### Install & Run (Development)
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```
The `dist/` folder contains all files to upload to your hosting provider.

---

##  Admin Dashboard

Visit: `yourwebsite.com/admin`

**Default Login Password:** `mrpauto2025`

> ⚠️ Change your password immediately after first login via Admin → Settings → Admin Password.

### What you can manage from the dashboard:
| Feature | Location |
|---|---|
| View & manage bookings | Admin → Bookings |
| Upload gallery photos | Admin → Gallery |
| Add / edit customer reviews | Admin → Testimonials |
| Edit service cards | Admin → Services |
| Update business info, stats, socials | Admin → Settings |
| Change admin password | Admin → Settings |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer, WhatsAppFloat
│   └── ui/            # RevealOnScroll, SectionHeader, Toast
├── context/
│   └── SiteContext.jsx  # Global state (settings, bookings, gallery…)
├── data/
│   └── defaults.js    # All default content
├── hooks/
│   ├── useCounter.js  # Animated number counters
│   ├── useInView.js   # IntersectionObserver
│   └── useToast.js    # Toast notifications
├── pages/
│   ├── Home.jsx       # Public home page
│   └── admin/         # All admin pages
├── sections/          # Hero, Services, About, Gallery, Booking…
├── styles/
│   └── index.css      # All global styles
└── utils/
    └── storage.js     # localStorage helpers
```

---

## 🌐 Deploying

### Option A — Netlify (Recommended, Free)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → drag & drop the `dist/` folder
3. Your site is live instantly

### Option B — Vercel
```bash
npm install -g vercel
vercel
```

### Option C — Traditional hosting (Whogohost, etc.)
Upload everything inside the `dist/` folder to your `public_html/` directory.

> **Note:** For React Router to work on traditional hosting, add a `.htaccess` file with:
> ```
> RewriteEngine On
> RewriteBase /
> RewriteRule ^index\.html$ - [L]
> RewriteCond %{REQUEST_FILENAME} !-f
> RewriteCond %{REQUEST_FILENAME} !-d
> RewriteRule . /index.html [L]
> ```

---

##  Adding Real Photos (Gallery)
1. Upload photos to [imgbb.com](https://imgbb.com) (free) or [Cloudinary](https://cloudinary.com)
2. Copy the direct image URL
3. Go to Admin → Gallery → Add Photo → paste URL

---

## ✅ Features Fixed 
- ✅ Animated counters that actually work (not stuck at 0)
- ✅ Real gallery slots — add your own photos
- ✅ Fully working booking form with localStorage persistence
- ✅ WhatsApp pre-fill on booking submission
- ✅ All navigation links working
- ✅ Real contact form
- ✅ Admin dashboard for managing everything
- ✅ Mobile responsive design
- ✅ SEO meta tags

---

Built with React + Vite. No backend required.

# TradeRoom PRO — CREDO Trading Academy

Small-Cap Day Trading Academy platform. Firebase-powered web app with course delivery, progress tracking, and quiz gating.

## Repository Structure

```
/
├── courses.html        — Module grid, progress banner, quiz modal
├── lesson.html         — Lesson viewer (all 36 lessons across 6 modules)
├── README.md           — This file
└── docs/
    ├── CREDO_Module1_How_The_Stock_Market_Works.docx
    ├── CREDO_Module1_How_The_Stock_Market_Works.pdf   ← Upload to Firebase Storage
    ├── CREDO_Module2_Reading_Charts_and_Price_Action.docx
    ├── CREDO_Project_Instructions.docx
    └── CREDO_TRADING_LLC_Legal_Package.docx
```

## Platform Files

### courses.html
- Displays all 6 Foundation Course module cards
- Tracks progress per module (lesson dots, progress bar, percentage)
- Gating system: each module locked until previous module quiz passed at 80%+
- Quiz modal with 10 questions per module (M1 and M2 fully built)
- Firebase Realtime Database for progress persistence

### lesson.html
- Single template for all 36 lessons across 6 modules
- Left nav panel: lesson list with completion dots
- Full lesson content: colored callout boxes, definition tables, comparison tables
- Mark Complete & Continue button saves progress to Firebase
- Download PDF button (wire up Firebase Storage URLs — see setup below)
- Modules 1 and 2 fully content-complete. Modules 3-6 show "coming soon" placeholders.

## Firebase Setup

**Project:** traderoom-42339

Firebase config is already embedded in both HTML files. No additional setup needed for auth and database.

### PDF Download Links (action required)

After uploading PDFs to Firebase Storage:

1. Go to Firebase Console → Storage → Upload PDF files from `/docs/`
2. Click each uploaded file → Copy download URL
3. In `lesson.html`, find the `MODULE_DOCS` object and paste the URLs:

```javascript
var MODULE_DOCS = {
  1: 'https://firebasestorage.googleapis.com/YOUR_MODULE1_URL',
  2: 'https://firebasestorage.googleapis.com/YOUR_MODULE2_URL',
  3: '', 4: '', 5: '', 6: ''
};
```

## Module Build Status

| Module | Title | Lessons | Quiz | PDF |
|--------|-------|---------|------|-----|
| 1 | How the Stock Market Works | ✅ Complete | ✅ 10 questions | ✅ Ready |
| 2 | Reading Charts and Price Action | ✅ Complete | ✅ 10 questions | ⬜ Generate from docx |
| 3 | Small-Cap Mechanics Deep Dive | ⬜ Coming soon | ⬜ | ⬜ |
| 4 | Platform Setup and Tool Training | ⬜ Coming soon | ⬜ | ⬜ |
| 5 | Risk Management Fundamentals | ⬜ Coming soon | ⬜ | ⬜ |
| 6 | Trading Psychology and Daily Routine | ⬜ Coming soon | ⬜ | ⬜ |

## Deployment

These are static HTML files. Host on any static file server — GitHub Pages, Firebase Hosting, Netlify, or Vercel.

### GitHub Pages (simplest)
1. Push this repo to GitHub
2. Go to Settings → Pages → Source: main branch / root
3. Your site will be live at `https://yourusername.github.io/repo-name/courses.html`

### Firebase Hosting (recommended — same project as your database)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Legal

All content © 2025 CREDO TRADING LLC. Confidential — for enrolled students only.  
Legal package requires Florida attorney review before presenting to any student.

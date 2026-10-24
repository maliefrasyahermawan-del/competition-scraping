# Competition Poster OCR Dashboard

> A browser-based dashboard that extracts text from competition posters and saves the result as searchable local records.

## What this project does

Competition Poster OCR Dashboard streamlines collecting information from poster images. A user uploads or drops a poster, the application reads its text using OCR, lets the user correct the extracted text, and saves the poster with its result as a competition record.

Despite the repository name, this version does **not** crawl or scrape external websites. It processes images selected by the user directly in the browser.

## Core functions

- Upload or drag-and-drop poster images.
- Extract text in the browser using Tesseract.js OCR.
- Show progress while the OCR engine loads and recognizes text.
- Let users edit OCR output before saving.
- Store poster image, raw text, title, and creation time in browser `localStorage`.
- Search, review, and delete saved competition records.

## Architecture

```text
Poster image
  │
  ▼
React Dashboard
  ├── Image reader and preview
  ├── Tesseract.js OCR worker
  └── Editable extracted text
  │
  ▼
useCompetitions hook
  ├── Creates the competition record
  └── Persists it in browser localStorage
  │
  ▼
Competition Info view
  └── Search, inspect, and delete saved records
```

## Technology

- React 18
- Vite 5
- Tailwind CSS
- Tesseract.js
- Browser `localStorage` (no server or database)

## Run locally

```bash
npm install
npm run dev
```

Vite will display the local address in the terminal, usually `http://localhost:5173`.

## Privacy and limitations

All poster processing and storage happen in the current browser profile. Nothing is uploaded by this application to a backend, but clearing browser site data also removes saved records. OCR accuracy depends on image quality, layout, and language; review the extracted text before relying on it.

## Repository layout

```text
src/
├── App.jsx                    # Page navigation and application state wiring
├── components/
│   ├── Dashboard.jsx           # Upload, OCR, edit, and save flow
│   ├── CompetitionInfo.jsx     # Search and record management
│   └── Sidebar.jsx             # Navigation
└── hooks/useCompetitions.js    # localStorage persistence
```

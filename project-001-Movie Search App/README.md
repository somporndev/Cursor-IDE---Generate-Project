# Movie Search App

A dark-themed movie search web app inspired by streaming services — built with **HTML5, CSS3, Vanilla JavaScript** and the [OMDb API](https://www.omdbapi.com/).

## Features

- **Navigation** — DASHBOARD / MOVIES / SERIES / KIDS tabs  
- **Hero / Featured** — Full-bleed poster background with title, match badge, PLAY and Add to list buttons  
- **My List** — Horizontal poster carousel (stored in localStorage; preloaded with 8 popular movies on first visit)  
- **Search** — Click the search icon → full-screen overlay, debounced live search (300 ms)  
- **Detail modal** — Click any poster card → fetches full details (plot, director, actors, IMDb rating, etc.)  
- **Loading & Error states** — Spinner while fetching, error message on failure  
- **Responsive** — Adapts to mobile/tablet/desktop  

## Quick Start

1. Open a terminal in the `project-001-Movie Search App` folder  
2. Start any static server:
   ```bash
   python -m http.server 8080
   ```
3. Open **http://localhost:8080** in your browser  

> Or use the **Live Server** extension in VS Code / Cursor.

## API Key

The app uses an OMDb API key configured in `scripts/api.js`.  
To use your own key:

1. Register at https://www.omdbapi.com/apikey.aspx (free tier: 1 000 requests/day)  
2. Replace the `KEY` value in `scripts/api.js`

## File Structure

```
index.html          → Main page (nav, hero, search overlay, My List, modal)
styles/style.css    → Dark streaming theme, responsive layout
scripts/api.js      → OMDb API client (search + getById)
scripts/ui.js       → DOM helpers (cards, hero, modal, spinners)
scripts/app.js      → App entry, events, My List, search logic
project.yaml        → Project plan & config
ui-spec.md          → UI specification (from ref.jpg)
README.md           → This file
```

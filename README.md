# Trickcal Board Tracker

A small static web app for tracking Trickcal character ownership and board upgrade progress.

Open the app here:

**https://ralph-vx.github.io/trickcal-board-tracker/**

## Features

- Track owned and unowned characters.
- Mark upgraded special cells for Board 1, Board 2, and Board 3.
- Filter by character name, board, cell type, ownership, and upgrade status.
- Sort the tracker table by displayed name, ownership, or board upgrade count.
- Switch between Japanese, English, and Traditional Chinese character names.
- View board and cell statistics, including spent and remaining special crayons.
- Export and import progress as JSON.
- Uses ASCII character IDs in exported JSON for easier sharing and editing.

## Usage

Use the GitHub Pages link above, or open `index.html` directly in a browser after cloning the repository.

Progress is saved in your browser's local storage. Use **Export JSON** to back up your tracker state, and **Import JSON** to restore it later.

## Adding New Characters

Character data lives in:

- `data/characters.js`
- `data/board-data.js`

To add a new character, add one entry to `data/characters.js`:

```js
{
  id: "example-character",
  name: "日本語名",
  race: "種族",
  type: 1,
  names: {
    en: "Example Character",
    "zh-Hant": "繁體中文名"
  }
}
```

The `id` must be unique, lowercase, and ASCII-only because it is used in saved and exported tracker JSON.

## Project Structure

- `index.html` - app markup and script loading order
- `styles.css` - visual styles
- `app.js` - tracker behavior, rendering, filtering, sorting, import/export
- `data/i18n.js` - UI translations
- `data/board-data.js` - board, cell, and type data
- `data/characters.js` - character roster and localized character names

## Notes

This app is client-only. No account or server is required, and tracker progress stays in your browser unless you export it.

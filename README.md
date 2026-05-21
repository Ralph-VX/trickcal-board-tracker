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
- Optionally save and load progress from Google Drive app data storage.
- Uses ASCII character IDs in exported JSON for easier sharing and editing.

## Usage

Use the GitHub Pages link above, or open `index.html` directly in a browser after cloning the repository.

Progress is saved in your browser's local storage. Use **Export JSON** to back up your tracker state, and **Import JSON** to restore it later.

## Google Drive Sync

Google Drive sync is optional. It stores one JSON file in the signed-in user's hidden Google Drive `appDataFolder` using the Drive API scope:

```txt
https://www.googleapis.com/auth/drive.appdata
```

To enable it for a deployment:

1. Create a Google Cloud project.
2. Enable the Google Drive API.
3. Configure the OAuth consent screen.
4. Create an OAuth client ID for a web application.
5. Add your app origin to Authorized JavaScript origins, for example `https://ralph-vx.github.io`.
6. Put the client ID in `data/google-config.js`:

```js
TrickalBoard.GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
```

The client ID is public by design. Use only the `drive.appdata` scope so the app cannot access the user's normal Drive files. If no client ID is configured, the app keeps working with local storage and manual JSON import/export.

Google OAuth requires the page origin to match the authorized JavaScript origins on the OAuth client. For local Drive sync testing, serve the app over `http://localhost` instead of opening `index.html` as a `file://` URL.

For the Google OAuth app configuration, use this privacy policy URL for the public GitHub Pages deployment:

**https://ralph-vx.github.io/trickcal-board-tracker/privacy.html**

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

## 注意

AI運用の練習もかねているため、このセクションを除いてすべてAI製です。
ご自由にご利用ください。
Google CloudのClient IDこのリポジトリからのアクセスのみ許可しているため、
別でホスティングする場合はご用意ください。
キャラ追加は遊んでいる間は適時追加していきます。

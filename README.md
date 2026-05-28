# Intimacy When the Other Side Is a Variable

Static site for the video essay landing page and interactive desktop.

## Project Structure

- `index.html` - public homepage.
- `style.css` - the single stylesheet for the live page.
- `script.js` - the single JavaScript bundle for the live page.
- `assets/` - public media, fonts, and social images used by the homepage.
- `content/` - live data and media loaded by the interactive page.
- `scripts/` - build and generation scripts.
- `netlify/functions/` - serverless API functions.
- `archive/` - old/source files kept for reference but not loaded by the live site.

## Development

Generate static content data:

```sh
node scripts/build-static-data.js
```

Serve the site from the repository root:

```sh
python3 -m http.server 4173
```

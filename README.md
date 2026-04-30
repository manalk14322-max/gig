# UniHire

UniHire is a GitHub Pages-ready React marketplace for student freelance services.

## Project Structure

- `gig-system/client` - React, Vite, and Tailwind frontend
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Local Preview

```bash
cd gig-system/client
npm install
npm run dev
```

Open the local URL shown by Vite.

## Deploy

Push changes to the `main` branch. GitHub Actions builds the client and publishes it to:

`https://manalk14322-max.github.io/gig/`

The frontend includes demo fallback data so the marketplace still displays properly on GitHub Pages when no backend API is connected.

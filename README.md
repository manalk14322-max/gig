# UniHire

UniHire is a GitHub Pages-ready React marketplace for student freelance services.

## Project Structure

- `gig-system/client` - React, Vite, and Tailwind frontend
- `gig-system/server` - Express API starter for real accounts, gigs, orders, verification, admin actions, uploads, and payments stubs
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Local Preview

```bash
cd gig-system/client
npm install
npm run dev
```

Open the local URL shown by Vite.

## Backend Preview

```bash
cd gig-system/server
copy .env.example .env
npm install
npm run dev
```

Default API URL:

`http://localhost:5050/api`

Default admin account from `.env.example`:

- Email: `admin@unihire.pk`
- Password: `admin12345`

For the frontend to use a deployed backend, set this client environment variable before building:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

## Deploy

Push changes to the `main` branch. GitHub Actions builds the client and publishes it to:

`https://manalk14322-max.github.io/gig/`

The frontend includes demo fallback data so the marketplace still displays properly on GitHub Pages when no backend API is connected. GitHub Pages only hosts the frontend; the backend must be deployed separately on a Node host such as Render, Railway, or VPS.

## Render Backend Deploy

This repo includes `render.yaml` for a Render Blueprint. In Render:

1. Create a new Blueprint.
2. Select the GitHub repo `manalk14322-max/gig`.
3. Render will detect `render.yaml`.
4. Set `ADMIN_PASSWORD` to your private admin password.
5. Deploy the service.
6. After deploy, open `/api/health` on the Render URL.

After Render gives you a URL like:

`https://unihire-api.onrender.com`

set the GitHub Pages build variable:

`VITE_API_URL=https://unihire-api.onrender.com/api`

# UniHire

## GitHub Pages
Client will publish to:
`https://manalk14322-max.github.io/gig/`

Full-stack gig creation system inspired by Fiverr, built with React + Tailwind on the frontend and Node.js + Express + MongoDB on the backend.

## Whats included
- Gig Creation flow with:
- Title, description, category, tags
- Custom pricing builder (dynamic services)
- Delivery time and Quick Task mode (1-2 hours)
- Images + required video intro
- AI suggestions for price, tags, and description
- TikTok-style vertical video preview
- Smart search and Best Match recommendations
- Gig listings, gig detail pages, and reviews
- Featured gigs and freelancer profile/portfolio

## Run locally
1. Backend
```bash
cd gig-system/server
npm install
cp .env.example .env
npm run dev
```

2. Frontend
```bash
cd gig-system/client
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment
Backend expects a MongoDB connection string:
```
MONGO_URI=mongodb://127.0.0.1:27017/gigs
PORT=5050
```

# PakGigs

PakGigs is a clean freelance marketplace starter for Pakistani users.

## Run

```bash
npm start
```

Then open `http://localhost:3000`.

## Includes

- Responsive landing page
- Separate `How it works` page at `how.html`
- Mobile-style dashboard at `mobile.html`
- Seller signup at `seller-signup.html`
- Seller onboarding at `seller-onboarding.html`
- Step-by-step gig builder at `gig-builder.html`
- Static file server only
- Marketplace-style project, gig, inbox, wallet, and studio demos
- PKR pricing and local payment options
- City and category filters
- Urdu and English toggle
- LocalStorage persistence with local demo data

## Google Sign-In

To enable real Google OAuth on the seller signup flow, set a web client ID before starting the app:

```powershell
$env:GOOGLE_CLIENT_ID="your-google-web-client-id"
npm start
```

Then add `http://localhost:3000` to the Authorized JavaScript origins in your Google Cloud OAuth client.

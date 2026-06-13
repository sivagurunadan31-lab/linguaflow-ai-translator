# LinguaFlow AI Translator

LinguaFlow AI Translator is a full-stack SaaS-style language translation platform built with React, Vite, Tailwind CSS, Express, MongoDB Atlas, Mongoose, JWT authentication, and Microsoft Translator.

Created by sivagurunadan.

## Folder Structure

```text
linguaflow-ai-translator/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    .env.example
    package.json
    render.yaml
  frontend/
    src/
      api/
      components/
      context/
      data/
      layouts/
      pages/
      styles.css
      App.jsx
      main.jsx
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vercel.json
    vite.config.js
  .env.example
  DEPLOYMENT.md
  INSTALLATION.md
  package.json
  README.md
```

## Features

- Premium responsive landing page with glassmorphism, gradients, and Framer Motion.
- JWT register, login, logout, profile, protected routes, and admin-only routes.
- Translation workspace with auto-resizing input, language detection, language swap, character and word counts.
- Translation output with copy, text-to-speech, TXT download, PDF download, share, and side-by-side comparison.
- Translation history with search, language filtering, single delete, clear all, and pagination.
- Favorites workflow with dedicated favorites page.
- User dashboard with totals, favorites, most used languages, weekly activity, and recent translations.
- Admin dashboard with platform metrics, recent users, and recent translations.
- Dark and light mode with persistence, toast notifications, skeleton loading, and mobile-first layouts.
- Backend security with Helmet, rate limiting, CORS, Mongo sanitization, validation, bcrypt, and JWT protection.

## Quick Start

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev
```

Fill in the values in `backend/.env` before translating:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/linguaflow
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
MICROSOFT_TRANSLATOR_KEY=your-azure-translator-key
MICROSOFT_TRANSLATOR_REGION=your-azure-region
MICROSOFT_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

The app starts at `http://localhost:5173`.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Authenticate and receive JWT |
| GET | `/api/auth/profile` | Return current user |
| POST | `/api/translate` | Translate text and save history |
| GET | `/api/history` | Paginated history with search/filter |
| DELETE | `/api/history/:id` | Delete one translation |
| DELETE | `/api/history` | Clear translation history |
| GET | `/api/favorites` | List favorites |
| POST | `/api/favorites/:id` | Toggle favorite |
| GET | `/api/admin/stats` | Admin analytics |
| GET | `/api/admin/users` | Admin user list |

## Architecture

The backend separates controllers, routes, middleware, models, utilities, and services. Microsoft Translator is isolated in `backend/src/services/translationProvider.js`, so another provider can replace it without changing controller logic.

The frontend separates API access, context providers, layouts, reusable components, data constants, and pages. Auth and theme state persist in local storage.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render, Vercel, and MongoDB Atlas setup.

## Ownership

See [OWNERSHIP.md](OWNERSHIP.md) for steps to show public ownership through GitHub, domain verification, Google Search Console, and portfolio links.

## Installation

See [INSTALLATION.md](INSTALLATION.md) for detailed local setup steps.

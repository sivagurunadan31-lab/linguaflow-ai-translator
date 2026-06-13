# LinguaFlow AI Translator Installation Guide

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- MongoDB Atlas cluster
- Microsoft Azure Translator resource

## Local Setup

1. Install dependencies from the project root:

```bash
npm install
```

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Fill in `backend/.env`:

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

4. Create frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

5. Run both apps:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

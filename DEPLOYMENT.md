# LinguaFlow AI Translator Deployment Guide

## MongoDB Atlas

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with read/write permissions.
3. Add your Render backend outbound IPs, or temporarily allow `0.0.0.0/0` during initial setup.
4. Copy the connection string and use it as `MONGO_URI`.

## Backend on Render

1. Push the repository to GitHub.
2. Create a new Render Web Service.
3. Set the root directory to `backend`.
4. Use:

```bash
npm install
```

as the build command and:

```bash
npm start
```

as the start command.

5. Add the environment variables from `backend/.env.example`.
6. Set `CLIENT_URL` to your Vercel frontend URL.
7. Confirm health check at `/api/health`.

`backend/render.yaml` is included for blueprint-based Render deployment.

## Frontend on Vercel

1. Import the same GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Add:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

4. Deploy. `frontend/vercel.json` includes SPA routing rewrites.

## Production Checklist

- Use a long random `JWT_SECRET`.
- Keep Microsoft Translator keys in hosting environment variables only.
- Configure MongoDB Atlas network access intentionally.
- Update Render `CLIENT_URL` after the Vercel deployment is live.
- Verify sign-up, login, translation, history, favorites, and admin access.

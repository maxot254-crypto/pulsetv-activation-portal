# PulseTV Activation Portal - Deployment Guide

## Quick Deploy Options

### 🚂 Railway (Recommended)
**Easiest & fastest (2 minutes)**

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Railway auto-detects Node.js and deploys
5. Get your live URL instantly

**Environment Variables on Railway:**
```
DATABASE_URL=file:./data/dev.db
PORT=3000
NODE_ENV=production
```

---

### 🎨 Render
**Free tier available**

1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repo
4. **Build Command:** `pnpm install && pnpm build`
5. **Start Command:** `pnpm start`
6. Add environment variables
7. Deploy

---

### 📦 Docker (Any Cloud)
**Works with AWS, Google Cloud, Digital Ocean, etc.**

```bash
# Build locally
docker build -t pulsetv-activation-portal .

# Run locally to test
docker run -p 3000:3000 pulsetv-activation-portal

# Push to Docker Hub
docker tag pulsetv-activation-portal YOUR_USERNAME/pulsetv-activation-portal
docker push YOUR_USERNAME/pulsetv-activation-portal
```

---

### 💜 Heroku (Legacy but works)
**Free tier discontinued, but still available**

```bash
npm install -g heroku
heroku login
heroku create
git push heroku main
heroku open
```

---

### ▲ Vercel
**Best for frontend, but supports Node**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Select "Other" as framework
4. Build command: `pnpm build`
5. Start command: `pnpm start`
6. Deploy

---

## Environment Variables

Create a `.env` file locally (copy from `.env.example`):

```env
DATABASE_URL=file:./data/dev.db
PORT=3000
NODE_ENV=production
```

For production deployments, use your platform's secret management:
- **Railway**: Add in "Variables" tab
- **Render**: Add in "Environment" section
- **Heroku**: `heroku config:set KEY=value`
- **Vercel**: Add in "Settings" → "Environment Variables"

---

## Testing Endpoints After Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-app-url.com/healthz

# Device activation
curl -X POST https://your-app-url.com/activate \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "tv-001",
    "deviceKey": "secret-key-123",
    "pin": "1234",
    "playlistName": "My Playlist",
    "m3uUrl": "https://example.com/playlist.m3u"
  }'

# Verify PIN
curl -X POST https://your-app-url.com/device/tv-001/verify \
  -H "Content-Type: application/json" \
  -d '{"pin": "1234"}'
```

---

## CI/CD Automation

GitHub Actions workflows are included:
- `.github/workflows/deploy-railway.yml` - Auto-deploy to Railway on push
- `.github/workflows/deploy-render.yml` - Auto-deploy to Render on push

Configure your platform's deploy hook/token in GitHub Secrets to enable auto-deployment.

---

## Support

- **Issues?** Check your platform's logs
- **pnpm not found?** Install globally: `npm install -g pnpm`
- **Build failing?** Check `.env` file and database connectivity
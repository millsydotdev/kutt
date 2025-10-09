# Railway Quick Start Guide

Super simple Railway deployment for Kutt URL shortener.

## 1. Add Services to Railway

In your Railway project dashboard:

1. **Add PostgreSQL**: Click "+ New" → Database → Add PostgreSQL
2. **Add Redis**: Click "+ New" → Database → Add Redis  
3. **Add Your App**: Click "+ New" → GitHub Repo → Select your Kutt repository

## 2. Configure Variables

Go to your **app service** → **Variables** tab → **RAW Editor** → Paste this:

```env
JWT_SECRET=${{secret(32)}}
DEFAULT_DOMAIN=your-app.up.railway.app
DATABASE_URL=${{DATABASE_URL}}
REDIS_URL=${{REDIS_URL}}
SITE_NAME=Kutt
TRUST_PROXY=true
DISALLOW_REGISTRATION=true
DISALLOW_ANONYMOUS_LINKS=true
ENABLE_RATE_LIMIT=true
```

Replace `your-app.up.railway.app` with your actual Railway domain (find in Settings → Domains).

## 3. Optional: Add Resend for Email

1. Sign up at [resend.com](https://resend.com)
2. Get API key from [resend.com/api-keys](https://resend.com/api-keys)
3. Add these variables:

```env
MAIL_ENABLED=true
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=resend
MAIL_PASSWORD=re_your_api_key_here
MAIL_FROM=Kutt <onboarding@resend.dev>
```

## 4. Deploy!

Railway will automatically:
- ✅ Install dependencies
- ✅ Run database migrations
- ✅ Start your app
- ✅ Generate JWT secret with `${{secret(32)}}`
- ✅ Inject DATABASE_URL and REDIS_URL from your services

## 5. Create Admin Account

Visit: `https://your-app.up.railway.app/create-admin`

---

## How It Works

### Railway Magic ✨

- **`${{secret(32)}}`** → Generates secure 32-char random string
- **`${{DATABASE_URL}}`** → Auto-injected from PostgreSQL service
- **`${{REDIS_URL}}`** → Auto-injected from Redis service

### Automatic URL Parsing

The app automatically parses `DATABASE_URL` and `REDIS_URL`:

```javascript
// DATABASE_URL: postgres://user:pass@host:5432/dbname
// ↓ Auto-parsed to:
// DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL

// REDIS_URL: redis://:password@host:6379
// ↓ Auto-parsed to:
// REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_ENABLED
```

**You don't need to set individual variables!** 🎉

---

## Troubleshooting

**App won't start?**
- Check Railway logs: Deployments tab → Latest deployment → View logs
- Verify `JWT_SECRET` is set
- Ensure PostgreSQL and Redis services are running

**Database connection error?**
- Verify PostgreSQL service is active
- Check that `DATABASE_URL=${{DATABASE_URL}}` is in variables

**Redis connection error?**
- Verify Redis service is active  
- Check that `REDIS_URL=${{REDIS_URL}}` is in variables

---

## Full Documentation

- [Complete Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)
- [Environment Variables Template](./railway-env-template.txt)
- [Environment Variables Reference](./.example.env)

---

## Free Tier Limits

Railway free tier: **$5/month usage**

Typically covers:
- ✅ Small to medium traffic URL shortener
- ✅ Personal or team use
- ✅ Development/testing

Monitor usage in Railway dashboard.


# Deploying Kutt to Railway

This guide will walk you through deploying Kutt URL shortener to Railway with PostgreSQL and Redis.

## Prerequisites

- A [Railway account](https://railway.app) (free tier available)
- A GitHub account (to connect your repository)
- Git installed locally

## Quick Deploy

### Step 1: Fork or Clone Repository

Fork this repository to your GitHub account or clone it locally.

### Step 2: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL instance and provide environment variables

### Step 4: Add Redis Database

1. Click **"+ New"** again
2. Select **"Database"** → **"Add Redis"**
3. Railway will automatically provision a Redis instance and provide environment variables

### Step 5: Configure Environment Variables

In your application service's **Variables** tab, add the following:

#### Required Variables

```env
# Railway auto-generates a secure secret (no need to manually generate!)
JWT_SECRET=${{secret(32)}}

# Set your Railway domain (find in Settings → Domains)
DEFAULT_DOMAIN=your-app.up.railway.app

# Railway automatically provides these when you add Postgres/Redis services
DATABASE_URL=${{DATABASE_URL}}
REDIS_URL=${{REDIS_URL}}

# Site Configuration
SITE_NAME=Kutt
TRUST_PROXY=true
```

**That's it!** Railway automatically:
- Generates `JWT_SECRET` using `${{secret(32)}}`
- Provides `DATABASE_URL` when you add PostgreSQL
- Provides `REDIS_URL` when you add Redis
- The app parses these URLs automatically into the needed configuration

#### How Railway Variables Work

- **`${{secret(32)}}`** - Railway auto-generates a secure 32-character random string
- **`${{DATABASE_URL}}`** - Railway auto-injects the PostgreSQL connection URL
- **`${{REDIS_URL}}`** - Railway auto-injects the Redis connection URL

The app automatically parses `DATABASE_URL` and `REDIS_URL` to extract host, port, credentials, etc.

### Step 6: Optional Configuration

#### Registration & Anonymous Links

By default, registration and anonymous link creation are disabled for security:

```env
DISALLOW_REGISTRATION=true
DISALLOW_ANONYMOUS_LINKS=true
```

Set to `false` if you want to allow these features.

#### Email Configuration with Resend (Optional but Recommended)

[Resend](https://resend.com) is recommended for Railway deployments - modern, simple, and developer-friendly.

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key from [https://resend.com/api-keys](https://resend.com/api-keys)
3. Add these variables in Railway:

```env
MAIL_ENABLED=true
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=resend
MAIL_PASSWORD=re_your_resend_api_key_here
MAIL_FROM=Kutt <onboarding@resend.dev>
```

**Resend Benefits:**
- 100 free emails/day (3,000/month)
- Simple API key authentication
- Excellent deliverability
- Built for developers

**Alternative Email Services:**
- [SendGrid](https://sendgrid.com) - smtp.sendgrid.net:587 (100 emails/day free)
- [Mailgun](https://mailgun.com) - smtp.mailgun.org:587 (5,000 emails/month free)
- [Postmark](https://postmarkapp.com) - smtp.postmarkapp.com:587 (100 emails/month free)

#### Rate Limiting (Recommended)

Enable rate limiting to prevent abuse:

```env
ENABLE_RATE_LIMIT=true
```

### Step 7: Deploy

1. Railway will automatically detect the configuration files (`railway.json` and `nixpacks.toml`)
2. It will install dependencies, run database migrations, and start your app
3. Once deployed, you'll get a URL like `https://your-app.up.railway.app`

### Step 8: Set Up Custom Domain (Optional)

1. In Railway, go to your app service
2. Click **Settings** → **Domains**
3. Click **"Custom Domain"**
4. Add your domain and follow the DNS configuration instructions
5. Update `DEFAULT_DOMAIN` environment variable to your custom domain

## Configuration Files

This repository includes Railway-specific configuration:

- **`railway.json`**: Configures deployment settings and ensures migrations run before app start
- **`nixpacks.toml`**: Specifies Node.js 20 and build process
- **`.example.env`**: Template with Railway-specific instructions

## How Railway Variable Linking Works

Railway automatically provides connection URLs when you add services to your project:

### Automatic Variables

- **PostgreSQL** → Provides `DATABASE_URL` (e.g., `postgres://user:pass@host:5432/dbname`)
- **Redis** → Provides `REDIS_URL` (e.g., `redis://:password@host:6379`)

### Secret Generation

Railway can generate secure random secrets:

```env
JWT_SECRET=${{secret(32)}}
```

This generates a unique 32-character random string on deployment.

### URL Parsing

The app automatically parses `DATABASE_URL` and `REDIS_URL` into individual components:

```javascript
// DATABASE_URL is parsed to extract:
// - DB_HOST
// - DB_PORT
// - DB_NAME
// - DB_USER
// - DB_PASSWORD
// - DB_SSL (automatically enabled)

// REDIS_URL is parsed to extract:
// - REDIS_HOST
// - REDIS_PORT
// - REDIS_PASSWORD
// - REDIS_ENABLED (automatically set to true)
```

This happens automatically in `server/env.js`, so you don't need to set individual variables!

## Troubleshooting

### App Won't Start

**Check logs:**
1. Go to your app service in Railway
2. Click on **"Deployments"** tab
3. Click on the latest deployment
4. View the build and deploy logs

**Common issues:**
- Missing `JWT_SECRET` - Make sure it's set in Variables
- Missing database connection - Verify Postgres and Redis services are running
- Migration failures - Check if database is accessible

### Database Connection Errors

1. Verify PostgreSQL service is running
2. Check that `DB_CLIENT=pg` is set
3. Ensure `DB_SSL=true` for Railway PostgreSQL
4. Verify the service references are correct (e.g., `${{Postgres.PGHOST}}`)

### Redis Connection Errors

1. Verify Redis service is running
2. Check that `REDIS_ENABLED=true`
3. Verify the service references are correct (e.g., `${{Redis.REDISHOST}}`)

### View Logs

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs
```

## Creating Your First Admin User

After deployment:

1. Visit your app URL: `https://your-app.up.railway.app/create-admin`
2. Fill in the form to create your admin account
3. Login at: `https://your-app.up.railway.app/login`

## Cost Estimation

Railway free tier includes:
- $5 of usage per month
- Typically sufficient for:
  - Low to medium traffic URL shortener
  - Personal or small team use
  - Development/testing

For production use with higher traffic, monitor your usage in Railway dashboard.

## Updates and Maintenance

Railway automatically deploys when you push to your connected GitHub branch.

**Manual deployment:**
1. Push changes to your GitHub repository
2. Railway automatically triggers a new deployment
3. Migrations run automatically before app starts

**Environment variable updates:**
1. Go to Variables tab in Railway
2. Update values
3. Railway automatically restarts your service

## Security Best Practices

1. ✅ Keep `DISALLOW_REGISTRATION=true` unless needed
2. ✅ Keep `DISALLOW_ANONYMOUS_LINKS=true` for public instances
3. ✅ Enable `ENABLE_RATE_LIMIT=true`
4. ✅ Use strong, random `JWT_SECRET`
5. ✅ Regularly update dependencies
6. ✅ Monitor logs for suspicious activity
7. ✅ Set up email service for password resets

## Support

- Railway Documentation: https://docs.railway.app
- Kutt Documentation: https://docs.kutt.it
- Railway Discord: https://discord.gg/railway
- Issues: https://github.com/thedevs-network/kutt/issues

## License

MIT License - see LICENSE file for details


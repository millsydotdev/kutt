# Railway Deployment Setup - Summary

This document summarizes all the changes made to enable easy Railway deployment for Kutt.

## Files Created

### 1. `railway.json`
- **Purpose**: Configures Railway build and deployment settings
- **Key Features**:
  - Uses Nixpacks builder
  - Runs migrations automatically before starting the app: `npm run migrate && npm start`
  - Restart policy: ON_FAILURE with max 10 retries
  - Ensures database is ready before app starts

### 2. `nixpacks.toml`
- **Purpose**: Specifies build environment for Railway
- **Key Features**:
  - Uses Node.js 20 and OpenSSL
  - Runs `npm ci` for clean dependency installation
  - Defines start command with automatic migrations

### 3. `RAILWAY_DEPLOYMENT.md`
- **Purpose**: Comprehensive step-by-step deployment guide
- **Contents**:
  - Prerequisites and quick deploy instructions
  - Database and Redis setup
  - Environment variable configuration with Railway's `${{Service.VARIABLE}}` syntax
  - Secret generation commands for multiple platforms
  - Optional configurations (email, rate limiting, custom domains)
  - Troubleshooting section
  - Cost estimation for Railway free tier
  - Security best practices

### 4. `railway-env-template.txt`
- **Purpose**: Quick copy-paste template for Railway environment variables
- **Contents**:
  - Pre-configured variable mappings for Postgres and Redis
  - Service linking syntax examples
  - Comments explaining what to replace
  - Instructions for using Railway's RAW Editor

### 5. `RAILWAY_SETUP_SUMMARY.md` (this file)
- **Purpose**: Overview of all changes made

## Files Modified

### 1. `.example.env`
- **Added**: Comprehensive Railway deployment guide at the top (42 lines)
- **Added**: Railway-specific comments throughout
- **Modified**: Database client default set to `pg` (PostgreSQL) for Railway
- **Modified**: Redis enabled by default for Railway deployments
- **Added**: Instructions for Railway service linking using `${{Service.VARIABLE}}` syntax
- **Added**: JWT_SECRET generation commands with examples
- **Added**: Mail service recommendations (SendGrid, Mailgun, etc.)
- **Added**: Notes about Railway's automatic PORT management
- **Added**: SSL enabled by default for Railway Postgres (`DB_SSL=true`)
- **Key Sections**:
  - Lines 1-53: Railway deployment guide
  - Lines 67-71: JWT_SECRET generation instructions
  - Lines 84-100: Postgres connection configuration
  - Lines 114-127: Redis connection configuration
  - Lines 149-153: Email service recommendations

### 2. `README.md`
- **Added**: "Railway Deployment" section after Docker section
- **Added**: Railway deployment button
- **Added**: Quick setup instructions
- **Added**: Links to deployment guide and environment template
- **Modified**: Table of contents to include Railway deployment link

## How Railway Integration Works

### Service Linking
Railway provides environment variables automatically when you add services:

**PostgreSQL Service provides:**
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `DATABASE_URL`

**Redis Service provides:**
- `REDISHOST`, `REDISPORT`, `REDISUSER`, `REDISPASSWORD`, `REDIS_URL`

**Variable Reference Syntax:**
In your app service, reference other services' variables using:
```env
DB_HOST=${{Postgres.PGHOST}}
REDIS_HOST=${{Redis.REDISHOST}}
```

Railway automatically resolves these at runtime.

### Build and Deploy Process

1. **Detect**: Railway detects `railway.json` and `nixpacks.toml`
2. **Install**: Runs `npm ci` to install dependencies
3. **Migrate**: Runs `npm run migrate` to update database schema
4. **Start**: Runs `npm start` to launch the application
5. **Monitor**: Auto-restarts on failure (up to 10 times)

### Environment Variables Setup

Users need to manually set in Railway dashboard:
- `JWT_SECRET` - Generated random secret
- `DEFAULT_DOMAIN` - Railway-provided domain or custom domain
- Service links using `${{Service.VARIABLE}}` syntax
- Optional: Mail, rate limiting, and other features

## Security Features

All configurations include:
- ✅ Registration disabled by default (`DISALLOW_REGISTRATION=true`)
- ✅ Anonymous links disabled by default (`DISALLOW_ANONYMOUS_LINKS=true`)
- ✅ SSL enabled for database connections (`DB_SSL=true`)
- ✅ Rate limiting recommended (`ENABLE_RATE_LIMIT=true`)
- ✅ Trust proxy enabled (`TRUST_PROXY=true`)
- ✅ Secure secret generation instructions

## Testing Checklist

Before deploying to Railway:
- [ ] PostgreSQL service added to Railway project
- [ ] Redis service added to Railway project
- [ ] JWT_SECRET generated and set
- [ ] DEFAULT_DOMAIN set to Railway app domain
- [ ] Database service linked with `${{Postgres.*}}` variables
- [ ] Redis service linked with `${{Redis.*}}` variables
- [ ] DB_CLIENT set to `pg`
- [ ] DB_SSL set to `true`
- [ ] REDIS_ENABLED set to `true`
- [ ] Review optional settings (mail, rate limiting, etc.)

## Quick Start Commands

**Generate JWT_SECRET (Linux/Mac):**
```bash
openssl rand -base64 32
```

**Generate JWT_SECRET (Node.js - any platform):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Generate JWT_SECRET (Windows PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## File Locations

```
kutt/
├── .example.env                 # Updated with Railway instructions
├── README.md                    # Updated with Railway section
├── railway.json                 # NEW: Railway deployment config
├── nixpacks.toml               # NEW: Build configuration
├── RAILWAY_DEPLOYMENT.md       # NEW: Comprehensive guide
├── railway-env-template.txt    # NEW: Quick copy-paste template
└── RAILWAY_SETUP_SUMMARY.md    # NEW: This file
```

## Next Steps for Users

1. Read `RAILWAY_DEPLOYMENT.md` for detailed instructions
2. Use `railway-env-template.txt` to quickly set up variables
3. Follow the step-by-step guide in `.example.env` header
4. Deploy and test
5. Set up custom domain (optional)
6. Configure email service (optional)

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Kutt Docs**: https://docs.kutt.it
- **Railway Discord**: https://discord.gg/railway
- **Kutt Issues**: https://github.com/thedevs-network/kutt/issues

## Notes

- All configurations are tested and follow Railway best practices
- Free tier is sufficient for low-medium traffic deployments
- Migrations run automatically on each deployment
- Environment variables can be updated without redeployment
- Railway provides automatic SSL certificates for all deployments


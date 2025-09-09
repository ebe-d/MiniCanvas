# MiniCanvas FREE Deployment Guide

This guide provides step-by-step instructions for deploying the MiniCanvas application completely **FREE** using the best free hosting services.

## 🚀 Quick Deployment Overview

MiniCanvas consists of:
- **HTTP Backend**: REST API for authentication, rooms, and user management
- **WebSocket Backend**: Real-time collaboration for drawing
- **Frontend**: Next.js application with canvas drawing interface
- **Database**: PostgreSQL (your existing Neon database)

## 💰 FREE Hosting Stack

| Service | Provider | Cost | Purpose |
|---------|----------|------|---------|
| **Frontend** | Vercel | ✅ FREE | Next.js hosting |
| **HTTP Backend** | Railway | ✅ FREE | Node.js API |
| **WebSocket Backend** | Railway | ✅ FREE | Real-time server |
| **Database** | Neon | ✅ FREE | PostgreSQL |

## 📋 Prerequisites

- GitHub repository with this codebase
- Your existing **Neon database** connection string
- No credit card required for any service

## 🗄️ Step 1: Database Setup ✅

### Your Neon Database (Already Ready!)

Since you already have a Neon database:

1. **Get Your Connection String**
   - Go to your Neon dashboard
   - Copy the connection string: `postgresql://user:password@host:port/database`

2. **Keep it Ready**
   - You'll need this for both Railway backend services
   - Neon allows connections from anywhere (no IP restrictions)

## 🚂 Step 2: Deploy Backends on Railway (FREE)

### 2.1 Create Railway Account
1. **Sign up**: Go to https://railway.app
2. **Connect GitHub**: Link your GitHub account
3. **No credit card required**

### 2.2 Deploy HTTP Backend

1. **Create Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose "Add variables later"

2. **Configure Build Settings**
   - **Build Command**: `npm install && cd apps/http-backend && npm run build`
   - **Start Command**: `cd apps/http-backend && npm start`
   - **Root Directory**: `/` (leave default)

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=your-random-secret-key
   ```

4. **Deploy**
   - Railway will auto-deploy
   - Copy the service URL (e.g., `https://minicanvas-http-backend.up.railway.app`)

### 2.3 Deploy WebSocket Backend

1. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select the same repository

2. **Configure Build Settings**
   - **Build Command**: `npm install && cd apps/ws-backend && npm run build`
   - **Start Command**: `cd apps/ws-backend && npm start`
   - **Root Directory**: `/`

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=same-as-http-backend
   ```

4. **Deploy**
   - Copy the service URL (e.g., `https://minicanvas-ws-backend.up.railway.app`)

## ⚡ Step 3: Deploy Frontend on Vercel (FREE)

### 3.1 Create Vercel Account
1. **Sign up**: Go to https://vercel.com
2. **Connect GitHub**: Link your GitHub account
3. **Import your repository**

### 3.2 Deploy Frontend

1. **Import Project**
   - Click "New Project" → "Import GitHub Repository"
   - Select your repository
   - Configure project settings:
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/minicanvas-fe`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

2. **Add Environment Variables**
   ```
   HTTP_BACKEND_URL=https://your-railway-http-backend.up.railway.app
   WS_BACKEND_URL=https://your-railway-ws-backend.up.railway.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your frontend URL (e.g., `https://minicanvas.vercel.app`)

## 🗃️ Step 4: Generate Prisma Client & Database Migration

### Generate Prisma Client Locally

1. **Set Environment Variable**
    ```bash
    # Use your Neon connection string
    export DATABASE_URL="your-neon-database-connection-string"
    ```

2. **Generate Prisma Client**
    ```bash
    cd packages/db
    npx prisma generate
    ```

3. **Commit Generated Files**
    ```bash
    git add .
    git commit -m "Add generated Prisma client"
    git push origin main
    ```

### Run Database Migrations

4. **Deploy Migrations to Neon**
    ```bash
    cd packages/db
    npx prisma migrate deploy
    ```

5. **Verify Connection**
    - Your Neon database is configured and ready
    - Prisma client is generated and committed
    - Migrations applied to your database

## 🚀 Quick FREE Deployment Steps

```bash
# 1. Push to GitHub (if not already done)
git add .
git commit -m "Ready for FREE deployment"
git push origin main

# 2. Deploy HTTP Backend on Railway
# - Go to railway.app → New Project → Deploy from GitHub
# - Build: npm install && cd apps/http-backend && npm run build
# - Start: cd apps/http-backend && npm start
# - Add: DATABASE_URL, JWT_SECRET

# 3. Deploy WebSocket Backend on Railway
# - Same repo, new project
# - Build: npm install && cd apps/ws-backend && npm run build
# - Start: cd apps/ws-backend && npm start
# - Add: DATABASE_URL, JWT_SECRET (same)

# 4. Deploy Frontend on Vercel
# - Go to vercel.com → Import GitHub repo
# - Root: apps/minicanvas-fe
# - Add: HTTP_BACKEND_URL, WS_BACKEND_URL

# 4. Generate Prisma client locally
export DATABASE_URL="your-neon-connection-string"
cd packages/db
npx prisma generate
git add .
git commit -m "Add generated Prisma client"
git push origin main

# 5. Run database migrations
cd packages/db
npx prisma migrate deploy

# 6. 🎉 Your FREE MiniCanvas is live!
```

## 🔐 Step 5: Environment Variables Setup

### Required Environment Variables

#### Railway HTTP Backend
```env
NODE_ENV=production
DATABASE_URL=postgresql://your-neon-connection-string
JWT_SECRET=your-random-secret-key-here
```

#### Railway WebSocket Backend
```env
NODE_ENV=production
DATABASE_URL=postgresql://your-neon-connection-string
JWT_SECRET=same-as-http-backend-above
```

#### Vercel Frontend
```env
HTTP_BACKEND_URL=https://your-railway-http-backend.up.railway.app
WS_BACKEND_URL=https://your-railway-ws-backend.up.railway.app
```

### Important Notes

1. **JWT_SECRET**: Generate a random secret and use the SAME value in both Railway backends
2. **Service URLs**: Use your actual Railway service URLs
3. **Database URL**: Your existing Neon PostgreSQL connection string
4. **Generate JWT Secret**: `openssl rand -base64 32` or use any random string

## 🚀 Step 6: Deploy and Test

### Deploy Services
1. **Deploy HTTP Backend First**
   - This ensures the API is available for the frontend

2. **Deploy WebSocket Backend**
   - Real-time collaboration backend

3. **Deploy Frontend Last**
   - Depends on both backend services

### Test Deployment
1. **Visit Frontend URL**
   - Should load the MiniCanvas homepage

2. **Test Authentication**
   - Try signing up a new user
   - Try signing in

3. **Test Canvas**
   - Create a room
   - Test drawing functionality
   - Test real-time collaboration

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Railway: Check deployment logs in Railway dashboard
# Vercel: Check build logs in Vercel dashboard
# Common issues:
# - Missing dependencies in package.json
# - TypeScript compilation errors
# - Prisma client not generated
```

#### 2. Database Connection Issues
```bash
# Verify DATABASE_URL format (your Neon connection string)
# Neon allows connections from anywhere (no IP restrictions)
# Check Neon dashboard for connection limits
# Verify DATABASE_URL is set in both Railway services
```

#### 3. WebSocket Connection Issues
```bash
# Railway WebSocket URLs should be: https://your-service.up.railway.app
# Frontend should use: wss://your-service.up.railway.app
# Ensure JWT_SECRET is identical in both Railway backends
```

#### 4. Frontend API Calls Failing
```bash
# Verify Railway backend URLs in Vercel environment variables
# Check if Railway services are running (green status)
# Verify environment variables are set correctly in Vercel
```

### Debug Commands

#### Check Service Health
```bash
# Railway HTTP Backend
curl https://your-service.up.railway.app

# Railway WebSocket (check Railway dashboard)
# Vercel Frontend: https://your-project.vercel.app
```

#### View Logs
- **Railway**: Project Dashboard → Deployments → View Logs
- **Vercel**: Project Dashboard → Functions/Deployments → View Logs
- **Neon**: Dashboard → Monitoring → Query logs

## 💰 Cost Estimation - 100% FREE! 🎉

### Your Complete FREE Setup
- **Frontend**: Vercel ✅ FREE
- **HTTP Backend**: Railway ✅ FREE
- **WebSocket Backend**: Railway ✅ FREE
- **Database**: Neon ✅ FREE (your existing setup)
- **Total Cost**: **$0/month** 🚀

### Free Tier Limits (All Generous!)

| Service | Free Limit | Perfect For |
|---------|------------|-------------|
| **Vercel** | 100GB bandwidth/month | Production traffic |
| **Railway** | 512MB RAM, 1GB storage | Full-stack apps |
| **Neon** | 0.5GB storage, 100 hours compute | Development + small production |

### No Credit Card Required!
- ✅ Vercel: No payment info needed
- ✅ Railway: No payment info needed
- ✅ Neon: You already have it set up

## 🔄 Updates and Maintenance

### Deploying Updates
1. **Push to GitHub**
   - Railway auto-redeploys on git push
   - Vercel auto-redeploys on git push

2. **Manual Deploy**
   - **Railway**: Project Dashboard → Deploy
   - **Vercel**: Project Dashboard → Deployments → Redeploy

### Database Updates
```bash
# When schema changes:
cd packages/db
npx prisma migrate dev --name your-migration-name
npx prisma generate

# Deploy to production:
export DATABASE_URL="your-neon-connection-string"
npx prisma migrate deploy
```

## 📊 Monitoring

### Railway Dashboard
- **Service Status**: Green = running, Red = issues
- **Logs**: Real-time deployment and runtime logs
- **Metrics**: CPU, memory, network usage

### Vercel Dashboard
- **Deployments**: Build status and performance
- **Analytics**: Page views, response times
- **Functions**: Serverless function performance

### Neon Dashboard
- **Connection Health**: Active connections and performance
- **Query Monitoring**: Slow queries and optimization
- **Storage Usage**: Database size and growth

### Application Monitoring
- **User Registration**: Monitor signup/signin success rates
- **Room Creation**: Track room creation metrics
- **WebSocket Connections**: Monitor real-time connection health
- **Error Rates**: Track API failures and user issues

## 🎯 Production Checklist

- [ ] All services deployed and running
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] JWT secrets generated and consistent
- [ ] Frontend can connect to backends
- [ ] Authentication working
- [ ] Canvas drawing functional
- [ ] Real-time collaboration working
- [ ] Mobile responsiveness tested
- [ ] Error handling verified

## 📞 Support

If you encounter issues:
1. **Railway**: Check service logs in Railway dashboard
2. **Vercel**: Check build/deployment logs in Vercel dashboard
3. **Neon**: Check connection status in Neon dashboard
4. Verify environment variables are set correctly
5. Test API endpoints manually with curl/Postman
6. Check database connectivity from Railway services
7. Review this deployment guide

### Quick Debug Checklist:
- ✅ Railway services are green/running
- ✅ Vercel deployment is successful
- ✅ Environment variables match across services
- ✅ Neon database is accessible
- ✅ JWT_SECRET is identical in both backends
- ✅ Frontend URLs point to correct Railway services

## 🚀 Success! Your FREE MiniCanvas is Live! 🎉

Once deployed, your MiniCanvas application will be available at:
- **Frontend**: `https://your-project.vercel.app`
- **HTTP API**: `https://your-project.up.railway.app`
- **WebSocket**: `https://your-ws-project.up.railway.app`

## 🎯 What Users Can Do:

✅ **Sign up and sign in** with secure authentication
✅ **Create collaborative drawing rooms** instantly
✅ **Draw in real-time** with other users
✅ **Use all canvas tools**: rectangle, circle, pencil, eraser, text, pan, zoom
✅ **Undo/Redo actions** with full history
✅ **Mobile responsive** design

## 🌟 Production Features:

- **Real-time collaboration** via WebSocket
- **Secure authentication** with JWT tokens
- **PostgreSQL database** with Neon
- **Responsive design** for all devices
- **Error handling** and validation
- **Type-safe** with TypeScript
- **Modern UI** with Tailwind CSS

## 💫 Your FREE Stack is Complete!

| Component | Status | URL |
|-----------|--------|-----|
| ✅ Database | Neon | Your existing DB |
| ✅ HTTP Backend | Railway | `https://*.up.railway.app` |
| ✅ WebSocket Backend | Railway | `https://*.up.railway.app` |
| ✅ Frontend | Vercel | `https://*.vercel.app` |

## 🎨 Start Creating!

Your MiniCanvas is now **completely FREE** and ready for users to:
- 🎨 Draw collaboratively in real-time
- 🏠 Create unlimited drawing rooms
- 👥 Invite friends to collaborate
- 📱 Use on any device
- ⚡ Experience instant updates

**No costs, no limits, pure creativity!** 🚀
# MiniCanvas Deployment Guide - Render

This guide provides step-by-step instructions for deploying the MiniCanvas application (HTTP Backend, WebSocket Backend, and Frontend) to Render.

## 🚀 Quick Deployment Overview

MiniCanvas consists of:
- **HTTP Backend**: REST API for authentication, rooms, and user management
- **WebSocket Backend**: Real-time collaboration for drawing
- **Frontend**: Next.js application with canvas drawing interface
- **Database**: PostgreSQL for data persistence

## 📋 Prerequisites

- Render account (https://render.com)
- GitHub repository with this codebase
- Basic understanding of Render services

## 🗄️ Step 1: Database Setup

### Option A: Using Render PostgreSQL (Recommended)

1. **Create PostgreSQL Database**
   - Go to https://dashboard.render.com
   - Click "New" → "PostgreSQL"
   - Choose plan: **Starter** ($7/month)
   - Name: `minicanvas-db`
   - Region: Choose closest to your users
   - Click "Create Database"

2. **Note the Connection Details**
   - Copy the `External Database URL` - you'll need this later
   - Format: `postgresql://user:password@host:port/database`

### Option B: Using External PostgreSQL

If you prefer to use an external PostgreSQL provider (AWS RDS, Google Cloud SQL, etc.), ensure you have the connection string ready.

## 🔧 Step 2: Deploy Using Render YAML

### Method 1: Blueprints (Recommended)

1. **Connect GitHub Repository**
   - Go to https://dashboard.render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub account
   - Select the repository containing this codebase

2. **Deploy Blueprint**
   - Render will automatically detect the `render.yaml` file
   - Click "Deploy Blueprint"
   - This will create all services automatically

### Method 2: Manual Service Creation

If blueprint deployment doesn't work, create services manually:

#### 2.1 Create HTTP Backend Service

1. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Name: `minicanvas-http-backend`
   - Environment: `Node`
   - Build Command: `cd apps/http-backend && npm install && npm run build`
   - Start Command: `cd apps/http-backend && npm start`

2. **Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-random-secret>
   DATABASE_URL=<postgresql-connection-string>
   PORT=10000
   ```

#### 2.2 Create WebSocket Backend Service

1. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Name: `minicanvas-ws-backend`
   - Environment: `Node`
   - Build Command: `cd apps/ws-backend && npm install && npm run build`
   - Start Command: `cd apps/ws-backend && npm start`

2. **Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=<same-as-http-backend>
   DATABASE_URL=<postgresql-connection-string>
   PORT=10000
   ```

#### 2.3 Create Frontend Service

1. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Name: `minicanvas-frontend`
   - Environment: `Node`
   - Build Command: `cd apps/minicanvas-fe && npm install && npm run build`
   - Start Command: `cd apps/minicanvas-fe && npm start`

2. **Environment Variables**
   ```
   NODE_ENV=production
   HTTP_BACKEND_URL=<http-backend-service-url>
   WS_BACKEND_URL=<ws-backend-service-url>
   ```

## 🔗 Step 3: Service Interconnection

### Automatic (Blueprint Method)
- Services will be automatically connected via the `render.yaml` configuration
- Environment variables will be set automatically

### Manual Method
1. **Get Service URLs**
   - HTTP Backend: `https://minicanvas-http-backend.onrender.com`
   - WS Backend: `https://minicanvas-ws-backend.onrender.com`

2. **Update Frontend Environment Variables**
   - Set `HTTP_BACKEND_URL` to HTTP backend URL
   - Set `WS_BACKEND_URL` to WS backend URL

## 🗃️ Step 4: Database Migration

### Run Prisma Migrations

1. **Connect to Database**
   ```bash
   # Install Prisma CLI globally (if not already installed)
   npm install -g prisma

   # Set DATABASE_URL environment variable
   export DATABASE_URL="your-postgresql-connection-string"
   ```

2. **Run Migrations**
   ```bash
   cd packages/db
   npx prisma migrate deploy
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## 🔐 Step 5: Environment Variables Setup

### Required Environment Variables

#### HTTP Backend
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://user:password@host:port/database
PORT=10000
```

#### WebSocket Backend
```env
NODE_ENV=production
JWT_SECRET=same-as-http-backend
DATABASE_URL=postgresql://user:password@host:port/database
PORT=10000
```

#### Frontend
```env
NODE_ENV=production
HTTP_BACKEND_URL=https://minicanvas-http-backend.onrender.com
WS_BACKEND_URL=https://minicanvas-ws-backend.onrender.com
```

### JWT Secret Generation
```bash
# Generate a secure random JWT secret
openssl rand -base64 32
# Or use: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

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
# Check build logs in Render dashboard
# Common issues:
# - Missing dependencies in package.json
# - TypeScript compilation errors
# - Prisma client not generated
```

#### 2. Database Connection Issues
```bash
# Verify DATABASE_URL format
# Ensure database is accessible from Render
# Check firewall settings if using external DB
```

#### 3. WebSocket Connection Issues
```bash
# Verify WS_BACKEND_URL format (should be wss:// for production)
# Check CORS settings in backend
# Ensure JWT_SECRET is identical across services
```

#### 4. Frontend API Calls Failing
```bash
# Verify HTTP_BACKEND_URL format (should be https:// for production)
# Check if backend service is running
# Verify environment variables are set correctly
```

### Debug Commands

#### Check Service Health
```bash
# HTTP Backend health check
curl https://your-http-backend-url.onrender.com

# WebSocket connection test
# Use browser developer tools Network tab
```

#### View Logs
- Go to Render Dashboard
- Select your service
- Click "Logs" tab
- Check for error messages

## 💰 Cost Estimation

### Render Pricing (as of 2025)
- **PostgreSQL**: $7/month (Starter plan)
- **Web Services**: $7/month each (Starter plan)
- **Total**: ~$21/month for all services

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- 750 hours/month free
- May experience cold starts

## 🔄 Updates and Maintenance

### Deploying Updates
1. **Push to GitHub**
   - Render automatically redeploys on git push

2. **Manual Deploy**
   - Go to Render Dashboard
   - Click "Manual Deploy" → "Deploy latest commit"

### Database Updates
```bash
# When schema changes:
cd packages/db
npx prisma migrate dev --name your-migration-name
npx prisma generate

# Deploy to production:
npx prisma migrate deploy
```

## 📊 Monitoring

### Render Dashboard
- **Service Status**: Check if services are running
- **Logs**: Monitor for errors and performance issues
- **Metrics**: CPU, memory, and request counts

### Application Monitoring
- **User Registration**: Monitor signup/signin success rates
- **Room Creation**: Track room creation metrics
- **WebSocket Connections**: Monitor real-time connection health

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
1. Check Render service logs
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity
5. Review this deployment guide

## 🚀 Success!

Once deployed, your MiniCanvas application will be available at:
- **Frontend**: `https://minicanvas-frontend.onrender.com`
- **HTTP API**: `https://minicanvas-http-backend.onrender.com`
- **WebSocket**: `https://minicanvas-ws-backend.onrender.com`

Users can now:
- Sign up and sign in
- Create collaborative drawing rooms
- Draw in real-time with other users
- Use all canvas tools and features

🎨 Happy drawing!
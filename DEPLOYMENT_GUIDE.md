# Weather App - Deployment Guide

Complete step-by-step guide to deploy your MERN weather app to production.

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────┐
│         Your Users (Browser)                │
└──────────────┬──────────────────────────────┘
               │ HTTPS
    ┌──────────┴──────────┐
    ▼                     ▼
┌──────────┐        ┌──────────────┐
│ Vercel   │        │ Render/      │
│ Frontend │────────│ Railway      │
└──────────┘ API    │ Backend      │
              Calls └──────┬───────┘
                           │
                           ▼
                   ┌────────────────┐
                   │ MongoDB Atlas  │
                   │ Database       │
                   └────────────────┘
```

## 📋 Prerequisites

✅ GitHub account  
✅ Vercel account (free at vercel.com)  
✅ Render or Railway account (free)  
✅ MongoDB Atlas account (free at mongodb.com/cloud/atlas)  

---

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start free"
3. Sign up with email/GitHub

### 1.2 Create Database
1. Click "Create" → "Database"
2. Select "Free" tier
3. Choose AWS region closest to you
4. Click "Create Cluster"
5. Wait 2-3 minutes for cluster to be ready

### 1.3 Create Database User
1. Click "Security" → "Database Access"
2. Click "Add New Database User"
3. Username: `weather_user`
4. Password: Generate secure password (copy it!)
5. Click "Add User"

### 1.4 Get Connection String
1. Go to "Databases" tab
2. Click "Connect" button
3. Select "Drivers"
4. Copy the connection string
5. Replace `<password>` with your password
```
mongodb+srv://weather_user:PASSWORD@cluster.mongodb.net/weather-app?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend (Render.com)

### 2.1 Push Backend Code to GitHub
```bash
cd c:\weather-app\backend
git init
git add .
git commit -m "Add backend code"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/weather-app-backend.git
git push -u origin main
```

### 2.2 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select `weather-app-backend` repo

### 2.3 Configure Render Deployment
- **Name:** `weather-app-backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Region:** Choose closest to you
- **Plan:** Free

### 2.4 Add Environment Variables
Click "Environment" and add:
```
PORT=10000
MONGODB_URI=mongodb+srv://weather_user:YOUR_PASSWORD@cluster.mongodb.net/weather-app?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_string_in_production_12345678
JWT_EXPIRE=7d
NODE_ENV=production
```

### 2.5 Deploy
Click "Create Web Service" and wait for deployment (2-3 minutes)

**Your backend URL will be:** `https://weather-app-backend.onrender.com`

---

## Step 3: Update Frontend API URL

### 3.1 Update script.js
Edit `script.js` and replace the API_URL:

```javascript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/auth'
    : 'https://weather-app-backend.onrender.com/api/auth'; // Your deployed backend URL
```

### 3.2 Commit to GitHub
```bash
git add script.js
git commit -m "Update API URL for production"
git push origin main
```

---

## Step 4: Deploy Frontend (Vercel)

### 4.1 Connect GitHub to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the root folder (where HTML files are)

### 4.2 Configure Project
- **Project Name:** `weather-app`
- **Root Directory:** `./` (root)
- **Framework Preset:** Other (since it's vanilla HTML/JS)

### 4.3 Deploy
Click "Deploy" and wait for completion (1-2 minutes)

**Your frontend URL will be:** `https://weather-app-vutukurisaiabhiram.vercel.app` (automatically generated)

---

## Step 5: Enable CORS on Backend

Update `backend/server.js` to allow your Vercel frontend:

```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://weather-app-vutukurisaiabhiram.vercel.app' // Your Vercel URL
    ],
    credentials: true
}));
```

Then redeploy backend on Render.

---

## 🧪 Testing Deployed App

1. **Open your Vercel URL** in browser
2. **Register** a new account
3. **Login** with your credentials
4. **Search** for a city
5. **Save** a location as favorite
6. **Logout** and login again to verify persistence

---

## 🔒 Production Security Checklist

- ✅ Change `JWT_SECRET` to a long random string
- ✅ Use strong MongoDB password
- ✅ Enable CORS only for your domain
- ✅ Set `NODE_ENV=production`
- ✅ Remove `console.log` statements in production
- ✅ Use HTTPS everywhere
- ✅ Never commit `.env` to GitHub
- ✅ Use environment variables for all secrets

---

## 📊 Environment Variables Reference

### Backend (.env)
```env
# Server
PORT=10000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://weather_user:password@cluster.mongodb.net/weather-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
JWT_EXPIRE=7d
```

### Frontend (script.js)
```javascript
const API_URL = 'https://weather-app-backend.onrender.com/api/auth';
```

---

## 🚨 Common Issues & Solutions

### "CORS Error: Access blocked"
**Solution:** 
- Add your Vercel URL to CORS in `server.js`
- Redeploy backend
- Clear browser cache

### "Cannot connect to MongoDB"
**Solution:**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure password has no special characters (or URL encode them)

### "401 Unauthorized after login"
**Solution:**
- Check JWT_SECRET is same in backend
- Verify token is being sent correctly
- Check token expiration time

### "Backend deployed but frontend can't reach it"
**Solution:**
- Verify Vercel URL in `script.js`
- Check backend is running on Render
- Check CORS configuration
- Use browser DevTools Network tab to debug

---

## 🔄 Updating Production Code

### When you make changes:

**1. Update local files**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

**2. Frontend auto-deploys** on Vercel (automatic on GitHub push)

**3. Backend needs manual redeploy** - Go to Render dashboard → Click "Manual Deploy"

---

## 📈 Scaling Tips

1. **Monitor Performance:** Use Render's monitoring dashboard
2. **Database Optimization:** Add indexes in MongoDB
3. **Caching:** Implement caching for weather data
4. **CDN:** Vercel includes built-in CDN
5. **Rate Limiting:** Add rate limiting to backend

---

## 💰 Cost Estimate

| Service | Free Tier | Cost |
|---------|-----------|------|
| MongoDB Atlas | 512 MB | Free |
| Render Backend | 750 hrs/month | Free |
| Vercel Frontend | Unlimited | Free |
| **Total** | **All Free!** | **$0/month** |

---

## 🎉 You're Live!

Your weather app is now live on the internet! 

**Share your app:**
- Frontend: `https://your-vercel-url.vercel.app`
- Let users register and login
- They can search weather anywhere!

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Express.js:** https://expressjs.com

---

**Happy Deploying!** 🚀

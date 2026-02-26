# ⚙️ PORT CONFIGURATION UPDATED

## New Port Settings

### Backend Server
- **New Port**: **6600** (previously 5000)
- **Access URL**: `http://localhost:6600`
- **API Base**: `http://localhost:6600/api`

### Frontend Application  
- **New Port**: **6700** (previously 3000)
- **Access URL**: `http://localhost:6700`
- **Development Server**: Vite on port 6700

---

## Files Updated

### Backend Configuration
1. ✅ `backend/.env` - PORT=6600, FRONTEND_URL=http://localhost:6700
2. ✅ `backend/.env.example` - Updated for reference
3. ✅ Server configured to listen on port 6600

### Frontend Configuration
1. ✅ `frontend/vite.config.js` - Dev server port 6700
2. ✅ `frontend/vite.config.js` - Proxy target updated to 6600
3. ✅ `frontend/src/services/api.js` - API URL updated to 6600

### Documentation Updated
1. ✅ `QUICKSTART.md` - All port references updated
2. ✅ `SETUP_CHECKLIST.md` - All port references updated  
3. ✅ `PROJECT_SUMMARY.md` - All port references updated

---

## Quick Start Commands

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev

# Server will start on: http://localhost:6600
```

### Start Frontend (Terminal 2)
```bash
cd frontend  
npm run dev

# App will open at: http://localhost:6700
```

### Access Application
```
Browser URL: http://localhost:6700
API Endpoint: http://localhost:6600/api
```

---

## Testing the Configuration

### 1. Test Backend
```bash
# Check if backend is running
curl http://localhost:6600/api/health

# Or visit in browser:
http://localhost:6600/api
```

### 2. Test Frontend
```
# Visit in browser:
http://localhost:6700

# You should see the login page
```

### 3. Test API Connection
```
# Login from frontend at http://localhost:6700
# Check browser console for API calls to:
http://localhost:6600/api/auth/login
```

---

## Why These Ports?

- **6600** for backend - Avoids common conflicts (5000 is often used)
- **6700** for frontend - Keeps ports related (6600-6700 range)
- No conflict with common services like:
  - 3000 (Create React App default)
  - 5000 (Flask, many Node apps)
  - 8000/8080 (Common development ports)

---

## CORS Configuration

Backend is configured to accept requests from:
```javascript
FRONTEND_URL=http://localhost:6700
```

This is set in `backend/.env` and used in the CORS middleware.

---

## Troubleshooting

### Port Already In Use

**Backend (6600)**
```bash
# Windows: Find and kill process
netstat -ano | findstr :6600
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process  
lsof -ti:6600 | xargs kill -9
```

**Frontend (6700)**
```bash
# Windows
netstat -ano | findstr :6700
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:6700 | xargs kill -9
```

### CORS Errors

If you see CORS errors:
1. ✅ Verify backend is running on **6600**
2. ✅ Verify frontend is running on **6700**
3. ✅ Check `FRONTEND_URL` in `backend/.env` is `http://localhost:6700`
4. ✅ Restart both servers after any env changes

### API Connection Fails

Check these:
1. ✅ Backend running? Visit `http://localhost:6600/api`
2. ✅ Check `frontend/src/services/api.js` has correct URL
3. ✅ Check browser console for error messages
4. ✅ Clear browser cache and localStorage

---

## Environment Variables Summary

### Backend `.env`
```bash
PORT=6600
FRONTEND_URL=http://localhost:6700
# ... other variables
```

### Frontend (Optional) `.env`
```bash
VITE_API_URL=http://localhost:6600/api
```

---

## Production Deployment

When deploying to production, update:

1. **Backend**
   - Set `PORT` to your hosting provider's port
   - Set `FRONTEND_URL` to your actual frontend domain
   - Example: `FRONTEND_URL=https://yourdomain.com`

2. **Frontend**
   - Set `VITE_API_URL` to your backend URL
   - Example: `VITE_API_URL=https://api.yourdomain.com/api`

---

## ✅ Configuration Complete!

All files have been updated to use:
- **Backend**: Port **6600**
- **Frontend**: Port **6700**

Ready to start development with the new ports! 🚀

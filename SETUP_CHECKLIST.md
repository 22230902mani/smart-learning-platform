# 🚀 SETUP CHECKLIST

Follow these steps to get your Smart Learning Platform running in 5 minutes!

---

## ✅ Step 1: Verify Prerequisites

- [ ] Node.js installed (v14 or higher)
  ```bash
  node --version
  ```

- [ ] MongoDB installed and running
  ```bash
  # Windows: Check if MongoDB service is running
  # Mac/Linux: Check with
  mongod --version
  ```

- [ ] Dependencies installed (already done)
  - ✓ Backend dependencies installed
  - ✓ Frontend dependencies installed

---

## ✅ Step 2: Start MongoDB

### Windows
```bash
net start MongoDB
# OR
mongod --dbpath="C:\data\db"
```

### Mac (Homebrew)
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
```

### Verify MongoDB is running
```bash
mongosh
# Should connect successfully
# Then type: exit
```

---

## ✅ Step 3: Seed Sample Data (IMPORTANT!)

This creates test users and questions so you can use the platform immediately.

```bash
cd backend
node scripts/seedData.js
```

You should see:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created admin user: admin@example.com / admin123
✓ Created student user: student@example.com / student123
✓ Created 10 topics
✓ Created 12 questions

✅ Database seeding completed successfully!
```

**Skip this and you won't have any questions to practice with!**

---

## ✅ Step 4: Start Backend Server

### Option A: Development mode (with auto-reload)
```bash
cd backend
npm run dev
```

### Option B: Production mode
```bash
cd backend
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║   Smart Adaptive Learning Platform API                   ║
║   Environment: development                                ║
║   Port: 6600                                             ║
╚═══════════════════════════════════════════════════════════╝
MongoDB Connected: localhost
```

**Keep this terminal open!**

---

## ✅ Step 5: Start Frontend (New Terminal)

Open a **NEW terminal window** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:6700/
➜  Network: use --host to expose
```

---

## ✅ Step 6: Access the Application

1. Open browser to: **http://localhost:6700**

2. You'll see the login page with animated gradients

3. **Login with test credentials:**
   - **Student**: `student@example.com` / `student123`
   - **Admin**: `admin@example.com` / `admin123`

---

## ✅ Step 7: Test Core Features

### As Student:

1. **Dashboard**
   - [ ] View readiness score
   - [ ] See stats cards
   - [ ] Check weak/strong topics

2. **Take Quiz**
   - [ ] Click "Take Quiz" button
   - [ ] Select mode (Practice/Timed/Revision)
   - [ ] Choose topic (or All Topics)
   - [ ] Click "Start Quiz"
   - [ ] Answer questions
   - [ ] Submit and view results

3. **View Results**
   - [ ] See accuracy score
   - [ ] Review incorrect answers
   - [ ] Read explanations

### As Admin:

1. **Login as admin**
   - Logout from student account
   - Login with: `admin@example.com` / `admin123`

2. **Access Admin Panel**
   - [ ] See "Admin Panel" in navbar
   - [ ] Click to view admin dashboard
   - [ ] (Placeholder UI - backend ready)

---

## ✅ Step 8: Verify Intelligent Features

### Test Adaptive Difficulty:

1. Answer 3-4 questions correctly
2. Notice difficulty increases
3. Answer questions incorrectly
4. Difficulty should decrease

### Test Weak Topic Detection:

1. Take multiple quizzes
2. Get some topics wrong repeatedly
3. Go to Dashboard
4. See those topics in "Weak Topics" section

### Test Readiness Score:

1. Take several quizzes
2. Dashboard shows updated readiness score
3. Score breakdown shows components
4. Recommendations appear

---

## 🎯 Common Issues & Solutions

### Issue: MongoDB connection failed
```
Solution:
1. Ensure MongoDB is running
2. Check MONGODB_URI in backend/.env
3. Try: mongosh (to test connection)
```

### Issue: Port 6600 already in use
```
Solution:
1. Change PORT in backend/.env
2. Update any hardcoded references
OR
3. Kill process on port 6600
```

### Issue: No questions appear in quiz
```
Solution:
Run seed script:
cd backend
node scripts/seedData.js
```

### Issue: CORS error
```
Solution:
1. Ensure backend is on port 6600
2. Ensure frontend is on port 6700
3. Check FRONTEND_URL in backend/.env
```

### Issue: Token expired immediately
```
Solution:
1. Clear browser localStorage
2. Re-login
3. Check JWT_SECRET in backend/.env
```

---

## 📊 Monitoring

### Check if services are running:

**Backend health:**
```bash
# In browser or curl
curl http://localhost:6600/api/health
# Should return: {"success":true,"message":"Server is running"}
```

**Frontend:**
```
Just check if localhost:6700 loads
```

**MongoDB:**
```bash
mongosh
show dbs
use smart-learning-platform
db.users.find({}).pretty()
# Should show your seeded users
```

---

## 🎨 Next Actions

Once everything is running:

1. **Explore the UI**
   - Take multiple quizzes
   - Watch readiness score update
   - See weak topics populate

2. **Add Your Own Questions**
   - Use MongoDB Compass
   - OR build the Admin UI (in placeholder)
   - OR use API directly (Postman)

3. **Customize**
   - Edit topics/subjects for your domain
   - Adjust difficulty thresholds
   - Modify mastery formulas

4. **Deploy**
   - See QUICKSTART.md for deployment guide
   - Use MongoDB Atlas
   - Deploy to Vercel/Netlify (frontend)
   - Deploy to Heroku/Railway (backend)

---

## ✨ You're All Set!

**Both terminals should be running:**
- Terminal 1: Backend (port 6600)
- Terminal 2: Frontend (port 6700)

**Browser URL:** http://localhost:6700

**Test Accounts:**
- Student: student@example.com / student123
- Admin: admin@example.com / admin123

---

## 📝 Quick Commands Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Seed database
cd backend && node scripts/seedData.js

# Check MongoDB
mongosh
use smart-learning-platform
db.users.find({})

# Stop MongoDB (Mac)
brew services stop mongodb-community

# Stop MongoDB (Windows)
net stop MongoDB
```

---

**Happy Learning! 🎓🚀**

Need help? Check:
- QUICKSTART.md - Setup details
- IMPLEMENTATION_GUIDE.md - Technical reference
- PROJECT_SUMMARY.md - Feature overview

# 🧠 Smart Adaptive Learning & Weak Topic Detection Platform

A production-grade MERN stack intelligent assessment system that adapts to student performance, detects weak areas, and provides personalized learning paths.

---

## 🎯 **Current Status: 75% Complete**

### ✅ FULLY IMPLEMENTED (Backend 100%, Frontend Core 75%)

#### **Backend - 100% Complete**
- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (Admin/Student)
- ✅ 8 MongoDB models with proper indexing
- ✅ Adaptive difficulty engine
- ✅ Weak topic detection algorithm
- ✅ Interview readiness score calculation
- ✅ Mastery score tracking
- ✅ Activity logging system
- ✅ RESTful API with validation
- ✅ Security middleware (helmet, CORS, rate limiting)

#### **Frontend - 75% Complete**
- ✅ React with Vite setup
- ✅ Authentication pages (Login/Register)
- ✅ Protected routes & role guards
- ✅ Student Dashboard with analytics
- ✅ Quiz interface with 3 modes
- ✅ Quiz results page
- ✅ Responsive Navbar
- ✅ Context API for state management
- ✅ Axios with token refresh
- ✅ Premium UI with gradients & animations

---

## 🚀 **Quick Start (5 Minutes)**

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally OR MongoDB Atlas account

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
The `.env` file is already created with defaults:
```bash
# backend/.env (already configured)
PORT=6600
MONGODB_URI=mongodb://localhost:27017/smart-learning-platform
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:6700
```

**IMPORTANT**: Change the JWT secrets in production!

### Step 3: Start Backend Server
```bash
# From backend directory
npm run dev

# You should see:
# ╔═══════════════════════════════════════════════════════════╗
# ║   Smart Adaptive Learning Platform API                   ║
# ║   Environment: development                                ║
# ║   Port: 6600                                             ║
# ╚═══════════════════════════════════════════════════════════╝
```

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 5: Start Frontend
```bash
# From frontend directory
npm run dev

# Open browser to: http://localhost:6700
```

---

## 💻 **Access the Application**

### 1. Register a New Account
- Go to: http://localhost:6700
- Click "Sign up"
- Fill in your details
- **First registered user gets student role by default**

### 2. Test the Features
- ✅ **Dashboard**: View your performance overview
- ✅ **Take Quiz**: Select mode (Practice/Timed/Revision) and start
- ✅ **Quiz Results**: See detailed results after completion
- ⏳ **Analytics**: Placeholder (see IMPLEMENTATION_GUIDE.md)
- ⏳ **Profile**: Placeholder
- ⏳ **Admin Panel**: Placeholder (requires admin role)

---

## 🎓 **Creating Sample Data**

### Manual Method (Quick Test)
1. Register as a user
2. Use MongoDB Compass or mongo shell to:
   - Manually create a topic
   - Add a few questions
   - Link questions to the topic

### Example using MongoDB Shell:
```bash
mongosh smart-learning-platform

# Create a topic
db.topics.insertOne({
  subject: "Programming",
  topic: "JavaScript",
  subtopic: "ES6 Features",
  concept: "Arrow Functions",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

# Get the topic ID and use it to create a question
db.questions.insertOne({
  topicId: ObjectId("YOUR_TOPIC_ID_HERE"),
  questionText: "What is the correct syntax for an arrow function?",
  questionType: "multiple-choice",
  options: [
    { text: "() => {}", isCorrect: true },
    { text: "function() {}", isCorrect: false },
    { text: "() -> {}", isCorrect: false },
    { text: "=> () {}", isCorrect: false }
  ],
  correctAnswer: "() => {}",
  difficulty: "easy",
  difficultyScore: 3,
  tags: ["javascript", "es6", "functions"],
  expectedTime: 30,
  explanation: "Arrow functions use the syntax () => {} in JavaScript ES6",
  hints: ["Think about the arrow symbol =>"],
  status: "active",
  statistics: { totalAttempts: 0, correctAttempts: 0, averageTime: 0 },
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🔑 **Core Features Working Now**

### 1. Adaptive Difficulty Engine
- Questions automatically adjust based on recent performance
- 80%+ accuracy → increase difficulty
- <40% accuracy → decrease difficulty
- Tracks last 5 attempts per topic

### 2. Weak Topic Detection
- Mastery score calculated with:
  - 50% weighted accuracy
  - 30% recency factor
  - 20% consistency score
- Topics with <50% mastery marked as weak
- Automatic prioritization in revision mode

### 3. Interview Readiness Score
- Comprehensive score from 0-100
- Breakdown includes:
  - Accuracy (40% weight)
  - Speed Consistency (30% weight)
  - Improvement Trend (20% weight)
  - Confidence Behavior (10% weight)

### 4. Quiz Modes
- **Practice**: Learn at your own pace
- **Timed**: 1 minute per question countdown
- **Revision**: Focus on previously wrong answers

### 5. Mistake Memory
- Persistent tracking of every wrong answer
- Auto-resolution after 3 consecutive correct answers
- Powers the Revision Mode

---

## 📊 **API Testing (Postman/Thunder Client)**

### Register User
```http
POST http://localhost:6600/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "student"
}
```

### Login
```http
POST http://localhost:6600/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}

# Response includes token - copy it for next requests
```

### Start Quiz
```http
POST http://localhost:6600/api/quiz/start
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "mode": "practice",
  "questionCount": 5
}
```

---

## 🎨 **Design System**

### Colors
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### UI Patterns
- Glassmorphism cards with backdrop blur
- Animated gradient orbs on auth pages
- Smooth micro-interactions
- Mobile-responsive throughout

---

## 📁 **Project Structure**

```
d:/PEP_PROJECT/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic (5 controllers)
│   ├── middleware/      # Auth, validation, logging
│   ├── models/          # Mongoose models (8 models)
│   ├── routes/          # API routes (6 route files)
│   ├── server.js        # Express app
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── Layout/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/     # AuthContext
│   │   ├── pages/
│   │   │   ├── Auth/    # Login, Register
│   │   │   ├── Dashboard/
│   │   │   ├── Quiz/    # Quiz, QuizResults
│   │   │   ├── Analytics/
│   │   │   ├── Profile/
│   │   │   └── Admin/   # 5 admin pages (placeholders)
│   │   ├── services/    # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css    # Design system
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── IMPLEMENTATION_GUIDE.md
```

---

## ⚡ **Performance Features**

- **Token Refresh**: Automatic background token renewal
- **Optimistic UI**: Instant feedback on actions
- **Lazy Loading**: Code splitting ready
- **Indexed Queries**: MongoDB compound indexes
- **Rate Limiting**: 100 requests per 15 min per IP
- **Helmet**: Security headers enabled
- **CORS errors**:
- Backend CORS is configured for `http://localhost:6700`

---

## 🐛 **Troubleshooting**

### MongoDB Connection Error
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (Windows):
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in backend/.env if needed
```

### CORS Error
- Ensure backend is running on port 5000
- Frontend should be on port 3000
- Update FRONTEND_URL in backend/.env if different

### Token Expired Issues
- Clear browser localStorage
- Re-login to get fresh tokens

---

## 📈 **Next Steps**

See **IMPLEMENTATION_GUIDE.md** for:
- Detailed component specifications
- Remaining 25% implementation details
- Full API documentation
- Design guidelines
- Deployment instructions

---

## 🎯 **Production Checklist**

Before deploying:
- [ ] Change JWT secrets to strong random strings
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or production DB
- [ ] Enable HTTPS
- [ ] Update CORS to production domain
- [ ] Set up environment variables on hosting
- [ ] Add rate limiting per user
- [ ] Enable MongoDB backups
- [ ] Set up error monitoring (Sentry)
- [ ] Add performance monitoring

---

## 📜 **License**

MIT License - Free to use for learning and commercial projects

---

## 🙏 **Tech Stack**

- **Frontend**: React 18, Vite, React Router, Axios, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT with refresh tokens
- **Security**: Helmet, CORS, bcrypt, rate-limit
- **Validation**: express-validator
- **Styling**: Vanilla CSS with modern design patterns

---

## **Happy Learning! 🚀**

Your adaptive learning platform is ready to help students master topics intelligently!

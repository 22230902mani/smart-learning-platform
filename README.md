# Smart Adaptive Learning & Weak Topic Detection Platform

A production-grade MERN stack intelligent assessment and preparation system that adapts to student performance, detects weak areas, and provides personalized learning paths.

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication with access and refresh tokens
- Role-based access control (Admin & Student)
- Password hashing and email validation
- Protected routes and secure API handling

### 📝 Intelligent Question System
- Hierarchical structure: Subject → Topic → Subtopic → Concept
- Difficulty levels, tags, and expected solving time
- Comprehensive explanations for each question
- Full CRUD operations (Admin)

### 🎯 Advanced Quiz Engine
- **Practice Mode**: Learn at your own pace
- **Timed Assessment Mode**: Simulate real exam conditions
- **Revision Mode**: Focus on previously incorrect answers

### 🧠 Adaptive Difficulty Engine
- Automatic difficulty adjustment based on performance
- Real-time intelligence that learns from your behavior
- Consecutive correct answers → Increased difficulty
- Repeated mistakes → Decreased difficulty

### 📊 Weak Topic Detection
- Mastery score calculation using weighted accuracy
- Recency-based performance tracking
- Persistent mistake memory
- Intelligent prioritization of weak concepts

### 🎓 Prediction & Intelligence
- **Interview Readiness Score**: Comprehensive assessment based on:
  - Accuracy and speed consistency
  - Improvement trends
  - Confidence behavior patterns
- **Personalized Learning Path**: Dynamic recommendations for topics and practice sets

### 📈 Analytics Dashboard
- **Student Dashboard**:
  - Progress charts and trend graphs
  - Topic mastery heatmap
  - Attempt history timeline
  - Readiness score meter
- **Admin Dashboard**:
  - Overall student analytics
  - Question bank management
  - User management

### 🔒 Security Features
- Input sanitization
- Rate limiting
- CORS protection
- Secure password hashing
- Activity logging

## 🛠️ Tech Stack

### Frontend
- **React**: UI framework
- **React Router**: Navigation and protected routes
- **Axios**: HTTP client
- **Chart.js / Recharts**: Data visualization
- **CSS Modules**: Styling

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting

## 📁 Project Structure

```
Smart-Adaptive-Learning-Platform/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API
│   │   ├── utils/           # Utility functions
│   │   ├── services/        # API services
│   │   └── App.js
│   └── package.json
│
└── backend/                 # Node.js + Express server
    ├── config/              # Configuration files
    ├── controllers/         # Route controllers
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    ├── middleware/          # Custom middleware
    ├── utils/               # Utility functions
    ├── server.js
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## 🗄️ Database Collections

- **Users**: User authentication and profile data
- **Topics**: Subject hierarchy (Subject → Topic → Subtopic → Concept)
- **Questions**: Question bank with metadata
- **Attempts**: Quiz attempt records
- **MistakeLogs**: Persistent mistake tracking
- **TopicStats**: Topic mastery and performance metrics
- **Predictions**: Interview readiness and recommendations
- **ActivityLogs**: System activity audit trail

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Questions (Admin)
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Quiz
- `POST /api/quiz/start` - Start quiz session
- `POST /api/quiz/submit` - Submit answer
- `GET /api/quiz/results/:sessionId` - Get quiz results

### Analytics
- `GET /api/analytics/student/:id` - Student performance data
- `GET /api/analytics/admin` - Overall analytics (Admin)
- `GET /api/analytics/weak-topics/:userId` - Weak topic analysis
- `GET /api/analytics/readiness/:userId` - Interview readiness score

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/activity-logs` - Get activity logs

## 👥 User Roles

### Student
- Register and login
- Take quizzes in multiple modes
- View personalized dashboard
- Track progress and weak topics
- View interview readiness score
- Update profile

### Admin
- All student capabilities
- Manage question bank (CRUD)
- Manage topics and hierarchy
- View all student analytics
- Manage users
- View activity logs

## 🎨 UI/UX Features

- Responsive design for all devices
- Clean and intuitive navigation
- Real-time feedback during quizzes
- Interactive charts and visualizations
- Dark/Light theme support
- Loading states and error handling
- Toast notifications

## 📜 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using the MERN stack

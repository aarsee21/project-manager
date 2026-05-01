# 🚀 Quick Start Guide

## 5-Minute Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure MongoDB
Make sure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Or if installed manually
mongod
```

### Step 3: Start Backend Server
```bash
cd backend
node server.js
```
✅ Server running on `http://localhost:5000`

### Step 4: Start Frontend HTTP Server
⚠️ **IMPORTANT**: Frontend MUST be served via HTTP, not file:// protocol!

```bash
cd frontend
python3 -m http.server 3000

# Or use Node if Python not available:
npm install -g http-server
http-server -p 3000
```

Then open in browser: **http://localhost:3000**

---

## Usage Flow

### 1️⃣ **Signup**
- Click "Sign up"
- Choose your role: **Admin** or **Member**
- Enter name, email, password

### 2️⃣ **Create Project** (Admin Only)
- Go to Projects tab
- Click "+ New Project"
- Enter project details

### 3️⃣ **Add Team Members** (Admin)
- Select a project
- Click "Add Members"
- Choose users to invite

### 4️⃣ **Create Tasks**
- Go to Tasks tab
- Click "+ New Task"
- Select project and assign to yourself
- Set due date

### 5️⃣ **Update Task Status**
- Find your task
- Click "Update"
- Change status: Pending → In Progress → Completed

### 6️⃣ **View Dashboard**
- Dashboard shows all your task statistics
- Total, Completed, Pending, In Progress, Overdue, Due this week

---

## Test Accounts

Create these accounts to test all features:

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`
- Role: Admin

**Member Account 1:**
- Email: `member1@test.com`
- Password: `member123`
- Role: Member

**Member Account 2:**
- Email: `member2@test.com`
- Password: `member456`
- Role: Member

---

## API Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/projects` | Create project (Admin) |
| GET | `/api/projects` | Get your projects |
| PUT | `/api/projects/:id/add-members` | Add team members |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get your tasks |
| GET | `/api/tasks/dashboard/stats` | Get statistics |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Environment Variables

**File:** `backend/.env`

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/projectmanager
JWT_SECRET=your-secret-key
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "MongoDB Connected" not showing | Start MongoDB: `brew services start mongodb-community` |
| 404 on API calls | Backend not running - run `node server.js` |
| "Not authorized" error | Login again - token may have expired |
| CORS errors | Ensure backend CORS is enabled (it is by default) |
| Projects not visible | Must be added as team member by admin |

---

## File Structure

```
project-manager/
├── backend/
│   ├── controllers/     (Business logic)
│   ├── models/          (Database schemas)
│   ├── routes/          (API endpoints)
│   ├── middleware/      (JWT, role verification)
│   ├── server.js        (Express app)
│   └── .env             (Configuration)
├── frontend/
│   └── index.html       (Single-page app)
└── README.md            (Full documentation)
```

---

## Key Features Implemented ✅

- ✅ JWT Authentication (7-day tokens)
- ✅ Admin & Member Roles
- ✅ Project CRUD Operations
- ✅ Task Assignment & Status Updates
- ✅ Dashboard Statistics
- ✅ Team Member Management
- ✅ Mongoose Relationships (ObjectId references)
- ✅ Proper Error Handling
- ✅ Protected Routes
- ✅ Role-Based Access Control

---

## Next Steps

1. Test all features with different user roles
2. Try creating projects and assigning tasks
3. Check dashboard statistics
4. Review code in `controllers/`, `models/`, `middleware/`
5. Customize styling in `frontend/index.html`

---

## Need Help?

- Check browser console for errors (F12)
- Check server terminal for API errors
- Review MongoDB connection in `.env`
- Verify token is stored in localStorage

Happy coding! 🎉

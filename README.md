# Project Management App

A complete full-stack project management application with Node.js/Express backend, MongoDB database, and a simple HTML/CSS/JavaScript frontend.

## Features

### Backend
- ✅ User Authentication (JWT-based signup/login)
- ✅ Role-Based Access Control (Admin & Member)
- ✅ Project Management (create, update, delete, manage team members)
- ✅ Task Management (create, assign, update status, delete)
- ✅ Dashboard Statistics (total tasks, completed, pending, overdue, due this week)
- ✅ Mongoose relationships (ObjectId references)
- ✅ Comprehensive error handling

### Frontend
- ✅ Login/Signup pages with role selection
- ✅ Dashboard with task statistics
- ✅ Projects page (create, view, delete, add team members)
- ✅ Tasks page (create, assign, update status)
- ✅ Token-based authentication (localStorage)
- ✅ Responsive UI design
- ✅ User-friendly modals for actions

## Project Structure

```
project-manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      (Login/Signup logic)
│   │   ├── projectController.js   (Project CRUD operations)
│   │   └── taskController.js      (Task CRUD & dashboard stats)
│   ├── middleware/
│   │   └── authMiddleware.js      (JWT verification & role-based access)
│   ├── models/
│   │   ├── user.js                (User schema)
│   │   ├── project.js             (Project schema with team members)
│   │   └── task.js                (Task schema with assignments)
│   ├── routes/
│   │   ├── auth.js                (Auth endpoints)
│   │   ├── project.js             (Project endpoints)
│   │   └── task.js                (Task endpoints)
│   ├── server.js                  (Express app setup)
│   ├── .env                       (Environment variables)
│   └── package.json               (Dependencies)
└── frontend/
    └── index.html                 (Single-page application)
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Configure .env file**
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/projectmanager
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Start MongoDB** (if running locally)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or manually
   mongod
   ```

4. **Start the backend server**
   ```bash
   npm start
   # or
   node server.js
   ```

  Server runs on: `https://project-manager-vsvz.onrender.com/`

### Frontend Setup

1. **Open frontend in browser**
   ```bash
   # Simply open the HTML file
   cd frontend
   open index.html
   
   # Or use a simple HTTP server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects (Protected Routes)
- `GET /api/projects` - Get all projects for logged-in user
- `POST /api/projects` - Create new project (Admin only)
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `PUT /api/projects/:projectId/add-members` - Add team members
- `DELETE /api/projects/:projectId` - Delete project

### Users (Protected Routes)
- `GET /api/users` - List all users for admin member selection

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all tasks assigned to user
- `GET /api/tasks/dashboard/stats` - Get dashboard statistics
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:taskId` - Get task details
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `PUT /api/tasks/:taskId` - Update task status
- `DELETE /api/tasks/:taskId` - Delete task

## Authentication

### How JWT Works
1. User logs in with email/password
2. Server returns JWT token
3. Token stored in browser localStorage
4. Token sent with each request in Authorization header: `Bearer <token>`
5. Middleware verifies token and attaches user to request

### Role-Based Access Control
- **Member**: Can create tasks, update their own task status, view projects they're part of
- **Admin**: Can create projects, add team members, manage all project tasks

## Usage Guide

### 1. Signup/Login
- Click "Sign up" to create new account (choose Admin or Member)
- Enter email and password
- Login with credentials

### 2. Create Project (Admin Only)
- Navigate to Projects page
- Click "+ New Project"
- Enter project name and description
- You're automatically added as team member

### 3. Add Team Members
- From admin account, open a project
- Click "Add Members" button
- Select users from the modal list to add to the project
- The frontend fetches users from `GET /api/users` and sends selected IDs to `PUT /api/projects/:projectId/add-members`

### 4. Create Tasks
- Navigate to Tasks page
- Click "+ New Task"
- Select project, enter title, set due date
- Task assigned to you by default

### 5. Update Task Status
- Click "Update" on any task
- Change status: Pending → In Progress → Completed
- Update due date if needed

### 6. View Dashboard
- Dashboard shows:
  - Total tasks assigned
  - Completed tasks
  - Pending tasks
  - In progress tasks
  - Overdue tasks
  - Tasks due this week

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'member'], default: 'member'),
  timestamps: true
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  createdBy: ObjectId (ref: User),
  teamMembers: [ObjectId] (ref: User),
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  projectId: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, required),
  status: String (enum: ['pending', 'in-progress', 'completed']),
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## Error Handling

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

1. **Password Hashing**: BCryptjs (10 salt rounds)
2. **JWT Authentication**: 7-day expiration
3. **Role-Based Authorization**: Middleware checks user role
4. **Input Validation**: Server-side validation required
5. **CORS Enabled**: Frontend can communicate with backend

## Middleware

### authMiddleware.js
```javascript
exports.protect        // Verifies JWT token
exports.authorize()    // Checks user role
```

Usage:
```javascript
router.post('/create', protect, authorize('admin'), controller);
```

## Troubleshooting

### "MongoDB Connected" not showing
- Check MongoDB is running: `mongosh`
- Verify MONGO_URI in .env is correct
- Check database naming in MONGO_URI

### "Not authorized to access this route"
- Token might be expired (valid for 7 days)
- Try logging in again
- Clear localStorage and restart

### API calls not working from frontend
- Ensure backend is running on port 5000
- Check CORS is enabled in server.js
- Verify token is being sent in Authorization header

### Projects not visible
- Make sure you're a team member
- Admin must add you to project
- Check user permissions

## Future Enhancements

- [ ] Notifications system
- [ ] Comments on tasks
- [ ] File attachments
- [ ] Task filtering and sorting
- [ ] Email notifications
- [ ] Advanced search
- [ ] User profile management
- [ ] Activity log
- [ ] Export reports to PDF
- [ ] Team messaging

## Testing

### Test User Accounts
```
Admin Account:
- Email: admin@example.com
- Password: admin123
- Role: admin

Member Account:
- Email: member@example.com
- Password: member123
- Role: member


```
## Deployment

🌐 Live URLs
Frontend (Netlify):
👉 https://cute-wisp-d93261.netlify.app
Backend (Render):
👉 https://project-manager-vsvz.onrender.com
⚙️ Tech Stack (Deployment)
Frontend hosted on Netlify
Backend hosted on Render
Database hosted on MongoDB Atlas

## License

ISC

## Support

For issues or questions, refer to the code comments and error messages in the console.



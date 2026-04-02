# 🏙️ CivicTrack — Online Complaint Registration & Management System

A full-stack web application for urban civic issue reporting and management. Citizens can submit, track, and rate resolution of street light failures, water pipe leakages, and rainwater/drainage issues. Administrators get a full dashboard with analytics and complaint management tools.

---

## 🔑 Default Login Credentials

| Role  | Email                     | Password    |
|-------|---------------------------|-------------|
| Admin | admin@civictrack.gov.in   | Admin@1234  |
| Demo  | demo@civictrack.in        | User@1234   |

---

## 🗂️ Project Structure

```
civictrack/
├── backend/                  # Node.js + Express API
│   ├── db/database.js        # SQLite DB setup & seeding
│   ├── middleware/auth.js    # JWT authentication
│   ├── routes/
│   │   ├── auth.js           # Register, login, /me
│   │   ├── complaints.js     # Full CRUD + analytics
│   │   ├── feedback.js       # Citizen ratings
│   │   └── users.js          # Admin user management
│   ├── uploads/              # Uploaded complaint images
│   ├── server.js             # Express entry point
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SubmitComplaint.jsx
│   │   │   ├── TrackComplaint.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminComplaints.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── utils/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── render.yaml               # Render deployment config
├── netlify.toml              # Netlify deployment config
└── package.json              # Root scripts
```

---

## ⚡ Run Locally (Step-by-Step)

### Prerequisites
- **Node.js** v18 or higher → https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** → https://git-scm.com/

### Step 1 — Clone or extract the project
```bash
# If using Git
git clone https://github.com/YOUR_USERNAME/civictrack.git
cd civictrack

# Or just cd into the extracted folder
cd civictrack
```

### Step 2 — Install backend dependencies
```bash
cd backend
npm install
cd ..
```

### Step 3 — Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 4 — Start the backend server
Open a terminal and run:
```bash
cd backend
npm run dev
```
You'll see:
```
🏙️  CivicTrack API running on http://localhost:5000
📊  Admin: admin@civictrack.gov.in / Admin@1234
👤  Demo:  demo@civictrack.in / User@1234
✅ Database initialized
✅ Sample data seeded
```

### Step 5 — Start the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
You'll see:
```
  VITE v5.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 6 — Open in browser
Visit: **http://localhost:5173**

---

## 🌐 Deploy to Web (Free Hosting)

### Option A: Render (Backend) + Netlify (Frontend) — RECOMMENDED

#### Deploy Backend to Render (Free)

1. Go to https://render.com and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo (push code to GitHub first)
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Region:** Singapore (closest to India)
5. Add Environment Variables:
   ```
   NODE_ENV = production
   JWT_SECRET = (click "Generate" for a secure random value)
   ADMIN_EMAIL = admin@civictrack.gov.in
   ADMIN_PASSWORD = Admin@1234
   FRONTEND_URL = https://YOUR-SITE.netlify.app
   ```
6. Click **"Create Web Service"**
7. Wait ~3 minutes. Copy your URL: `https://civictrack-api.onrender.com`

#### Deploy Frontend to Netlify (Free)

1. Go to https://netlify.com and sign up (free)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repo
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Add Environment Variable:
   ```
   VITE_API_URL = https://YOUR-RENDER-URL.onrender.com/api
   ```
6. Click **"Deploy site"**
7. Your app is live at `https://YOUR-SITE.netlify.app`

---

### Option B: Railway (Full Stack, Simplest)

1. Go to https://railway.app and sign up
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repo
4. Railway auto-detects Node.js
5. Set root to `backend`, add same env vars as above
6. For frontend: add a second service pointing to `frontend` with:
   - Build: `npm run build`
   - Start: `npx serve dist`

---

### Option C: Vercel (Frontend) + Render (Backend)

Same as Option A but use Vercel instead of Netlify for frontend:
1. Go to https://vercel.com
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add `VITE_API_URL` environment variable
5. Deploy

---

## 🔧 Push to GitHub First (Required for Cloud Deploy)

```bash
# In the civictrack root folder:
git init
git add .
git commit -m "Initial commit: CivicTrack civic complaint system"
git branch -M main

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/civictrack.git
git push -u origin main
```

---

## 🛠️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React 18, Vite, React Router  |
| Charts      | Recharts                      |
| Styling     | Pure CSS with CSS Variables   |
| HTTP Client | Axios                         |
| Backend     | Node.js, Express              |
| Database    | SQLite (better-sqlite3)       |
| Auth        | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer                        |
| Toasts      | React Hot Toast               |

---

## 📡 API Reference

| Method | Endpoint                              | Auth     | Description              |
|--------|---------------------------------------|----------|--------------------------|
| POST   | /api/auth/register                    | None     | Register new user        |
| POST   | /api/auth/login                       | None     | Login, get JWT token     |
| GET    | /api/auth/me                          | User     | Get my profile           |
| POST   | /api/complaints                       | User     | Submit complaint         |
| GET    | /api/complaints/my                    | User     | Get my complaints        |
| GET    | /api/complaints/track/:id             | None     | Track complaint (public) |
| GET    | /api/complaints                       | Admin    | Get all complaints       |
| PATCH  | /api/complaints/:id/status            | Admin    | Update status            |
| DELETE | /api/complaints/:id                   | Admin    | Delete complaint         |
| GET    | /api/complaints/admin/analytics       | Admin    | Dashboard analytics      |
| POST   | /api/feedback                         | User     | Submit feedback          |
| GET    | /api/feedback/:complaint_id           | User     | Get feedback             |
| GET    | /api/users                            | Admin    | List all users           |
| PATCH  | /api/users/:id/toggle                 | Admin    | Block/activate user      |

---

## ✅ Features Implemented

- [x] User registration & login with JWT
- [x] Complaint submission with image upload
- [x] Issue type selector (Street Light, Water Leakage, Rainwater)
- [x] Area/location selection
- [x] Priority levels (High, Normal, Low)
- [x] Complaint status tracking (Pending → In Progress → Resolved/Invalid)
- [x] Full status timeline with history
- [x] Admin dashboard with live charts (bar + pie)
- [x] Admin complaint management with search, filter, pagination
- [x] Admin status update modal with notes
- [x] Admin user management (block/activate)
- [x] Citizen feedback & star rating system
- [x] Public complaint tracking (no login needed)
- [x] Responsive design (mobile + desktop)
- [x] Protected routes (user/admin)
- [x] Demo login buttons for quick testing

---

## 🔒 Security Notes for Production

1. Change `JWT_SECRET` to a long random string (32+ chars)
2. Change admin password in `.env`
3. Set `FRONTEND_URL` to your actual frontend domain (CORS)
4. Use HTTPS (handled automatically by Render/Netlify/Vercel)
5. For production SQLite, ensure the server has persistent disk storage (Render free tier resets disk — use Railway or a VPS for permanent data, or migrate to PostgreSQL)

---

## 🐘 Upgrade to PostgreSQL (Optional)

If you need persistent storage on free cloud hosts, replace SQLite with PostgreSQL:

1. Install: `npm install pg` in backend
2. Sign up at https://neon.tech (free PostgreSQL)
3. Update `db/database.js` to use `pg` instead of `better-sqlite3`
4. Add `DATABASE_URL` env var from Neon dashboard

# 🛣️ RoadFix — Citizen Road Issue Reporting Platform

> A premium full-stack web application that empowers citizens to report road infrastructure problems—potholes, blocked drains, broken streetlights—with live map pinning, image uploads, real-time community interaction, and a professional admin dashboard.

---

## ✨ Features

- 📍 **Live Map Pinning** — Pin exact locations using an interactive Leaflet map.
- 📸 **Image Upload** — Attach photos of issues directly from your device.
- 🔐 **Role-Based Authentication** — Dynamic login for **Citizens** and **Admins**.
- 📊 **Real-Time Dashboard** — Live updates via **Socket.io** (No page refreshing needed!).
- 💬 **Community Discussion** — Citizens can comment on reports to provide local context.
- 📢 **Official Updates** — Admins can post progress notes and change report status.
- 🛡️ **Audit Logging** — Every admin action is tracked for full transparency.
- 🌙 **Modern UI** — Sleek Glassmorphism design with Dark/Light mode support.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas Cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhuumika07/road_fix.git
   cd road_fix
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the `backend/` folder:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/roadfix
   ```

4. **Start the App**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to begin.

---

## 🗂️ Project Architecture

```
road_fix/
├── backend/
│   ├── config/          # DB connection setup
│   ├── controllers/     # Business logic (Mongoose/Socket logic)
│   ├── models/          # MongoDB Schemas (User, Report, Audit, etc.)
│   ├── routes/          # Express API endpoints
│   ├── middleware/      # Role-based access control
│   └── server.js        # Entry point
└── frontend/
    ├── css/             # Glassmorphic Design System
    ├── js/              # Real-time UI logic
    └── *.html           # Semantic views
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, Vanilla CSS, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Real-time** | Socket.io |
| **Mapping** | Leaflet.js + OpenStreetMap |
| **Styling** | Custom CSS (Glassmorphism, CSS Variables) |

---

## ☁️ Deployment Guide

### 1. Database (MongoDB Atlas)
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Whitelist `0.0.0.0/0` in Network Access.
- Get your connection string and update your production `MONGO_URI`.

### 2. Hosting (Render / Heroku)
- Connect your GitHub repo to **Render** or **Railway**.
- Set the **Root Directory** to `./backend` (or use a start script that points to the backend).
- Add your Environment Variables (`MONGO_URI`, `PORT`) in the hosting dashboard.

---

## 👩‍💻 Author

**BHUMIKA**
- GitHub: [bhuumika07](https://github.com/bhuumika07)

---

> *RoadFix — Making roads safer, one report at a time.* 🛣️

# SocialHub AI

> **Create Once. Publish Everywhere.**

SocialHub AI is an AI-powered social media management platform built as a semester-long enterprise MERN application. This repository contains **Experiment 1.1.1 — Dynamic Multi-Platform Post Composer (Version 1.0)**.

---

## 🚀 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router DOM, Axios |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose                       |
| Styling    | Vanilla CSS with CSS Custom Properties  |

---

## 📁 Repository Structure

```
SocialHub-AI/
├── client/                   ← Vite + React frontend
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Header/
│       │   ├── PlatformCard/
│       │   ├── CharacterCounter/
│       │   ├── HashtagCounter/
│       │   ├── MediaUpload/
│       │   ├── ValidationPanel/
│       │   └── Toast/
│       ├── pages/
│       │   └── ComposerPage/
│       ├── services/         ← Axios API wrapper
│       ├── hooks/            ← useComposer custom hook
│       ├── context/          ← AppContext (toast + future auth)
│       ├── utils/            ← validators.js, constants.js
│       └── styles/           ← CSS design tokens + global styles
├── server/                   ← Express REST API
│   ├── config/               ← db.js (MongoDB connection)
│   ├── controllers/          ← postController.js
│   ├── middleware/           ← errorHandler.js, validatePost.js
│   ├── models/               ← Post.js (Mongoose schema)
│   ├── routes/               ← postRoutes.js
│   ├── services/             ← postService.js (business logic)
│   ├── utils/                ← validators.js (mirrors frontend)
│   ├── uploads/              ← local media storage (dev only)
│   └── server.js             ← Express entry point
├── .gitignore
├── README.md
└── package.json              ← Root workspace scripts
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** (local or Atlas)

### 1. Clone and install

```bash
git clone <repo-url>
cd SocialHub-AI
npm run install:all
```

### 2. Configure environment

```bash
# Server
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialhub_ai
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/socialhub_ai`

### 3. Run development servers

```bash
npm run dev
```

This starts both:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🌐 API Endpoints

| Method | Endpoint      | Description                         |
|--------|---------------|-------------------------------------|
| GET    | `/api/health` | Health check                        |
| POST   | `/api/posts`  | Create a new post (multipart/form)  |
| GET    | `/api/posts`  | Retrieve paginated posts            |

### POST `/api/posts` — Request body (multipart/form-data)

| Field               | Type       | Required | Description                                |
|---------------------|------------|----------|--------------------------------------------|
| `content`           | `string`   | ✔        | Post text content                          |
| `selectedPlatforms[]` | `string[]` | ✔       | `twitter`, `facebook`, `instagram`, `linkedin` |
| `image`             | `File`     | ✗        | Image file (JPEG, PNG, GIF, WebP, max 10MB) |
| `video`             | `File`     | ✗        | Video file (MP4, MOV, WebM, max 50MB)      |

### GET `/api/posts` — Query params

| Param   | Default | Description       |
|---------|---------|-------------------|
| `page`  | `1`     | Page number       |
| `limit` | `10`    | Items per page    |

---

## 📐 Platform Rules

| Platform  | Char Limit | Images | Videos | Max Hashtags |
|-----------|-----------|--------|--------|--------------|
| X (Twitter) | 280     | ✔      | ✔      | Unlimited    |
| Facebook  | 63,206    | ✔      | ✔      | Unlimited    |
| Instagram | 2,200     | ✔      | ✔      | 30           |
| LinkedIn  | 3,000     | ✔      | ✖      | 5            |

---

## 🎨 Features (Experiment 1.1.1)

- **Multi-platform Post Composer** — write once, validate for all selected platforms
- **Real-time Character Counter** — circular arc, colour-coded (green → orange → red)
- **Live Hashtag Counter** — regex-based detection
- **Platform Selection Cards** — toggle multiple platforms with visual feedback
- **Media Upload** — drag-and-drop + file picker, image preview, video filename preview
- **Validation Panel** — per-platform status (Ready ✔ / Warning ⚠ / Error ✖)
- **Smart Publish Button** — disabled until all platforms pass validation
- **Clear + Copy actions**
- **Toast Notifications** — success/error/info feedback
- **Responsive Layout** — desktop two-col, tablet, mobile single-col with sticky action bar

---

## 🔮 Future Experiments (Extension Points)

The following modules are stubbed and ready for implementation:

| Experiment | Module                    |
|------------|---------------------------|
| 1.1.2      | User Authentication + JWT |
| 1.1.3      | AI Caption Generator      |
| 1.1.4      | AI Hashtag Generator      |
| 1.1.5      | Content Scheduling        |
| 1.1.6      | Analytics Dashboard       |
| 1.1.7      | Team Collaboration        |
| 1.1.8      | Notifications             |
| 1.1.9      | Cloud Media Storage       |

---

## 🛠️ Available Scripts

| Command              | Description                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Start both client and server in development mode |
| `npm run dev:client` | Start client only (port 5173)                   |
| `npm run dev:server` | Start server only (port 5000)                   |
| `npm run install:all`| Install all dependencies for root, client, server|
| `npm run build`      | Build the production client bundle               |

---

## 📋 Coding Standards

- **Modular architecture** — strict separation of concerns
- **Environment variables** — no hardcoded secrets
- **Server-side validation** — never trust the frontend alone
- **Consistent error handling** — centralised error middleware
- **Reusable utilities** — shared validation logic (mirrored FE/BE)
- **Future-proof comments** — extension points documented throughout

---

*SocialHub AI — Experiment 1.1.1 | Version 1.0.0*

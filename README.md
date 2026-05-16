# 🚀 Portfolio 3D — Fullstack Developer Portfolio

A production-grade fullstack portfolio with a stunning 3D UI, JWT-protected Admin CMS, **MongoDB** database, and Docker deployment.

---

## 📁 Project Structure

```
portfolio-3d/
├── client/                    # React + Vite + TypeScript + Three.js
│   └── src/
│       ├── components/        # UI components (Hero, Skills, Projects…)
│       ├── context/           # AuthContext (JWT in memory)
│       ├── data/              # Fallback data (projects, skills, experience)
│       ├── hooks/             # Custom hooks (useTilt, useContactForm…)
│       ├── pages/             # Portfolio page + all Admin pages
│       ├── styles/            # globals.css, animations.css, admin.css
│       └── types.ts           # Shared TypeScript interfaces
│
├── server/                    # Node.js + Express + TypeScript + MongoDB
│   └── src/
│       ├── db/
│       │   ├── db.ts          # Mongoose connection
│       │   └── schema.ts      # Mongoose models (Message, Setting, DataStore)
│       ├── middleware/        # requireAdmin, rateLimiter, cors
│       ├── routes/            # All API routes
│       └── services/          # mailer, githubApi, cache
│
├── docker/
│   ├── Dockerfile.client      # Nginx + Vite build
│   ├── Dockerfile.server      # Node Alpine
│   └── nginx.conf             # SPA fallback + API proxy
│
├── .github/workflows/
│   └── deploy.yml             # CI/CD GitHub Actions
├── docker-compose.yml         # client + server + mongo containers
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js 20+** and **npm 10+**
- **MongoDB** running locally (`mongod`) — or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI

---

### 1. Clone the repo

```bash
git clone https://github.com/raavanaa/portfolio-3d.git
cd portfolio-3d
```

---

### 2. Set up the Server

```bash
cd server
cp .env.example .env
# Fill in your values — see Environment Variables section below
npm install
npm run dev
```

> Server starts on **http://localhost:5000**
> MongoDB connection is established automatically on startup.

---

### 3. Set up the Client

```bash
cd client
npm install
npm run dev
```

> Client starts on **http://localhost:3000**
> Vite proxies all `/api/*` requests → `http://localhost:5000`

---

### 4. URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | 🌐 Public portfolio |
| `http://localhost:3000/admin/login` | 🔐 Admin CMS login |
| `http://localhost:5000/api/health` | ✅ Server health check |

---

## 🔐 Environment Variables

Copy `server/.env.example` → `server/.env` and fill in:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/portfolio` |
| `ADMIN_EMAIL` | Admin login email | `admin@srilambo.com` |
| `ADMIN_PASSWORD` | Admin login password | `super_secure_password` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `a_very_long_random_string` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `you@gmail.com` |
| `SMTP_PASS` | SMTP App Password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_TO` | Contact form recipient | `hello@srilambo.com` |
| `CLIENT_URL` | Frontend URL (CORS) | `https://srilambo.vercel.app` |
| `GITHUB_USERNAME` | Your GitHub username | `raavanaa` |
| `GITHUB_TOKEN` | Optional — raises rate limit to 5000/hr | `ghp_...` |

### MongoDB Atlas (Cloud)
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

### Gmail SMTP
Enable 2FA on your Google account and generate an [App Password](https://myaccount.google.com/apppasswords). Use that as `SMTP_PASS`.

---

## 🗄️ Database — MongoDB

The app uses **MongoDB** via **Mongoose** with three collections:

| Collection | Purpose |
|------------|---------|
| `messages` | Contact form submissions (name, email, subject, message, status) |
| `settings` | Portfolio settings (bio, social links, SEO) stored as key/value pairs |
| `datastores` | Projects, Skills, Experience stored as JSON blobs |

No migrations needed — Mongoose creates collections automatically on first use.

---

## 🛣️ API Routes

### Public

| Method | Path | Rate Limit | Description |
|--------|------|------------|-------------|
| `POST` | `/api/contact` | 5 / 15 min | Submit contact form |
| `GET` | `/api/github` | 100 / 15 min | GitHub profile stats (1 hr cache) |
| `GET` | `/api/settings` | 100 / 15 min | Public portfolio settings |
| `GET` | `/api/health` | — | Health check |

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Email + password → JWT (24 hr) |

### Admin *(Bearer JWT required)*

| Method | Path | Description |
|--------|------|-------------|
| `GET \| POST` | `/api/admin/projects` | Get / save projects |
| `GET \| POST` | `/api/admin/skills` | Get / save skills |
| `GET \| POST` | `/api/admin/experience` | Get / save experience |
| `GET` | `/api/admin/messages` | List all messages |
| `PUT` | `/api/admin/messages/:id` | Update status (new → read → replied) |
| `DELETE` | `/api/admin/messages/:id` | Delete message |
| `GET` | `/api/admin/settings` | Get all settings |
| `PUT` | `/api/admin/settings` | Upsert settings |

---

## 🧩 Admin CMS

Go to `/admin/login` and sign in using your `.env` credentials.

| Page | Path | Features |
|------|------|----------|
| Dashboard | `/admin/dashboard` | Quick-access overview |
| Projects | `/admin/projects` | Add / edit / delete — modal form |
| Skills | `/admin/skills` | Inline level slider + live bar preview |
| Experience | `/admin/experience` | Drag-to-reorder + right-side edit drawer |
| Messages | `/admin/messages` | Inbox with status badges + slide panel |
| Settings | `/admin/settings` | Bio, socials, SEO + live hero preview |

> **Security:** JWT tokens are stored **in React memory only** — they are wiped on page refresh by design. Re-login to restore access.

---

## ☁️ Free Hosting
Want to host this for free? Check out our [**Free Hosting Guide**](./hosting_guide.md) for a step-by-step walkthrough using MongoDB Atlas, Render, and Vercel.

---

## 🐳 Docker — Local Dev / Production

```bash
# From the repo root — starts client, server, and MongoDB:
docker compose up --build
```

| Container | Port | Description |
|-----------|------|-------------|
| `client` | 3000 | Nginx serving built Vite app |
| `server` | 5000 | Node.js Express API |
| `mongo` | 27017 | MongoDB 7 with persistent volume |

MongoDB data is persisted in a Docker named volume (`mongo_data`) — it survives container restarts.

---

## 🚢 CI/CD — GitHub Actions

Workflow file: `.github/workflows/deploy.yml`

Triggers on push to `main`:
1. Installs and builds client + server
2. Builds Docker images
3. SSH-deploys to your production server

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Private key for SSH access to your server |
| `SERVER_HOST` | Production server IP or hostname |
| `SERVER_USER` | SSH username |

---

## 🛠️ Tech Stack

### Client
| Package | Purpose |
|---------|---------|
| React 18 + Vite | UI framework + lightning-fast build tool |
| TypeScript | Full type safety across the app |
| Three.js + @react-three/fiber | 3D particle canvas + rotating skill sphere |
| @react-three/drei | R3F helpers (Text labels, OrbitControls) |
| Framer Motion | Scroll-triggered animations |
| GSAP + ScrollTrigger | Advanced scroll animations |
| Tailwind CSS v4 | Utility-first styling |
| React Router v6 | Client-side routing (public + admin) |

### Server
| Package | Purpose |
|---------|---------|
| Node.js + Express | HTTP server framework |
| TypeScript | Type-safe backend |
| **Mongoose + MongoDB** | Database — ODM for MongoDB |
| jsonwebtoken | JWT auth signing + verification |
| Nodemailer | Contact form email + auto-reply |
| Zod | Runtime request validation |
| Helmet | HTTP security headers |
| express-rate-limit | Rate limiting (global + per-route) |
| CORS | Cross-Origin Resource Sharing policy |

---

## 📄 License

MIT © 2024 Raavanaa

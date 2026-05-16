# ☁️ Free Hosting Guide: Portfolio 3D

This guide outlines how to host your fullstack portfolio entirely for free using industry-standard cloud providers.

## 🏗️ The Free Stack
| Component | Service | Why? |
|-----------|---------|------|
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Free forever shared cluster (512MB). |
| **Backend** | [Render](https://render.com/) | Free tier for Node.js (Web Services). |
| **Frontend** | [Vercel](https://vercel.com/) | `srilambo.vercel.app` |

---

## 1. Database: MongoDB Atlas
1. **Create Account:** Sign up at [mongodb.com](https://www.mongodb.com/cloud/atlas/register).
2. **Build a Cluster:** Choose the **FREE** (M0) tier. Pick a region near you (e.g., AWS N. Virginia).
3. **Security:**
   - Create a database user (remember the username and password).
   - In **Network Access**, click "Add IP Address" and select **Allow Access from Anywhere** (`0.0.0.0/0`). This is necessary because Render/Vercel IPs change frequently.
4. **Get URI:** Click "Connect" -> "Drivers" -> Copy the connection string.
   - It looks like: `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/portfolio?retryWrites=true&w=majority`

---

## 2. Backend: Render
1. **Connect GitHub:** Create a [Render](https://render.com/) account and connect your GitHub.
2. **New Web Service:** Select your portfolio repository.
3. **Configure Service:**
   - **Name:** `portfolio-api`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/server.js`
4. **Environment Variables:**
   Add these in the "Environment" tab:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: (Your Atlas URI from Step 1)
   - `CLIENT_URL`: (Your Vercel URL - *come back to this after Step 3*)
   - `JWT_SECRET`: (A long random string)
   - `ADMIN_EMAIL`: (Your login email)
   - `ADMIN_PASSWORD`: (Your login password)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`: (For contact form)

---

## 3. Frontend: Vercel
1. **New Project:** Create a [Vercel](https://vercel.com/) account and import your repository.
2. **Configure Project:**
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
3. **Environment Variables:**
   - `VITE_API_URL`: (Your Render Web Service URL, e.g., `https://portfolio-api.onrender.com`)
4. **Deploy:** Click Deploy. Once finished, copy the provided `.vercel.app` URL (e.g., `srilambo.vercel.app`).

---

## 🔗 Final Connection (The "Loop")
Go back to your **Render** settings and update the `CLIENT_URL` environment variable with your new Vercel URL (`https://srilambo.vercel.app`). This ensures CORS allows the frontend to talk to the backend.

> [!NOTE]
> **Render Free Tier Sleep:** Render's free tier spins down after 15 minutes of inactivity. The first request after a long time may take 30-50 seconds to load the backend. Your portfolio will show a "Loading..." screen during this time.

---

## 📝 Required Code Changes (Already Applied)
To make this work, the following changes were made to your code:
1. Created `client/src/utils/api.ts` to handle dynamic API URLs via `VITE_API_URL`.
2. Updated all `fetch` calls in the client to use the `getApiUrl()` utility.
3. Ensured the backend `cors` middleware uses the `CLIENT_URL` environment variable.

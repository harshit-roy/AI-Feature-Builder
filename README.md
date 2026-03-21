# 🚀 AI Feature Builder

A full-stack AI-powered platform that converts natural language prompts into **interactive React UI pages**, with admin-controlled approval, preview, and deployment workflows.

---

## 🌐 Live Demo
- 🔗 Frontend: *(Add your Vercel link here)*
- 🔗 Backend API: *(Add your Render link here)*

---

## 📌 Problem Statement

Building UI components and feature pages repeatedly is time-consuming and inefficient.

This project solves that by allowing users to:
- Describe a feature in plain English
- Generate UI instantly using AI
- Review, edit, and deploy via an admin workflow

---

## 💡 Solution

AI Feature Builder enables a **Prompt → Generate → Review → Deploy** pipeline.

Users submit feature ideas →  
Admin reviews →  
AI generates React UI →  
Preview → Deploy → Public page

---

## 🧠 Key Features

### 👤 User Side
- 🔐 Authentication (JWT-based)
- ✍️ Submit feature prompts
- 📊 Track request status (Pending, Generating, Approved, Deployed)
- 🧾 View request history
- 🚀 Access deployed pages

---

### 🛠️ Admin Side
- 📋 View all user requests
- ✅ Approve / ❌ Reject requests
- 🤖 Trigger AI code generation
- 👁️ Live preview (Sandpack)
- ✏️ Edit generated code
- 💾 Save updates
- 🚀 Deploy feature pages
- 🔄 Rollback deployments
- 🏷️ Edit display names

---

### ⚡ AI System
- Uses Gemini API for UI generation
- Generates **valid React functional components**
- Enforces:
  - No imports/exports
  - Single component output
  - Inline styling (no Tailwind in preview)
- Produces **responsive, interactive pages**

---

### 🌍 Public Pages
- Deployed pages accessible via:
  ```
  /live/:slug
  ```
- Fully dynamic rendering from stored code
- Error-safe rendering (fallback UI)

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS (main app UI)
- Sandpack (preview system)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI
- Gemini API

### Deployment
- Frontend: Vercel
- Backend: Render

---

## ⚙️ System Architecture

```
User Prompt
     ↓
Backend API
     ↓
Gemini AI → Generates React Code
     ↓
MongoDB (store request + code)
     ↓
Admin Panel
     ↓
Preview (Sandpack)
     ↓
Deploy → Public Route (/live/:slug)
```

---

## 🗂️ Project Structure

```
frontend/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── context/
  │   ├── api/
  │   └── assets/

backend/
  ├── routes/
  ├── controllers/
  ├── models/
  ├── middleware/
  └── config/
```

---

## 🔐 Authentication

- JWT-based authentication
- Role-based access:
  - User
  - Admin

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/ai-feature-builder.git
cd ai-feature-builder
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

Run backend:
```bash
npm run dev
```

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

### Frontend (Vercel)
Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Backend (Render)
- Add environment variables
- Ensure MongoDB Atlas connection is whitelisted

---

## ⚠️ Important Design Decisions

- ❌ Tailwind NOT used in generated pages (Sandpack limitation)
- ✅ Inline CSS / `<style>` used instead
- ✅ Single component generation to avoid runtime issues
- ✅ No external dependencies in generated code

---

## 🧪 Challenges Solved

- Handling dynamic JSX safely
- Preventing runtime crashes from AI-generated code
- Managing preview vs production rendering
- Designing admin-controlled deployment workflow
- Ensuring responsive UI from AI output

---

## 📈 Future Improvements

- ✨ Versioning of generated pages
- 🧠 AI prompt suggestions
- 🌙 Dark mode toggle
- 📤 Export generated code
- 📊 Analytics dashboard
- 🔍 Advanced search & filtering

---

## 👨‍💻 Author

**Harshit Roy**

- 💼 Full Stack Developer
- ⚛️ React | Node.js | AI Integrations
- 🚀 Passionate about building AI-powered products

---

## ⭐ Final Note

This project demonstrates:
- Full-stack development
- AI integration in real workflows
- Scalable architecture
- Production-level UI/UX design

---

## 📸 Screenshots *(Add these before final submission)*

- Landing Page  
- Dashboard  
- Admin Panel  
- Preview System  
- Live Pages  

---

## 📢 Tip

Before sharing:
- Add screenshots
- Add live links
- Pin this repo on GitHub
- Post on LinkedIn 🚀

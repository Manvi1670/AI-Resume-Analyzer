# 🧠 AI Resume Analyzer

**[Live Demo](https://ai-resume-analyzer-two-wine.vercel.app/)** · **[GitHub Repo](https://github.com/Manvi1670/AI-Resume-Analyzer)**

A full-stack AI career-prep platform that turns a resume and a target job description into a personalized interview strategy — skill-gap analysis, tailored technical and behavioral questions, a day-wise preparation plan, and an ATS-optimized resume rewritten for that specific role, generated as a downloadable PDF.

Instead of generic interview-prep content, every report is built around the actual overlap (and gap) between one candidate's background and one job posting, with the reasoning surfaced directly in the UI rather than buried in a single opaque score.

## ✨ Features

- 🔐 **Authentication** — JWT-based registration and login, with server-side token blacklisting on logout so revoked tokens can't be reused
- 📄 **Flexible Profile Input** — upload a resume (PDF/DOCX) or just describe your background in plain text; either is enough to generate a report
- 🎯 **AI-Powered Match Scoring** — Gemini scores how well a candidate's profile fits a given job description
- 🧩 **Skill Gap Detection** — missing or weak skills are surfaced individually, each tagged with a severity level (low/medium/high) based on how much it matters for the role
- 💬 **Tailored Interview Questions** — separate technical and behavioral question sets, each with the interviewer's likely intent and guidance on how to answer well
- 🗓️ **Day-Wise Preparation Plan** — a structured, multi-day study plan with concrete daily tasks built around the candidate's specific gaps
- 📑 **ATS-Optimized Resume Generation** — a resume rewritten around the target job description, rendered server-side to a downloadable PDF via Puppeteer
- 🕓 **Report History** — every generated report is saved and revisitable from the dashboard

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router — deployed on Vercel |
| **Backend** | Node.js, Express.js, JWT auth (`bcrypt`, `jsonwebtoken`) with token blacklisting — deployed on Render |
| **Database** | MongoDB Atlas (Mongoose) |
| **AI** | Google Gemini API (`@google/genai`), structured JSON output validated against a Zod schema |
| **PDF Generation** | Puppeteer (`puppeteer-core` + `@sparticuz/chromium` for serverless-compatible headless Chrome) |
| **File Upload** | Multer (in-memory storage, PDF parsing via `pdf-parse`) |

## 🏗️ Architecture

```
React frontend (Vercel)
        │  resume + job description + self description
        ▼
Express API (Render)
        │
        ├── JWT auth middleware + token blacklist check
        │
        ├── Multer → parse uploaded resume (pdf-parse)
        │
        ▼
Gemini API  ──►  structured JSON report (Zod-validated schema)
        │        match score · skill gaps · questions · prep plan
        ▼
MongoDB Atlas  (interview reports persisted per user)
        │
        ▼
Puppeteer + Chromium  ──►  ATS-optimized resume PDF (on demand)
```

## 🧠 How a Report Is Generated

1. The candidate provides a **target job description** (required) and either a **resume file** or a **quick self-description**.
2. If a resume is uploaded, its text is extracted server-side before being sent to the model — the raw file never reaches Gemini directly.
3. Gemini is prompted with the resume/self-description, self-description, and job description together, and constrained to return JSON matching a strict Zod schema — no free-form text parsing on the response.
4. The structured result (match score, technical/behavioral questions, skill gaps with severity, and a day-wise prep plan) is persisted to MongoDB against the logged-in user and rendered in the UI.
5. On request, the same context is used to generate a tailored, ATS-friendly resume as HTML, which Puppeteer converts server-side into a downloadable PDF.

## 📌 Local Setup

```bash
git clone https://github.com/Manvi1670/AI-Resume-Analyzer.git
```

**Backend:**
```bash
cd AI-Resume-Analyzer/backend
npm install
npm run dev
```
Create a `.env` in `backend/` with:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**Frontend:**
```bash
cd AI-Resume-Analyzer/frontend
npm install
npm run dev
```
Optionally create a `.env` in `frontend/` with:
```
VITE_API_URL=http://localhost:3000
```
(defaults to `http://localhost:3000` if omitted)

## 🔑 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Log in with email and password | Public |
| `GET` | `/api/auth/logout` | Clear session cookie and blacklist the token | Public |
| `GET` | `/api/auth/get-me` | Get the currently logged-in user | Private |
| `POST` | `/api/interview/` | Generate a new interview report (resume + job description) | Private |
| `GET` | `/api/interview/` | Get all interview reports for the logged-in user | Private |
| `GET` | `/api/interview/report/:interviewId` | Get a single interview report by ID | Private |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate and download a tailored resume PDF | Private |

## 🚀 Deployment Notes

- **Frontend** is deployed on Vercel with `VITE_API_URL` pointed at the live backend.
- **Backend** is deployed on Render, with `CLIENT_URL` set to the exact production frontend origin (required for CORS) and cookies configured with `secure: true` / `sameSite: "none"` in production for cross-domain auth to work.
- **PDF generation** uses `@sparticuz/chromium` + `puppeteer-core` rather than full `puppeteer`, since Render's build environment doesn't ship the system libraries a standard Chromium download needs.

## 👩‍💻 Author

**Manvitha** — [github.com/Manvi1670](https://github.com/Manvi1670)

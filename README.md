⚠️ Note: This project is a work in progress and may contain build/runtime errors. Some features are incomplete or under active development, and code refactoring is ongoing.

# SafeDocs – Secure File Sharing Platform (MERN + NestJS)

SafeDocs is a secure file sharing application designed with modern web technologies and security best practices.  
It allows authenticated users to upload, list, and download their files, while enabling administrators to manage all user files from a central dashboard.

---

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC) with `admin` and `user` roles

- **File Management**
  - Secure file uploads with Multer
  - Metadata storage (original name, stored name, MIME type, size)
  - User-specific file access restrictions
  - Admin access to all files

- **Security**
  - OWASP Top 10 mitigations:
    - Input validation
    - Secure headers with Helmet
    - XSS prevention
    - Rate limiting
    - CORS restrictions
  - Password hashing with bcrypt

- **Frontend**
  - React + Vite frontend
  - Login & Dashboard UI
  - File upload and download
  - Admin toggle for viewing all files

---

## 🛠 Tech Stack

**Backend**
- NestJS
- TypeORM
- PostgreSQL / MySQL (configurable)
- Multer for file uploads
- JWT for authentication
- Helmet, CORS, express-rate-limit, xss-clean

**Frontend**
- React (Vite)
- Axios
- React Router DOM

---

## 📂 Project Structure

safeDocs/
├── backend/ # NestJS API
│ ├── src/
│ │ ├── auth/ # Auth & JWT strategy
│ │ ├── files/ # File entity, service, controller
│ │ └── app.module.ts
│ └── uploads/ # Local file storage (gitignored)
└── client/ # React frontend
├── src/
│ ├── pages/ # Login & Dashboard
│ ├── api.js # Axios instance
│ └── App.jsx


---

## ⚡ Installation & Running

### 1️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update DB credentials and JWT_SECRET in .env
npm run start:dev

Frontend Setup

cd client
npm install
cp .env.example .env
# Set VITE_API_BASE=http://localhost:3000
npm run dev


🔑 Default API Endpoints
Auth

POST /auth/login – Authenticate user & receive JWT

Files

POST /files/upload – Upload a file (Auth required)

GET /files – List current user's files

GET /files/:id/download – Download user's file

GET /files/admin/all – List all files (Admin only)

📌 Notes

This project is a demo implementation and can be extended with cloud storage (e.g., AWS S3) and enhanced security features.

The current setup stores files locally under backend/uploads/ (excluded from Git).

Role-based access is enforced in backend controllers using custom @Roles() decorator and RolesGuard.


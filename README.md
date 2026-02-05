# DMC Learn

Proprietary MERN learning platform (frontend + backend). This repository contains a Vite + React frontend and an Express + MongoDB backend implementing a course marketplace / learning management system.

> WARNING: This codebase is proprietary. Do not copy, redistribute, or modify without explicit written permission. See `License.md` for details.

## What this repository contains
- Frontend: React (Vite), React Router, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- Payment integration via Razorpay
- Cloudinary integration for media uploads
- Email notification templates (Nodemailer)

## Key Features
- User authentication and roles (Student / Instructor / Admin)
- Profile management (display picture, personal details)
- Course creation, catalog, and enrollment
- Course progress tracking
- Payment capture and verification

## Folder layout (high level)
- `src/` — Frontend application (components, pages, Redux slices, services)
- `server/` — Backend (controllers, routes, models, utils, configs)
- `public/` — static assets

## Prerequisites
- Node.js v16+ and npm
- MongoDB (Atlas or local)
- Cloudinary account (for uploads)
- Razorpay account (for payments)

## Environment variables
Create a `.env` file inside the `server/` folder with the following variables (do not commit `.env`):

- `MONGODB_URL`
- `PORT` (optional)
- `JWT_SECRET`
- `FOLDER_NAME` (Cloudinary folder)
- `CLOUD_NAME`, `API_KEY`, `API_SECRET` (Cloudinary)
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD`
- `RAZORPAY_KEY`, `RAZORPAY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

## Install & Run (development)
From repository root:

```bash
npm install
npm run dev
```

This runs client and server concurrently (`dev:client` uses Vite, `dev:server` runs nodemon in `server/`).

Server only:

```bash
cd server
npm install
npm run dev
```

Frontend only:

```bash
npm install
npm run dev:client
```

## Build (production)

```bash
npm run build
```

## Important endpoints
Check `server/routes/` and `server/controllers/` for full details. Notable endpoints:
- `/api/v1/auth` - login/signup
- `/api/v1/profile` - profile update, display picture, delete account
- `/api/v1/payments` - capture payments and signature verification

## Notes on deletion & cleanup
The backend `deleteAccount` handler removes the user and performs cleanup:
- Removes the user from `Course.studentsEnrolled`
- Deletes `CourseProgress` documents for the user
- Deletes the linked `Profile` document
- Deletes the `User` document

## Troubleshooting
- If profile updates do not appear immediately, verify network requests and that the backend returned `success: true`.

## Contribution & Contact
This repository is private/proprietary. To request access, permission, or report issues, contact: naval@thedatamaster.in

---

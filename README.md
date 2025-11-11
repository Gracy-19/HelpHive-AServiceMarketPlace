# 🐝 HelpHive – Service Marketplace

A modern full-stack platform that connects customers with skilled service providers — tutors, plumbers, electricians, cleaners, mechanics, and more.

✅ **Live Demo:** https://help-hive-a-service-market-place-ao.vercel.app/  
✅ **Frontend:** React + Vite  
✅ **Backend:** Node.js + Express + MongoDB  
✅ **Auth:** Clerk  
✅ **Media Storage:** Cloudinary  
✅ **Deployment:** Vercel (Frontend) + Render (Backend)

---

## 🌟 Overview

HelpHive is a service marketplace designed to simplify the process of finding and booking service providers.  
Users can browse workers, view ratings, and book services online.  
Workers can register, upload documents/photos, and manage details.

The platform includes a booking system, secure authentication, responsive UI, and organized user/worker dashboards.

---

## ✨ Features

### ✅ User Features
- Secure login/signup via **Clerk**
- Browse & search service providers
- View worker details, reviews & pricing
- Book services online
- Auto-calculated service price
- User dashboard with booking history
- Update profile & mobile number

### ✅ Worker Features
- Worker registration form
- Cloudinary image/file uploads
- Manage profile information
- Rating system
- View personal details

### ✅ Platform Features
- REST API using Express + MongoDB
- Booking system + status updates
- Advanced search & filtering
- Fully responsive UI
- Clean React architecture

---

## 📦 Project Structure
```
helphive/
│
├── helphive-backend/
│ ├── server.js
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── .env
│
└── helphive-frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── layouts/
│ └── App.jsx
└── .env.local
```


---

# 🚀 Getting Started

## ✅ 1. Clone the repository
```bash
git clone https://github.com/yourusername/helphive.git
cd helphive
```

# 🛠 Backend Setup (Node + Express)
## 1. Navigate to backend
```
cd helphive-backend
```
## 2. Install dependencies
```
npm install
```
## 3. Create .env
```
PORT=4000
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```
## 4. Start backend server
```
npm run dev
```

# 🎨 Frontend Setup (React + Vite)
## 1. Navigate to frontend
```
cd helphive-frontend
```

## 2. Install dependencies
```
npm install
```
## 3. Create .env.local
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000
```
## 4. Start development server
```
npm run dev
```
# 🚀 Deployment
## ✅ Frontend Deployment (Vercel)

### The live frontend is available at:
👉 https://help-hive-a-service-market-place-ao.vercel.app/



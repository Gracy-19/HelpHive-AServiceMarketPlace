# 🐝 HelpHive – Service Marketplace  
A modern full-stack platform that connects customers with skilled service providers such as tutors, plumbers, electricians, cleaners, and more.

Built with:  
**React (Vite) • Node.js • Express • MongoDB • Clerk Auth • Cloudinary • TailwindCSS • Render Deployment**

---

## ✨ Features

### ✅ User Features
- Secure login & signup using Clerk  
- Browse and search service providers  
- View provider details and ratings  
- Book services online  
- Auto-calculated pricing  
- Dashboard with booking history  
- Update phone and profile information  

### ✅ Worker Features
- Worker application form  
- Cloudinary image uploads  
- Rating system  
- Manage personal details  

### ✅ Platform Features
- REST API with MongoDB  
- Booking system with status updates  
- Responsive modern UI  
- Search + filtering  
- Profile management  

---

## 📁 Project Structure

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



---

# 🚀 Getting Started

## ✅ Clone the repository
```bash
git clone https://github.com/yourusername/helphive.git
cd helphive
```

## 🛠 Backend Setup (Node + Express)
# 1. Navigate to backend
```
cd helphive-backend
```

# 2. Install dependencies
```
npm install
```

# 3. Create .env
```
PORT=4000
MONGO_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

# 4. Start backend server
```
npm run dev
```
## 🎨 Frontend Setup (React + Vite)

# 1. Navigate to frontend
```
cd helphive-frontend
```
# 2. Install dependencies
```
npm install
```
# 3. Create .env.local
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=http://localhost:4000
```
# 4. Start development server
```
npm run dev
```

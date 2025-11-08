# HelpHive - Service Marketplace Frontend

A modern, fully-functional React-based service marketplace application built with Vite, React Router, and Tailwind CSS.

## 🎯 Project Overview

HelpHive is a platform that connects users with trusted service providers (maids, babysitters, cooks, tutors, etc.) for quick and reliable home services.

## ✨ Completed Features

### 1. **Authentication System**
- ✅ User Login with email & password
- ✅ User Signup with validation
- ✅ Password confirmation
- ✅ Persistent login using localStorage
- ✅ Protected routes for authenticated users
- ✅ Logout functionality

### 2. **Home Page**
- ✅ Hero section with CTA
- ✅ "How It Works" section (4-step process)
- ✅ Features showcase (6 key features)
- ✅ Call-to-action section
- ✅ Stats section showing platform metrics

### 3. **Service Search & Discovery**
- ✅ Search page with real-time filtering
- ✅ Filter by service type, name, or location
- ✅ Provider cards with ratings and reviews
- ✅ Provider detail page with full profile
- ✅ Easy link to booking from provider profile

### 4. **Booking System**
- ✅ Comprehensive booking form
- ✅ Service provider selection
- ✅ Date & time picker
- ✅ Duration selection
- ✅ Address and contact details
- ✅ Special instructions support
- ✅ Real-time price calculation
- ✅ Booking confirmation with success message

### 5. **User Dashboard**
- ✅ Personalized welcome message
- ✅ Quick stats cards (bookings, completed, spent)
- ✅ Booking history table
- ✅ Status tracking (Confirmed, Completed, etc.)
- ✅ Quick action buttons
- ✅ Responsive data display

### 6. **User Profile Management**
- ✅ View profile information
- ✅ Edit profile with validation
- ✅ Edit full name, phone, address
- ✅ Save changes to localStorage
- ✅ User statistics display
- ✅ Security & privacy settings section
- ✅ Edit mode toggle

### 7. **Service Provider Registration**
- ✅ Multi-section registration form
- ✅ Personal information collection
- ✅ Professional details (service type, rate, experience)
- ✅ Bio/description field
- ✅ File upload for profile photo
- ✅ Document upload for verification
- ✅ Terms & conditions agreement
- ✅ Submission confirmation

### 8. **Navigation & Layout**
- ✅ Sticky navbar with responsive design
- ✅ Logo & branding
- ✅ Navigation links
- ✅ User authentication status in nav
- ✅ Footer with copyright
- ✅ Main layout with Outlet for child routes
- ✅ Smooth transitions and hover effects

### 9. **Styling & UX**
- ✅ Tailwind CSS for all components
- ✅ Consistent color scheme (Indigo/Purple)
- ✅ Responsive design for all screens
- ✅ Professional cards and layouts
- ✅ Hover effects and transitions
- ✅ Form validation feedback
- ✅ Status badges with color coding
- ✅ Icons and emojis for visual appeal

## 📁 Project Structure

```
helphive-react/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── ProviderCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx (Authentication state management)
│   ├── data/
│   │   └── providers.js (Sample provider data)
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── Home.jsx (Landing page)
│   │   ├── Login.jsx (User login)
│   │   ├── Signup.jsx (User registration)
│   │   ├── Dashboard.jsx (User dashboard)
│   │   ├── Search.jsx (Service search)
│   │   ├── ProviderDetail.jsx (Provider profile)
│   │   ├── Booking.jsx (Booking form)
│   │   ├── Profile.jsx (User profile management)
│   │   └── WorkerRegister.jsx (Provider registration)
│   ├── App.jsx (Main app component with routes)
│   ├── main.jsx (Entry point)
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd helphive-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:5173
```

## 📦 Dependencies

- **React** 19.1.1 - UI library
- **React Router** 7.9.4 - Client-side routing
- **React DOM** 19.1.1 - React DOM rendering
- **Tailwind CSS** 4.1.14 - Utility-first CSS framework
- **Vite** 7.1.7 - Build tool and dev server

## 🎨 Design System

### Colors
- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#7C3AED)
- **Accent**: Pink, Yellow
- **Background**: Light indigo, white

### Typography
- **Headings**: Bold, dark gray (800)
- **Body**: Regular, gray (600-700)
- **Buttons**: Semibold, white text on colored background

## 🔐 Authentication Flow

1. User can sign up with email and password
2. Credentials are validated and stored
3. User logs in and is redirected to dashboard
4. Auth token stored in localStorage
5. Protected routes check authentication status
6. Logout clears session

## 💾 Data Storage

- User credentials and profile stored in localStorage
- Sample provider data in `/data/providers.js`
- Booking data simulated with state management
- No backend API integration (ready for backend connection)

## 🧪 Testing the App

### Test User Flow:
1. **Home Page**: Click "Get Started" to explore
2. **Sign Up**: Create account with email/password
3. **Search**: Browse service providers
4. **View Profile**: Click provider to see full details
5. **Book**: Select dates, times, and complete booking
6. **Dashboard**: View bookings and stats
7. **Profile**: Edit personal information

### Sample Providers (Pre-loaded):
- Priya Sharma - Babysitter (Delhi) - 4.8 ⭐
- Rekha Devi - Daily Maid (Lucknow) - 4.5 ⭐
- Aarti Joshi - Cook (Jaipur) - 4.9 ⭐

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile**: Optimized touch targets, stacked layouts
- **Tablet**: 2-column grids, medium spacing
- **Desktop**: 3-4 column grids, full features

## 🔄 Future Enhancements

- [ ] Backend API integration
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Chat with service providers
- [ ] Rating and review system
- [ ] Advanced filtering and search
- [ ] Provider verification documents
- [ ] Real-time location tracking
- [ ] Cancellation policies
- [ ] Insurance and guarantees

## 📄 Build for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist` folder with optimized files ready for deployment.

## 🐛 Troubleshooting

**White screen issue**: Check browser console for errors. Ensure all dependencies are installed with `npm install`.

**Port already in use**: Change port with `npm run dev -- --port 3000`

**Styling not loading**: Clear browser cache and restart dev server

## 📞 Support

For issues or questions, please check the component files for inline documentation.

---

**Happy coding! 🚀**

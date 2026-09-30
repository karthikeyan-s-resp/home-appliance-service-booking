# Online Home Appliance Service Booking System - MAIN

A complete, college-project-ready full-stack web application designed for booking doorstep home appliance repairs, servicing, and installations online. Built with **React + Vite**, **Node.js + Express.js**, and **MongoDB with Mongoose**.

---
# Online Home Appliance Service Booking System

## 🌟 Key Features

### 1. 👥 Multi-Role Architecture
- **Customer Role**: Register, browse categories, book services with customizable problem statements, time slots, address, view booking status tracker, and cancel pending bookings.
- **Technician Role**: Dedicated technician workbench, accept assigned jobs, progress lifecycle from Assigned → Accepted → In Progress → Completed, and log service diagnostic notes.
- **Admin Role**: System dashboard with live counter metrics (Total Customers, Technicians, Bookings, Pending, Completed), manage customer records, onboard technicians, full CRUD on appliance categories and service packages, assign technicians, and update/cancel bookings.

### 2. ⚡ Complete Booking Lifecycle
```
[Pending] ──(Admin Assigns)──> [Assigned] ──(Tech Accepts)──> [Accepted] ──(Tech Starts)──> [In Progress] ──(Tech Completes)──> [Completed]
    │                               │
    └──────(Customer Cancels)───────┴──────> [Cancelled]
```

### 3. 🛡️ Security & Simplicity
- Passwords securely hashed with **bcryptjs** (never stored or returned in plain text).
- Stateless **JWT** authentication with role-based access control middleware (`customer`, `technician`, `admin`).
- Responsive, modern UI with clean CSS design system, responsive navbar drawer, status badges, interactive workflow trackers, and quick demo login buttons.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Axios, Lucide React |
| **Styling** | Clean responsive CSS with design system variables & flex/grid |
| **Backend** | Node.js, Express.js, Morgan logger, CORS, Dotenv |
| **Database** | MongoDB with Mongoose ODM (includes embedded zero-config fallback) |
| **Security** | JWT (JSON Web Tokens), bcryptjs password hashing |

---

## 📁 Folder Structure

```
online-home-appliance-service/
├── client/                     # Frontend React + Vite app
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute, BookingStatusBadge, Tracker
│   │   ├── pages/              # Home, About, Services, Contact, Login, Register, Profile
│   │   │   ├── customer/       # CustomerDashboard, BookService, MyBookings, BookingDetails
│   │   │   ├── technician/     # TechnicianDashboard, TechnicianBookings, TechnicianDetails
│   │   │   └── admin/          # AdminDashboard, ManageBookings, Appliances, Services, Users
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── services/           # api.js Axios configuration & token interceptor
│   │   ├── context/            # AuthContext (login, register, logout, session persistence)
│   │   ├── App.jsx             # React Router route definitions
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Modern design system stylesheet
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── server/                     # Backend Node + Express app
│   ├── config/                 # db.js (MongoDB connection with smart fallback)
│   ├── controllers/            # auth, appliance, service, booking, user controllers
│   ├── middleware/             # authMiddleware (JWT protect & role authorization)
│   ├── models/                 # User, Appliance, Service, Booking Mongoose models
│   ├── routes/                 # Express REST API routes
│   ├── seed/                   # seed.js and seedHelper.js
│   ├── server.js               # Express application entrypoint
│   ├── .env.example
│   └── package.json
│
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas connection string; if local MongoDB is not running, the server automatically boots an embedded in-memory MongoDB engine for zero-configuration testing!)

### 2. Environment Variables Configuration

In `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/home_appliance_service
JWT_SECRET=super_secret_jwt_key_for_home_appliance_booking_2026
CLIENT_URL=http://localhost:5173
```

In `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Running the Application

### Running the Backend
From the `server` directory:
```bash
cd server
npm install
npm run seed     # (Optional: seeds sample users, appliances, services, and bookings)
npm start        # Starts server on http://localhost:5000
```

### Running the Frontend
From the `client` directory:
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

To build the client for production:
```bash
npm run build
```

---

## 🔑 Demo Credentials (Clickable in UI via "Quick Demo Logins")

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Admin** | `admin@example.com` | `Admin@123` | Full control: assign techs, manage bookings, appliances, services, view stats |
| **Technician 1** | `technician1@example.com` | `Admin@123` | View assigned jobs, update lifecycle stages, write service notes |
| **Technician 2** | `technician2@example.com` | `Admin@123` | View assigned jobs, update lifecycle stages, write service notes |
| **Customer** | `customer@example.com` | `Customer@123` | Book services, track statuses, cancel appointments, view history |

*(New customer accounts can also be created anytime from the `/register` page).*

---

## 🔌 API Overview

### Authentication
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get profile info
- `PUT /api/auth/profile` - Update profile / change password

### Appliances & Services
- `GET /api/appliances` - List all active appliances
- `POST /api/appliances` - (Admin) Create appliance
- `PUT /api/appliances/:id` - (Admin) Update appliance
- `DELETE /api/appliances/:id` - (Admin) Delete appliance & linked services
- `GET /api/services` - List services (optional `?appliance=id`)
- `POST /api/services` - (Admin) Create service package
- `PUT /api/services/:id` - (Admin) Update service
- `DELETE /api/services/:id` - (Admin) Delete service

### Bookings
- `POST /api/bookings` - Create booking (Customer)
- `GET /api/bookings/my` - List customer's bookings (Customer)
- `GET /api/bookings/assigned/me` - List assigned bookings (Technician)
- `GET /api/bookings/:id` - View booking details (Authorized roles)
- `PUT /api/bookings/:id/cancel` - Cancel pending booking (Customer / Admin)
- `GET /api/bookings` - List all bookings with filters (Admin)
- `PUT /api/bookings/:id/assign` - Assign technician (Admin)
- `PUT /api/bookings/:id/status` - Advance lifecycle & add notes (Technician / Admin)
- `DELETE /api/bookings/:id` - Remove booking record (Admin)
- `GET /api/bookings/stats/dashboard` - Get counter stats for cards (Admin)

### Users
- `GET /api/users` - List users by role (Admin)
- `GET /api/users/technicians` - List verified technicians (Admin & Customer)
- `POST /api/users` - Create user / onboard technician (Admin)
- `DELETE /api/users/:id` - Delete user account (Admin)

---

## 🎓 Academic Demonstration Highlights
- Clean modular directory layout separation (controllers, models, routes, middleware, services, components).
- Role-based route protection on both client (`ProtectedRoute`) and server (`authorize`).
- Zero console errors, responsive layout across desktop, tablet, and mobile screens.
## DevOps Integration

This project demonstrates Git, GitHub branching, Pull Requests and Jenkins Continuous Integration.
### New Feature
Customers can track their appliance service booking status.

## Latest Update
Improved appliance service booking workflow.

 # #   C I   U p d a t e 
 J e n k i n s   c o n t i n u o u s   i n t e g r a t i o n   v e r i f i e d .  
 
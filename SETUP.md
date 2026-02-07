# Quick Setup Guide

## Step 1: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
# Create .env file with these variables:
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_secret_key_here
```

4. Create admin account (optional - you can also use the register endpoint):
```bash
node scripts/createAdmin.js
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Step 2: Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 3: Access the Application

### User Flow
- Open `http://localhost:3000` in your browser
- You'll see the splash screen
- Select language (Tamil/English)
- Register/Login with:
  - Email & Password, OR
  - Mobile Number & OTP

### Admin Flow
- Navigate to `http://localhost:3000/admin/login`
- Login with:
  - Email: `admingov@gmail.com`
  - Password: `admingov123`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Replace `your_mongodb_atlas_connection_string_here` in `.env` file

Example connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/smartcity?retryWrites=true&w=majority
```

## Features Implemented

✅ User Flow:
- Splash Screen
- Language Selection (Tamil/English)
- Login/Registration (Email+Password or Mobile+OTP)
- Home Dashboard with statistics
- Raise Complaint with GPS location and media upload
- Complaint Confirmation
- My Complaints list
- Complaint Details with status timeline
- Notifications
- Feedback system
- Profile management

✅ Admin Flow:
- Admin Login
- Dashboard with statistics
- View all complaints
- Filter complaints by status/category
- Update complaint status
- Add officer remarks
- Upload resolution proof
- View user feedback

## Notes

- OTP is currently returned in API response for development. In production, integrate with Twilio.
- File uploads are stored in `backend/uploads/` directory
- Make sure MongoDB Atlas connection is working before starting the app
- Default admin credentials: admingov@gmail.com / admingov123

# Smart City Issue Tracker

A comprehensive web application for citizens to report city issues and for administrators to manage and resolve them.

## Features

### User Flow
- **Splash Screen**: App branding and loading
- **Language Selection**: Tamil/English support
- **Login/Registration**: Mobile OTP or Email/Password
- **Home Dashboard**: View statistics and quick actions
- **Raise Complaint**: Submit issues with location, photos, and description
- **My Complaints**: Track all submitted complaints
- **Complaint Details**: View status, timeline, and updates
- **Notifications**: Get updates on complaint status
- **Feedback**: Rate resolution satisfaction
- **Profile**: Manage user settings and preferences

### Admin Flow
- **Admin Login**: Secure admin authentication
- **Dashboard**: View complaint statistics
- **Manage Complaints**: View, filter, and update complaint status
- **Update Status**: Change complaint status and add remarks
- **Upload Resolution Proof**: Add proof images after fixing issues

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **File Storage**: Cloudinary (for images and videos)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for file storage)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string, Cloudinary credentials, and other configurations:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

5. Create `uploads` directory:
```bash
mkdir uploads
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Create Admin Account

To create an admin account, you can use the API endpoint:

```bash
POST http://localhost:5000/api/admin/register
Content-Type: application/json

{
  "email": "admin@city.gov",
  "password": "admin123",
  "name": "Admin User"
}
```

Or use the default credentials:
- Email: admin@city.gov
- Password: admin123

## Project Structure

```
smartcityissuetracker/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # Uploaded files
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP to mobile
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get complaint details
- `POST /api/complaints/:id/feedback` - Submit feedback
- `GET /api/complaints/stats/summary` - Get user statistics

### Admin
- `POST /api/admin/register` - Admin registration
- `POST /api/admin/login` - Admin login
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/status` - Update complaint status
- `POST /api/admin/complaints/:id/resolution-proof` - Upload resolution proof
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

## Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env` file:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

Files are automatically uploaded to Cloudinary and stored in:
- `smartcity/complaints/` - User complaint images/videos
- `smartcity/resolution-proof/` - Admin resolution proof images

## Notes

- OTP functionality currently returns OTP in response (for development). In production, integrate with Twilio or similar service.
- File uploads are stored in Cloudinary (not locally)
- Make sure to configure CORS properly for production
- Update MongoDB connection string and Cloudinary credentials in `.env` file
# SmartCityIssueTracker

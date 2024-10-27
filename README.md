# Currently Under Development

This is my first full-stack project.

## Getting Started

### Start the React App (Frontend) on Port 3000

To start the frontend (React app), navigate to the `client` directory and run the following commands:

```bash
cd client
npm install  
npm start   
```

The React app will be available on `http://localhost:3000`.

### Start the Server (Backend)

To start the backend server, navigate to the `server` directory and run the following commands:

```bash
cd server
npm install 
npm start    
```

The server will be running on `http://localhost:6969`.

> **Note:** MongoDB is expected to be running on port `27018`. Ensure that your MongoDB instance is running before starting the backend.

## Deployment Completed

The project has been deployed on the following URLs:

### Frontend URL:
- [https://chat-app-anmol.vercel.app](https://chat-app-anmol.vercel.app)

### Backend URL:
- [https://chat-app-qkx1.onrender.com](https://chat-app-qkx1.onrender.com)

## Environment Variables

For the project to function properly, make sure to configure the following environment variables:

### Frontend Environment Variables:

Create a `.env` file in the `client` directory with the following content:

```env
REACT_APP_BACKEND_URL=http://localhost:6969  # OR Your backend url
REACT_APP_BACKEND_SOCKET_URL=localhost:6969  
REACT_APP_FRONTEND_URL=
```

### Backend Environment Variables:

Create a `.env` file in the `server` directory with the following content:

```env
NODEMAIL_APP_PASSWORD=your_nodemailer_password
MONGODB_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000  # Replace with your deployed frontend URL
TOKEN_SECRET=YOUR_JWT_TOKEN_SECRET
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Real-time Communication**: Socket.IO
- **File Uploads**: Cloudinary,multer
- **Email Service**: Nodemailer

## Features

- Real-time chat functionality using Socket.IO.
- MongoDB database for user data and messages.
- File uploads using Cloudinary.
- Nodemailer integration for email services.
- React Media Recorder library + multer to record and send audio 
# TaskFlow – Smart Task Management System

TaskFlow is a full-stack task management web application designed to help users capture tasks quickly, prioritize clearly, and stay organized. It features a straightforward and secure authentication system, allowing users to safely manage and sync their tasks locally or in the cloud.

## Features

* Secure authentication (JWT)
* Task CRUD operations
* User-specific data
* Responsive UI
* Full-stack deployment

## Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas
* **Deployment:** Vercel (Frontend), Render (Backend)

## Live Demo

[View Live Demo Here](#) *(Replace with actual deployed link)*

## Installation (Local Setup)

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd TaskFlow
   ```

2. **Install dependencies**
   Setup the client (frontend):
   ```bash
   cd client
   npm install
   ```
   Setup the server (backend):
   ```bash
   cd ../server
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the `server/` directory:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the Application**
   Start the backend server (from the `server` directory):
   ```bash
   node index.js
   ```
   
   Start the frontend (from the `client` directory):
   ```bash
   npm run dev
   ```

## Folder Structure

```text
TaskFlow/
├── client/          # Frontend React (Vite) application
│   ├── public/      # Static assets
│   └── src/         # React components, pages, APIs, and styles
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── style.css
└── server/          # Backend Node.js/Express application
    ├── config/      # Database configuration
    ├── middleware/  # JWT authentication middlewares
    ├── models/      # Mongoose schemas (User, Task)
    ├── routes/      # Express API routes (Auth, Tasks)
    └── index.js     # Server entry point
```

## Future Improvements

* Email reminders
* Notifications
* Mobile UI improvements

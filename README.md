# ProConnect – Professional Networking Platform

A full-stack professional networking application inspired by LinkedIn, built using the MERN stack. ProConnect allows users to create professional profiles, connect with other professionals, share posts, interact with their network, and receive notifications.

## Overview

ProConnect is designed to provide a platform where professionals can build their online presence, showcase their skills and experience, share updates, and expand their professional network.

The application provides a responsive user interface and a RESTful backend with secure authentication, profile management, social connections, and post management.

## Features

### 1. User Authentication
- User registration and login.
- JWT-based authentication.
- HTTP-only cookie-based token storage.
- Protected routes and authenticated API requests.
- Secure password handling.

### 2. Profile Management
- Create and update professional profiles.
- Upload profile and cover images.
- Manage personal information and professional headlines.
- Add skills, education, and work experience.
- View other users' profiles.

### 3. Network & Connections
- Discover suggested professionals.
- Send connection requests.
- Accept or manage connection requests.
- View connected users.
- Manage pending connection requests.

### 4. Posts & Feed
- Create posts with text and images.
- Upload and display post images.
- View posts in a personalized feed.
- Display post authors and timestamps.

### 5. Notifications
- Receive notifications for relevant activities.
- View notification details.
- Delete individual notifications.
- Clear all notifications.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript (ES6+) |
| Styling | CSS, Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Image Upload | Multer, Cloudinary |
| API Architecture | REST APIs |
| Version Control | Git, GitHub |

## Project Structure

```text
ProConnect/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or later)
- MongoDB
- Cloudinary account
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd ProConnect
```

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_SERVER_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

*Note: Update environment variable names and npm scripts according to your actual project configuration.*

## API Structure

Base URL:

```text
/v1/api
```

### User APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/user/signup` | Register a new user |
| POST | `/user/signin` | Authenticate user |
| GET | `/user/currentUser` | Get logged-in user |
| PATCH | `/user/updateProfile` | Update user profile |
| GET | `/user/suggested` | Get suggested users |

### Post APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/post/getPost` | Fetch posts |
| POST | `/post/createPost` | Create a post |

### Notification APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notification/getNotifications` | Get notifications |
| DELETE | `/notification/deleteOne/:id` | Delete notification |
| DELETE | `/notification/deleteAll` | Delete all notifications |

*The API list is illustrative; verify endpoint names against your current Express routes.*

## Authentication Flow

ProConnect uses JWT-based authentication with HTTP-only cookies.

1. User submits login credentials.
2. Backend validates the credentials.
3. A JWT is generated containing the authenticated user's ID.
4. The token is stored in an HTTP-only cookie.
5. Authentication middleware validates the token.
6. Protected routes provide access to authenticated users.

## Image Upload Flow

Cloudinary is used for image storage.

1. User selects an image.
2. Frontend sends the image using `FormData`.
3. Multer processes the uploaded file.
4. Backend uploads the image to Cloudinary.
5. Cloudinary returns the secure image URL.
6. The image URL is saved in MongoDB.

## Deployment

The application is deployed using Render.

- **Frontend:** https://proconnect-1-dm7h.onrender.com
- **Backend:** https://proconnect-m0rx.onrender.com

## Learning Outcomes

Through this project, I have worked on:

- Building full-stack applications using the MERN stack.
- Implementing JWT-based authentication.
- Designing RESTful APIs using Express.js.
- Managing relational references using MongoDB and Mongoose.
- Handling image uploads using Multer and Cloudinary.
- Implementing user connections and notification workflows.
- Managing global application state using React Context API.
- Integrating frontend and backend using Axios.

## Future Enhancements

- Real-time messaging using Socket.IO.
- Like and comment functionality.
- Real-time notifications.
- Advanced user search and filtering.
- Pagination and optimized feed loading.
- Improved security and performance.

## Author

**Priti Maurya**

Full Stack Developer | MERN Stack Developer

- GitHub: https://github.com/priti16011996
- LinkedIn: https://www.linkedin.com/in/priti-maurya16/


---

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/facf4aeb-fdc8-4403-8dac-6a5031c9bc4a" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0a786fcd-ad34-45d4-9519-7f68affb42cf" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/9b8327a7-99bb-43bc-ae4c-cdb90f39e935" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/a2816a07-d0b7-4ef9-943b-e3a94d6683c5" />
<img width="1891" height="855" alt="image" src="https://github.com/user-attachments/assets/5d89cb96-18e4-4f12-b2f9-352df34062e2" />
<img width="1912" height="863" alt="image" src="https://github.com/user-attachments/assets/315fff8d-4ea5-4558-b9a0-0cf0e446ebdd" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/f50ca575-ccb3-41a6-a023-b5725bdbeec5" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/337ffe13-3dd3-4a4e-b9c6-70b0d04e0707" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fc7b5c15-8352-4204-a47f-abdd73d0b721" />
<img width="462" height="523" alt="image" src="https://github.com/user-attachments/assets/5ccb9c51-30a4-4e53-9b96-8fa1f7a7d542" />
<img width="1870" height="947" alt="image" src="https://github.com/user-attachments/assets/33c47881-1fd4-4756-8c5e-56db9fa1e6ae" />
<img width="1877" height="952" alt="image" src="https://github.com/user-attachments/assets/f50dc64d-d145-42cf-bfbe-222bcd7da416" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d87dfbf5-a105-4efc-90b4-de520517d63e" />
<img width="1883" height="937" alt="image" src="https://github.com/user-attachments/assets/4c5f9cde-2fe3-4a0d-92dc-a3246349085b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f9359887-c826-4819-ae7d-4f328015a9bc" />
<img width="1865" height="943" alt="image" src="https://github.com/user-attachments/assets/8e2f0d5b-4f58-46ea-8104-9b53d396cf07" />
<img width="1862" height="962" alt="image" src="https://github.com/user-attachments/assets/a091da01-9d56-4635-85f6-266fc24d550d" />
<img width="1882" height="982" alt="image" src="https://github.com/user-attachments/assets/8ed6a248-2b21-43f0-af52-1b8bf66a3195" />


















⭐ If you find this project interesting, consider giving it a star!

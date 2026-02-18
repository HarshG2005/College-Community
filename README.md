# College Community Platform

A unified digital platform for college students, faculty, and administrators to communicate, collaborate, and share academic and placement-related resources.

## 🚀 Features

- **Authentication System** - JWT-based auth with college email validation
- **Notice Board** - Digital announcements with categories, likes, and comments
- **Study Materials** - Upload/download notes with upvote/downvote system
- **Events** - Event creation, registration, and calendar
- **Placement Prep** - Interview experiences, resources, and job alerts
- **Real-time Chat** - Group discussions using Socket.io

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |

## 📁 Project Structure

```
colege_community_platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # React context (auth)
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── package.json
└── README.md
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/college_community
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Open in Browser

Visit: http://localhost:5173

## 📸 Screenshots

Coming soon...

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (admin)
- `PUT /api/notices/:id/like` - Like/unlike

### Study Materials
- `GET /api/materials` - Get all materials
- `POST /api/materials` - Upload material
- `PUT /api/materials/:id/vote` - Upvote/downvote

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id/register` - Register/unregister

### Placements
- `GET /api/placements` - Get all posts
- `POST /api/placements` - Create post

### Messages
- `GET /api/messages/:room` - Get messages
- `POST /api/messages` - Send message

## 👨‍💻 Author

Built as a Major Project for College.

## 📝 License

MIT License

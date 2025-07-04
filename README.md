# TaskFlow - Modern Todo Application

A beautiful, responsive todo application built with React, Node.js, and MongoDB. Features a modern UI with glass morphism effects, smooth animations, and intuitive task management.

## ✨ Features

- **Modern UI/UX**: Beautiful design with glass morphism effects and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Task Management**: Create, edit, delete, and update task status
- **Real-time Stats**: Visual dashboard showing task statistics
- **Status Tracking**: Track tasks as pending, in-progress, or completed
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Todo-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../todo-frontend
npm install
```

### 4. Environment Configuration
Update the MongoDB connection string in `backend/server.js` with your own MongoDB Atlas credentials.

### 5. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3000`

#### Start Frontend (Terminal 2)
```bash
cd todo-frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## 🎨 UI Features

### Design Highlights
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Gradient Effects**: Beautiful color gradients throughout the interface
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Modern Typography**: Clean, readable fonts with proper hierarchy

### Components
- **Navigation Bar**: Sticky header with app branding
- **Stats Dashboard**: Visual cards showing task statistics
- **Task Cards**: Individual task items with status indicators
- **Modal Forms**: Clean forms for adding/editing tasks
- **Status Badges**: Color-coded status indicators

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with side-by-side layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Stacked layouts with mobile-optimized controls

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## 🎯 Usage

1. **Create Tasks**: Click "Add New Task" to create a new task
2. **Edit Tasks**: Click the edit icon on any task card
3. **Update Status**: Use the dropdown to change task status
4. **Delete Tasks**: Click the delete icon to remove tasks
5. **View Stats**: See your progress in the stats dashboard

## 🎨 Customization

### Colors
The app uses a beautiful indigo-to-purple gradient theme. You can customize colors by modifying:
- `tailwind.config.js` for color palette
- CSS variables in `src/index.css`
- Component-specific color classes

### Animations
Custom animations are defined in `src/index.css`:
- `slide-down` - For dropdown menus
- `fade-in` - For content appearance
- `scale-in` - For modal animations
- `pulse-glow` - For loading states

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd todo-frontend
npm run build
```

### Backend (Heroku/Railway)
```bash
cd backend
# Add your MongoDB connection string to environment variables
## 📽️ Demo

Loom video demo: [Click here to watch](https://www.loom.com/share/b3dd1e9ee0ce4ac183ad624ce68e762b?sid=ab2ed8ff-3f93-4340-b1f8-80d5f910cb62)

```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a hackathon run by [Katomaran](https://www.katomaran.com).

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by productivity and task management best practices
- Special thanks to the Katomaran team for the hackathon opportunity

---

**Happy Tasking! 🎉**

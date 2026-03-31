# SmartMeal 🍽️

## 📖 Project Description
SmartMeal is a comprehensive web application designed to help users discover, organize, and plan their daily meals efficiently. With its modern and intuitive interface, users can browse various recipes, save their favorite dishes, and create customized weekly meal plans using an interactive drag-and-drop planner. Furthermore, SmartMeal automatically aggregates ingredients from the planned recipes to generate a smart shopping list, making grocery shopping hassle-free.

### Key Features:
- **Recipe Discovery**: Browse and search through a rich collection of recipes with different categories and cooking times.
- **Weekly Meal Planner**: Interactive drag-and-drop interface to plan Breakfast, Lunch, and Dinner for the whole week.
- **Smart Shopping List**: Automatically generate a compiled grocery list based on the chosen recipes for the week.
- **User Accounts**: Secure authentication system allows users to save recipes and persist their meal plans.
- **Responsive Design**: Smooth animations and a dynamic UI optimized for a premium user experience.

---

## 🛠️ Technologies Used

The project is built using the **MERN** stack (MongoDB, Express, React, Node.js):

### Frontend
- **React 19** (initialized via Vite) for building the user interface.
- **React Router** for Client-Side Routing.
- **Framer Motion** for smooth and dynamic micro-animations.
- **Axios** for handling API requests.
- **Vanilla CSS** with modern UI principles (Glassmorphism, CSS Variables, Flexbox/Grid).

### Backend
- **Node.js & Express.js** for the backend RESTful API.
- **MongoDB & Mongoose** for the NoSQL database modeling and data storage.
- **JSON Web Tokens (JWT) & bcryptjs** for secure user authentication and password hashing.
- **Multer** for handling file and image uploads.

---

## 🚀 Installation Guide

Follow these steps to run the SmartMeal project locally on your machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd smartmeal
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and configure your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

*(Optional)* Seed the database with initial recipe data:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# or 'node server.js'
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Open the Application
Once both servers are running, the SmartMeal application should be accessible via your web browser. Typically, the frontend runs at `http://localhost:5173/` and the backend strictly runs on the port defined in your `.env` (e.g., `http://localhost:5000/`).

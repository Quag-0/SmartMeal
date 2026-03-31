const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// basic route
app.get("/", (req, res) => {
  res.send("SmartMeal Backend Running");
});

// import routes
const recipesRoute = require("./routes/recipes");
const userRoute = require("./routes/user");
const shoppingRoute = require("./routes/shopping");
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoutes");
const reviewRoute = require("./routes/reviews");

// mount routes
app.use("/api/recipes", recipesRoute);
app.use("/api/user", userRoute);
app.use("/api/shopping-list", shoppingRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/reviews", reviewRoute);

// connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/smartmeal";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const rateLimit = require('express-rate-limit');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Configure bodyParser to parse JSON
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8070;

// Use cookieParser for parsing cookies
app.use(cookieParser());

// Configure CORS to allow credentials (cookies) from frontend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true // Allows cookies to be sent with requests
}));

// Configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});
app.use(limiter);

// CSRF Protection Middleware (must be after cookieParser and before routes)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,  // Prevent access to the cookie from JavaScript
    secure: false,   // Set to true if using HTTPS
    sameSite: 'strict' // Ensure the cookie is sent only from the same site
  }
});
app.use(csrfProtection);

// Route to fetch CSRF token for frontend
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.set('strictQuery', true);

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connection Success!");
});

// Define other routes (ShoppingCart, buyer, admin, seller, etc.)
const ShoppingCartRouter = require("./routes/ShoppingCarts.js");
app.use("/ShoppingCart", ShoppingCartRouter);

const buyerRouter = require("./routes/buyer.js");
app.use("/buyer", buyerRouter);

const adminRouter = require("./routes/admin.js");
app.use("/admin", adminRouter);

const sellerRouter = require("./routes/seller.js");
app.use("/seller", sellerRouter);

const itemRouter = require("./routes/items.js");
app.use("/item", itemRouter);

const orderRouter = require("./routes/order.js");
app.use("/order", orderRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});

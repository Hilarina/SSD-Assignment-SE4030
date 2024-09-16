const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const xss = require("xss-clean");

const app = express();
const multer = require("multer");
//import file system.
const fs = require("fs");
require("dotenv").config();

// Configure bodyParser to parse JSON
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(xss());
const PORT = process.env.PORT || 8070;

// Use cookieParser for parsing cookies
app.use(cookieParser());

// Configure CORS to allow credentials (cookies) from frontend (localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allows cookies to be sent with requests
  })
);

// Configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// CSRF Protection Middleware (must be after cookieParser and before routes)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // Prevent access to the cookie from JavaScript
    secure: false, // Set to true if using HTTPS
    sameSite: "strict", // Ensure the cookie is sent only from the same site
  },
});
app.use(csrfProtection);

// Route to fetch CSRF token for frontend
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// MongoDB connection
const URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//multer has option called disk storage.2 parameters --> destination and file name.
//First we save the images in the computer, and then move it to MongoDB
const storage = multer.diskStorage({
  //creates a folder called uploads and stores the files in it.
  destination: (req, file, cb) => {
    //cb is the callback.
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    //since we could receive multiple files, we are going to store it with the original name.
    cb(null, file.originalname);
  },
});

//Specify the storage as multer storage.
// const upload = multer({
//     //Specify the storage as our "Storage" that we created.
//     storage:storage
// //since we are uploading files one by one, we have to make use of "single".
// //we are going to upload images using this name (testImage).
// //since we are uploading files one by one, should make use of "single"
// })

//Attackers can't upload malicious files or scripts
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG are allowed!"), false);
    }
  },
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

const buyerHRouter = require("./routes/buyerH.js");
app.use("/buyerH", buyerHRouter);

const adminRouter = require("./routes/admin.js");
app.use("/admin", adminRouter);

const adminHRouter = require("./routes/adminH.js");
app.use("/adminH", adminHRouter);

const sellerRouter = require("./routes/seller.js");
app.use("/seller", sellerRouter);

const sellerHRouter = require("./routes/sellerH.js");
app.use("/sellerH", sellerHRouter);

const itemRouter = require("./routes/items.js");
app.use("/item", itemRouter);

const orderRouter = require("./routes/order.js");
app.use("/order", orderRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});

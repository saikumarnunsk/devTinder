const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
var cors = require("cors");

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend domain
    credentials: true, // 🔑 This allows cookies to be sent
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // explicitly allow PATCH
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// find user by email

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("server is successfully listaning on port 3000");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error.message);
  });

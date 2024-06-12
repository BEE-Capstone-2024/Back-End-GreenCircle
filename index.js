require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./db");
const userRoutes = require("./routes/users");
const signUpRoutes = require("./routes/signUp");
const signInRoutes = require("./routes/signIn");
const preferencesRoutes = require("./routes/preferences");
const eventRoutes = require("./routes/events");
const collectRoutes = require("./routes/collect");
const errorHandler = require("./middlewares/error");


// Connect to DB
connectDB();

// Express App
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes)
app.use("/api/signup", signUpRoutes);
app.use("/api/signin", signInRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/collect", collectRoutes);


app.use("/", (req, res) => {
  return res.json({
    message: "BEE-CAPSTONE-PROJECT"
  });
});

app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server started listening on http://localhost:${port}/`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});
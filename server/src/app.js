const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");


const authRoutes = require("./routes/authRoutes");
const projectTaskRoutes = require("./routes/projectTaskRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api", projectTaskRoutes);

// Global error handler — must be registered last
app.use(errorHandler);

module.exports = app;
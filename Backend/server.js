import "dotenv/config";

import path from "path";
import express from "express";
// import dotenv from "dotenv";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes Import
import userRoutes from "./routes/userRoutes.js";
import userActivityRoutes from "./routes/userActivityRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Making the 'uploads' folder publicly accessible.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Making the 'email-assets' folder publicly accessible.
app.use("/email-assets", express.static(path.join(__dirname, "email-assets")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/user-activities", userActivityRoutes);
app.use("/api/contact", contactRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")));
} else {
  app.get("/", (req, res) => res.send("server is ready"));
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`.yellow.bold));

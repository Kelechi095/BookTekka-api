import dotenv from "dotenv";
dotenv.config();

import express from "express";
import todoRouter from "./routes/todoRoutes.js";
import { connectDb } from "./config/connectDb.js";
import cors from "cors";
import path from "path";

connectDb();

app.use(express.json());
app.use(cors());

//const __dirname = path.resolve();

const app = express();
//app.use(express.static(path.join(__dirname, "/client/dist")));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/api/todos", todoRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

/* app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
}); */

/* app.use(cors({
  origin: 'https://keltdm.onrender.com'
}));
 */

const PORT = 3000;

//app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
});

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./utils/db";
import routes from "./routes";

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

const app = express();

process.on("SIGINT", () => {
  console.log("Shutting down...");
  process.exit(0);
});
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

// SPA fallback (IMPORTANT)

// app.use(routeNotFound);
// app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`),
);

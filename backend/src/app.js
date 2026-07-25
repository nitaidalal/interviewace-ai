import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import v1Routes from "./routes/index.js";
import ApiError from "./utils/ApiError.js";
import globalErrorHandler from "./middlewares/errorHandler.middleware.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL.split(",") ,
		credentials: true,
	}),
);

app.use(globalLimiter);

app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AceInterviewAI API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", v1Routes);

app.use((req, res, next) => {
	next(new ApiError(404, "Route not found"));
});

app.use(globalErrorHandler);

export default app;
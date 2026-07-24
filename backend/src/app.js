import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import ApiError from "./utils/ApiError.js";

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
		credentials: true,
	}),
);

app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
	res.status(200).json({ success: true, message: "OK" });
});

app.use("/api/v1/auth", authRoutes);

app.use((req, res, next) => {
	next(new ApiError(404, "Route not found"));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	res.status(statusCode).json({
		success: false,
		message,
		errors: err.errors || [],
		data: err.data ?? null,
	});
});

export default app;
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { validateEnv } from "./config/env.js";
import { startCronJobs } from "./services/cron.service.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		validateEnv();
		await connectDB();
		connectCloudinary();
		startCronJobs();

		app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
		console.log(`📡 API base: http://localhost:${PORT}/api/v1`);
		console.log(`❤️  Health:  http://localhost:${PORT}/health`);
    });
	} catch (error) {
		console.error("❌ Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer()

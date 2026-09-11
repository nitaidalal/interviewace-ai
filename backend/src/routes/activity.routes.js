import { Router } from "express";

import { getActivity } from "../controllers/activity.controller.js";

import { protect } from "../middlewares/auth.middleware.js";    


const router = Router();

router.use(protect);

router.get("/", getActivity);

export default router;
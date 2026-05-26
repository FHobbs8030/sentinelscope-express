import express from "express";

import { getTelemetry } from "../controllers/telemetry.controller.js";

const router = express.Router();

router.get("/", getTelemetry);

export default router;

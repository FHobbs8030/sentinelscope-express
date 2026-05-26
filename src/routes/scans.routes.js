import express from "express";

import { getScans } from "../controllers/scans.controller.js";

const router = express.Router();

router.get("/", getScans);

export default router;

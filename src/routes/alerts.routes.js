import express from "express";

import {
  getAlerts,
  createAlert,
  getAlertById,
  updateAlert,
} from "../controllers/alerts.controller.js";

const router = express.Router();

router.get("/", getAlerts);

router.post("/", createAlert);

router.get("/:id", getAlertById);

router.patch("/:id", updateAlert);

export default router;

import express from "express";

import {
  getAlerts,
  createAlert,
  getAlertById,
  updateAlert,
  acknowledgeAlert,
  investigateAlert,
  resolveAlert,
  closeAlert,
} from "../controllers/alerts.controller.js";

const router = express.Router();

router.get("/", getAlerts);

router.post("/", createAlert);

router.get("/:id", getAlertById);

router.patch("/:id", updateAlert);

/*
|--------------------------------------------------------------------------
| Alert Workflow Actions
|--------------------------------------------------------------------------
*/

router.patch("/:id/acknowledge", acknowledgeAlert);

router.patch("/:id/investigate", investigateAlert);

router.patch("/:id/resolve", resolveAlert);

router.patch("/:id/close", closeAlert);

export default router;

import express from "express";

import {
  getScans,
  createScan,
  getScanById,
  updateScan,
  deleteScan,
} from "../controllers/scans.controller.js";

const router = express.Router();

router.get("/", getScans);

router.post("/", createScan);

router.get("/:id", getScanById);

router.patch("/:id", updateScan);

router.delete("/:id", deleteScan);

export default router;

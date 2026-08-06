import express from "express";

import {
  getFindings,
  getFindingsSummary,
  createFinding,
  createFindingsBatch,
  getFindingById,
  updateFinding,
} from "../controllers/findings.controller.js";

const router = express.Router();

router.get("/", getFindings);

router.get("/summary", getFindingsSummary);

router.post("/", createFinding);

router.post("/batch", createFindingsBatch);

router.get("/:id", getFindingById);

router.patch("/:id", updateFinding);

export default router;

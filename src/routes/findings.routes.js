import express from "express";

import {
  getFindings,
  createFinding,
  getFindingById,
  updateFinding,
} from "../controllers/findings.controller.js";

const router = express.Router();

router.get("/", getFindings);

router.post("/", createFinding);

router.get("/:id", getFindingById);

router.patch("/:id", updateFinding);

export default router;

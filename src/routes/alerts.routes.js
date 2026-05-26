import express from "express";

import apiResponse from "../utils/apiResponse.js";

const router = express.Router();

router.get("/", (req, res) => {
  const alerts = [
    {
      id: "alert-001",
      severity: "critical",
      message: "Potential remote exploit detected",
      source: "vulnerability-engine",
    },
    {
      id: "alert-002",
      severity: "warning",
      message: "Suspicious outbound traffic observed",
      source: "network-monitor",
    },
  ];

  res.status(200).json(
    apiResponse({
      success: true,
      total: alerts.length,
      data: alerts,
    }),
  );
});

export default router;

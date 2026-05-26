import express from "express";

import apiResponse from "../utils/apiResponse.js";

const router = express.Router();

router.get("/", (req, res) => {
  const findings = [
    {
      id: "finding-001",
      severity: "high",
      title: "Open SSH Port",
      target: "dmz-gateway.local",
    },
    {
      id: "finding-002",
      severity: "medium",
      title: "Outdated TLS Configuration",
      target: "api.production.local",
    },
  ];

  res.status(200).json(
    apiResponse({
      success: true,
      total: findings.length,
      data: findings,
    }),
  );
});

export default router;

import apiResponse from "../utils/apiResponse.js";

const mockScans = [
  {
    id: "scan-001",
    target: "internal-network.local",
    type: "Full Recon",
    status: "completed",
    findings: 12,
    startedAt: "2026-05-26T09:00:00Z",
  },
  {
    id: "scan-002",
    target: "dmz-gateway.local",
    type: "Port Sweep",
    status: "running",
    findings: 3,
    startedAt: "2026-05-26T09:18:00Z",
  },
  {
    id: "scan-003",
    target: "api.production.local",
    type: "Vulnerability Assessment",
    status: "queued",
    findings: 0,
    startedAt: "2026-05-26T09:25:00Z",
  },
];

export const getScans = (req, res) => {
  res.status(200).json(
    apiResponse({
      success: true,
      total: mockScans.length,
      data: mockScans,
    }),
  );
};

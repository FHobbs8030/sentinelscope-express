const telemetryEvents = [
  {
    id: "evt-001",
    severity: "info",
    message: "Scan engine initialized",
    source: "scan-engine",
    timestamp: "2026-05-26T09:45:00Z",
  },
  {
    id: "evt-002",
    severity: "warning",
    message: "Unusual port activity detected",
    source: "network-monitor",
    timestamp: "2026-05-26T09:46:12Z",
  },
  {
    id: "evt-003",
    severity: "critical",
    message: "Potential vulnerability identified",
    source: "vuln-analysis",
    timestamp: "2026-05-26T09:47:33Z",
  },
];

export const getTelemetry = (req, res) => {
  res.status(200).json({
    success: true,
    total: telemetryEvents.length,
    data: telemetryEvents,
  });
};

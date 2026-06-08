import Alert from "../models/Alert.js";
import apiResponse from "../utils/apiResponse.js";

function createTimelineEntry(action, notes = "") {
  return {
    action,
    timestamp: new Date(),
    notes,
  };
}

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.status(200).json(
      apiResponse({
        success: true,
        total: alerts.length,
        data: alerts,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);

    res.status(201).json(
      apiResponse({
        success: true,
        message: "Alert created successfully",
        data: alert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Alert not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        data: alert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedAlert = await Alert.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlert) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Alert not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Alert updated successfully",
        data: updatedAlert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Alert not found",
        }),
      );
    }

    if (alert.status !== "open") {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Only open alerts can be acknowledged",
        }),
      );
    }

    alert.status = "acknowledged";
    alert.acknowledgedAt = new Date();

    alert.timeline.push(
      createTimelineEntry("acknowledged", "Alert acknowledged by operator"),
    );

    await alert.save();

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Alert acknowledged successfully",
        data: alert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const investigateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Alert not found",
        }),
      );
    }

    if (alert.status !== "acknowledged") {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Only acknowledged alerts can be investigated",
        }),
      );
    }

    alert.status = "investigating";

    alert.timeline.push(
      createTimelineEntry("investigating", "Investigation initiated"),
    );

    await alert.save();

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Alert investigation started",
        data: alert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Alert not found",
        }),
      );
    }

    if (alert.status !== "investigating") {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Only investigating alerts can be resolved",
        }),
      );
    }

    alert.status = "resolved";
    alert.resolvedAt = new Date();

    alert.timeline.push(createTimelineEntry("resolved", "Alert resolved"));

    await alert.save();

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Alert resolved successfully",
        data: alert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const closeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Alert not found",
        }),
      );
    }

    if (alert.status !== "resolved") {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Only resolved alerts can be closed",
        }),
      );
    }

    alert.status = "closed";
    alert.closedAt = new Date();

    alert.timeline.push(createTimelineEntry("closed", "Alert closed"));

    await alert.save();

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Alert closed successfully",
        data: alert,
      }),
    );
  } catch (error) {
    next(error);
  }
};

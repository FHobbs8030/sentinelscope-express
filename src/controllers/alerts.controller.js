import Alert from "../models/Alert.js";
import apiResponse from "../utils/apiResponse.js";

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

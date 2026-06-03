import Finding from "../models/Finding.js";
import apiResponse from "../utils/apiResponse.js";

export const getFindings = async (req, res, next) => {
  try {
    const findings = await Finding.find().sort({ createdAt: -1 });

    res.status(200).json(
      apiResponse({
        success: true,
        total: findings.length,
        data: findings,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const createFinding = async (req, res, next) => {
  try {
    const finding = await Finding.create(req.body);

    res.status(201).json(
      apiResponse({
        success: true,
        message: "Finding created successfully",
        data: finding,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getFindingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const finding = await Finding.findById(id);

    if (!finding) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Finding not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        data: finding,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateFinding = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedFinding = await Finding.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedFinding) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Finding not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Finding updated successfully",
        data: updatedFinding,
      }),
    );
  } catch (error) {
    next(error);
  }
};

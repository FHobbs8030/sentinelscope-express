import Mission from "../models/Mission.js";
import apiResponse from "../utils/apiResponse.js";

export const getMissions = async (req, res, next) => {
  try {
    const missions = await Mission.find().sort({
      createdAt: -1,
    });

    res.status(200).json(
      apiResponse({
        success: true,
        total: missions.length,
        data: missions,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const createMission = async (req, res, next) => {
  try {
    const rawClientMissionId = req.body?.clientMissionId;

    const clientMissionId =
      typeof rawClientMissionId === "string"
        ? rawClientMissionId.trim()
        : null;

    if (
      rawClientMissionId !== undefined &&
      (typeof rawClientMissionId !== "string" || clientMissionId === "")
    ) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "clientMissionId must be a non-empty string",
        }),
      );
    }

    if (clientMissionId) {
      const existingMission = await Mission.findOne({
        clientMissionId,
      });

      if (existingMission) {
        return res.status(200).json(
          apiResponse({
            success: true,
            message: "Mission already exists",
            data: existingMission,
          }),
        );
      }
    }

    try {
      const mission = await Mission.create({
        ...req.body,
        ...(clientMissionId
          ? {
              clientMissionId,
            }
          : {}),
      });

      return res.status(201).json(
        apiResponse({
          success: true,
          data: mission,
        }),
      );
    } catch (error) {
      if (
        clientMissionId &&
        (error?.code === 11000 || error?.code === 11001)
      ) {
        const existingMission = await Mission.findOne({
          clientMissionId,
        });

        if (existingMission) {
          return res.status(200).json(
            apiResponse({
              success: true,
              message: "Mission already exists",
              data: existingMission,
            }),
          );
        }
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const updateMission = async (req, res, next) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(
      apiResponse({
        success: true,
        data: mission,
      }),
    );
  } catch (error) {
    next(error);
  }
};

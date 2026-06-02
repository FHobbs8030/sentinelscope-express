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
    const mission = await Mission.create(req.body);

    res.status(201).json(
      apiResponse({
        success: true,
        data: mission,
      }),
    );
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

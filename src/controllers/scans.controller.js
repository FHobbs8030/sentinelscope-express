import Scan from "../models/Scan.js";
import apiResponse from "../utils/apiResponse.js";

export const getScans = async (req, res, next) => {
  try {
    const scans = await Scan.find().sort({ createdAt: -1 });

    res.status(200).json(
      apiResponse({
        success: true,
        total: scans.length,
        data: scans,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const createScan = async (req, res, next) => {
  try {
    const {
      clientScanId: rawClientScanId,
      name,
      target,
      scanType,
      missionId,
      missionMongoId,
      profile,
      severity,
      status,
      currentStage,
      runtimeState,
      progress,
      findingsCount,
      startedAt,
      completedAt,
    } = req.body;

    const clientScanId =
      typeof rawClientScanId === "string"
        ? rawClientScanId.trim()
        : null;

    if (
      rawClientScanId !== undefined &&
      (typeof rawClientScanId !== "string" || clientScanId === "")
    ) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "clientScanId must be a non-empty string",
        }),
      );
    }

    if (clientScanId) {
      const existingScan = await Scan.findOne({
        clientScanId,
      });

      if (existingScan) {
        return res.status(200).json(
          apiResponse({
            success: true,
            message: "Scan already exists",
            data: existingScan,
          }),
        );
      }
    }

    try {
      const scan = await Scan.create({
        ...(clientScanId
          ? {
              clientScanId,
            }
          : {}),
        name,
        target,
        missionId,
        missionMongoId,
        scanType,
        profile: profile ?? "General",
        severity: severity ?? "medium",
        status: status ?? "queued",
        currentStage: currentStage ?? status ?? "queued",
        runtimeState: runtimeState ?? "active",
        progress: progress ?? 0,
        findingsCount: findingsCount ?? 0,
        startedAt: startedAt ?? null,
        completedAt: completedAt ?? null,
      });

      return res.status(201).json(
        apiResponse({
          success: true,
          message: "Scan created successfully",
          data: scan,
        }),
      );
    } catch (error) {
      if (
        clientScanId &&
        (error?.code === 11000 || error?.code === 11001)
      ) {
        const existingScan = await Scan.findOne({
          clientScanId,
        });

        if (existingScan) {
          return res.status(200).json(
            apiResponse({
              success: true,
              message: "Scan already exists",
              data: existingScan,
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

export const getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scan = await Scan.findById(id);

    if (!scan) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Scan not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        data: scan,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateScan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedScan = await Scan.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedScan) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Scan not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Scan updated successfully",
        data: updatedScan,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const deleteScan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedScan = await Scan.findByIdAndDelete(id);

    if (!deletedScan) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Scan not found",
        }),
      );
    }

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Scan deleted successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

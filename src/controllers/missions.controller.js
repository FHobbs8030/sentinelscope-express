import Mission from "../models/Mission.js";
import apiResponse from "../utils/apiResponse.js";

const TERMINAL_MISSION_STATES = new Set(["completed", "failed", "cancelled"]);

const ACTIVE_MISSION_STATES = ["initializing", "running"];
const RUNTIME_LEASE_MS = 30000;

const recoverStaleMissionLeases = () => {
  return Mission.updateMany(
    {
      queueLease: "active",
      state: {
        $nin: ACTIVE_MISSION_STATES,
      },
    },
    {
      $unset: {
        queueLease: 1,
        runtimeOwnerId: 1,
        runtimeLeaseExpiresAt: 1,
        runtimeHeartbeatAt: 1,
      },
    },
  );
};

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

export const getMissionQueueState = async (req, res, next) => {
  try {
    await recoverStaleMissionLeases();
    const [activeMission, queuedMissions] = await Promise.all([
      Mission.findOne({
        queueLease: "active",
        state: {
          $in: ACTIVE_MISSION_STATES,
        },
      })
        .sort({
          claimedAt: 1,
          createdAt: 1,
          _id: 1,
        })
        .lean(),

      Mission.find({
        state: "queued",
        queueLease: {
          $ne: "active",
        },
      })
        .sort({
          createdAt: 1,
          _id: 1,
        })
        .lean(),
    ]);

    return res.status(200).json(
      apiResponse({
        success: true,
        data: {
          activeMission,
          queuedMissions,
          queuedCount: queuedMissions.length,
          totalPending: queuedMissions.length + (activeMission ? 1 : 0),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const acquireMissionRuntimeLease = async (req, res, next) => {
  try {
    const runtimeOwnerId =
      typeof req.body?.runtimeOwnerId === "string"
        ? req.body.runtimeOwnerId.trim()
        : "";

    if (!runtimeOwnerId) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "runtimeOwnerId is required",
        }),
      );
    }

    const now = new Date();
    const runtimeLeaseExpiresAt = new Date(now.getTime() + RUNTIME_LEASE_MS);

    const mission = await Mission.findOneAndUpdate(
      {
        _id: req.params.id,
        queueLease: "active",
        state: {
          $in: ACTIVE_MISSION_STATES,
        },
        $or: [
          {
            runtimeOwnerId: null,
          },
          {
            runtimeOwnerId,
          },
          {
            runtimeLeaseExpiresAt: null,
          },
          {
            runtimeLeaseExpiresAt: {
              $lte: now,
            },
          },
        ],
      },
      {
        $set: {
          runtimeOwnerId,
          runtimeHeartbeatAt: now,
          runtimeLeaseExpiresAt,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (mission) {
      return res.status(200).json(
        apiResponse({
          success: true,
          message: "Runtime lease acquired",
          data: mission,
        }),
      );
    }

    const existingMission = await Mission.findById(req.params.id);

    if (!existingMission) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Mission not found",
        }),
      );
    }

    return res.status(200).json(
      apiResponse({
        success: true,
        message: "Runtime lease already owned",
        data: existingMission,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const claimNextMission = async (req, res, next) => {
  try {
    // Recover stale leases left behind by an older process,
    // crash, or inconsistent persisted mission state.
    await recoverStaleMissionLeases();

    const activeMission = await Mission.findOne({
      queueLease: "active",
      state: {
        $in: ACTIVE_MISSION_STATES,
      },
    }).sort({
      claimedAt: 1,
      createdAt: 1,
      _id: 1,
    });

    if (activeMission) {
      return res.status(200).json(
        apiResponse({
          success: true,
          message: "Queue already has an active mission",
          data: activeMission,
        }),
      );
    }

    try {
      const claimedMission = await Mission.findOneAndUpdate(
        {
          state: "queued",
          queueLease: {
            $ne: "active",
          },
        },
        {
          $set: {
            state: "initializing",
            queueLease: "active",
            claimedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
          sort: {
            createdAt: 1,
            _id: 1,
          },
        },
      );

      if (!claimedMission) {
        return res.status(200).json(
          apiResponse({
            success: true,
            message: "No queued missions available",
            data: null,
          }),
        );
      }

      return res.status(200).json(
        apiResponse({
          success: true,
          message: "Mission claimed",
          data: claimedMission,
        }),
      );
    } catch (error) {
      if (error?.code === 11000 || error?.code === 11001) {
        const existingActiveMission = await Mission.findOne({
          queueLease: "active",
          state: {
            $in: ACTIVE_MISSION_STATES,
          },
        });

        if (existingActiveMission) {
          return res.status(200).json(
            apiResponse({
              success: true,
              message: "Queue already has an active mission",
              data: existingActiveMission,
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

export const createMission = async (req, res, next) => {
  try {
    const {
      queueLease: _queueLease,
      claimedAt: _claimedAt,
      runtimeOwnerId: _runtimeOwnerId,
      runtimeLeaseExpiresAt: _runtimeLeaseExpiresAt,
      runtimeHeartbeatAt: _runtimeHeartbeatAt,
      ...missionInput
    } = req.body ?? {};

    const rawClientMissionId = missionInput.clientMissionId;

    const clientMissionId =
      typeof rawClientMissionId === "string" ? rawClientMissionId.trim() : null;

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
        ...missionInput,
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
      if (clientMissionId && (error?.code === 11000 || error?.code === 11001)) {
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
    const {
      queueLease: _queueLease,
      claimedAt: _claimedAt,
      runtimeOwnerId: _runtimeOwnerId,
      runtimeLeaseExpiresAt: _runtimeLeaseExpiresAt,
      runtimeHeartbeatAt: _runtimeHeartbeatAt,
      ...missionUpdates
    } = req.body ?? {};

    const update = {
      $set: missionUpdates,
    };

    if (TERMINAL_MISSION_STATES.has(missionUpdates.state)) {
     update.$unset = {
       queueLease: 1,
       runtimeOwnerId: 1,
       runtimeLeaseExpiresAt: 1,
       runtimeHeartbeatAt: 1,
     };
    }

    const mission = await Mission.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!mission) {
      return res.status(404).json(
        apiResponse({
          success: false,
          message: "Mission not found",
        }),
      );
    }

    return res.status(200).json(
      apiResponse({
        success: true,
        data: mission,
      }),
    );
  } catch (error) {
    next(error);
  }
};

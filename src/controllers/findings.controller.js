import Finding from "../models/Finding.js";
import apiResponse from "../utils/apiResponse.js";

const MAX_FINDINGS_PAGE_SIZE = 200;
const DEFAULT_FINDINGS_PAGE_SIZE = 50;

const parsePositiveInteger = (value) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  return parsedValue > 0 ? parsedValue : null;
};

export const getFindings = async (req, res, next) => {
  try {
    const paginationRequested =
      req.query.page !== undefined || req.query.limit !== undefined;

    if (!paginationRequested) {
      const findings = await Finding.find()
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json(
        apiResponse({
          success: true,
          total: findings.length,
          data: findings,
        }),
      );
    }

    const page =
      req.query.page === undefined
        ? 1
        : parsePositiveInteger(req.query.page);

    const limit =
      req.query.limit === undefined
        ? DEFAULT_FINDINGS_PAGE_SIZE
        : parsePositiveInteger(req.query.limit);

    if (page === null || limit === null) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Page and limit must be positive integers",
        }),
      );
    }

    if (limit > MAX_FINDINGS_PAGE_SIZE) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: `Finding page size cannot exceed ${MAX_FINDINGS_PAGE_SIZE}`,
        }),
      );
    }

    const skip = (page - 1) * limit;

    const [total, findings] = await Promise.all([
      Finding.countDocuments(),
      Finding.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return res.status(200).json(
      apiResponse({
        success: true,
        total,
        data: findings,
        meta: {
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1 && totalPages > 0,
        },
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

export const createFindingsBatch = async (req, res, next) => {
  try {
    const { findings } = req.body;

    if (!Array.isArray(findings) || findings.length === 0) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "A non-empty findings array is required",
        }),
      );
    }

    if (findings.length > 500) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Finding batch cannot exceed 500 records",
        }),
      );
    }

    const normalizedFindings = findings.map((finding) => {
      return {
        ...finding,
        clientFindingId:
          typeof finding.clientFindingId === "string"
            ? finding.clientFindingId.trim()
            : finding.clientFindingId,
      };
    });

    const clientFindingIds = normalizedFindings.map((finding) => {
      return finding.clientFindingId;
    });

    const hasInvalidClientFindingId = clientFindingIds.some((id) => {
      return typeof id !== "string" || id === "";
    });

    if (hasInvalidClientFindingId) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Every batch finding requires a clientFindingId",
        }),
      );
    }

    const uniqueClientFindingIds = new Set(clientFindingIds);

    if (uniqueClientFindingIds.size !== clientFindingIds.length) {
      return res.status(400).json(
        apiResponse({
          success: false,
          message: "Duplicate clientFindingId values found in batch",
        }),
      );
    }

    /*
     * Validate the entire batch before attempting persistence.
     * This reduces the risk of partially writing a malformed batch.
     */
    await Promise.all(
      normalizedFindings.map(async (findingData) => {
        const finding = new Finding(findingData);

        await finding.validate();
      }),
    );

    const existingFindings = await Finding.find({
      clientFindingId: {
        $in: clientFindingIds,
      },
    });

    const existingIds = new Set(
      existingFindings.map((finding) => {
        return finding.clientFindingId;
      }),
    );

    const missingFindings = normalizedFindings.filter((finding) => {
      return !existingIds.has(finding.clientFindingId);
    });

    if (missingFindings.length > 0) {
      try {
        await Finding.insertMany(missingFindings, {
          ordered: false,
        });
      } catch (error) {
        /*
         * A duplicate-key race can occur if the same idempotent batch
         * reaches the backend concurrently. The final reconciliation query
         * below determines whether the full requested batch now exists.
         */
        if (error?.code !== 11000 && error?.code !== 11001) {
          throw error;
        }
      }
    }

    const persistedFindings = await Finding.find({
      clientFindingId: {
        $in: clientFindingIds,
      },
    });

    const findingsByClientId = new Map(
      persistedFindings.map((finding) => {
        return [finding.clientFindingId, finding];
      }),
    );

    const orderedFindings = clientFindingIds
      .map((clientFindingId) => {
        return findingsByClientId.get(clientFindingId);
      })
      .filter(Boolean);

    if (orderedFindings.length !== findings.length) {
      return res.status(500).json(
        apiResponse({
          success: false,
          message: "Finding batch persistence was incomplete",
          total: orderedFindings.length,
          data: orderedFindings,
        }),
      );
    }

    res.status(201).json(
      apiResponse({
        success: true,
        message: "Finding batch persisted successfully",
        total: orderedFindings.length,
        data: orderedFindings,
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

    const updatedFinding = await Finding.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

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

import ApiError from "../utils/ApiError.js";


export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new ApiError(422, "Validation failed", errors);
    }

    req[source] = result.data;
    next();
  };

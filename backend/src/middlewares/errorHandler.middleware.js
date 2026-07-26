const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    if (err.code === 11000) {
      statusCode = 409;

      const field = Object.keys(err.keyValue)[0];

      message = `${field} '${err.keyValue[field]}' already exists`;
    } else if (err.name === "MulterError") {
      statusCode = 400;

      if (err.code === "LIMIT_FILE_SIZE") {
        message = "File too large. Avatar must be 2 MB or smaller.";
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        message = "Unexpected file field";
      } else {
        message = err.message || "Invalid file upload";
      }
    } else if (err.name === "ValidationError") {
      statusCode = 422;

      message = "Validation failed";

      errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
    } else if (err.name === "CastError") {
      statusCode = 400;

      message = `Invalid ${err.path}`;
    }

    if (process.env.NODE_ENV === "development") {
        console.error({
          message: err.message,
          stack: err.stack,
          code: err.code,
        });
    }

    res.status(statusCode).json({
      success: false,
      message,
      errors,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}

export default globalErrorHandler;
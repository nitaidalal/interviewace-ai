export const parseApiError = (error) => {
  if (!error.response) {
    return "Connection failed. Please check your internet connection.";
  }

  const { data, status } = error;

  if (data?.message) return data.message;

  switch (status) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return "Session expired. Please log in again.";
    case 403:
      return "You do not have permission to do this.";
    case 404:
      return "Resource not found.";
    case 409:
      return "This already exists.";
    case 422:
      return "Validation failed. Please check your input.";
    case 429:
      return "Too many requests. Please slow down.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
};

export const parseFieldErrors = (error) => {
  const errors = error.response?.data?.errors;
  if (!Array.isArray(errors)) return {};

  return errors.reduce((acc, err) => {
    if (err.field) acc[err.field] = err.message;
    return acc;
  }, {});
};
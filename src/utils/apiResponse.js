const apiResponse = ({
  success = true,
  message = "",
  total = null,
  data = null,
  errors = null,
}) => {
  const response = {
    success,

    timestamp: new Date().toISOString(),
  };

  if (message) {
    response.message = message;
  }

  if (typeof total === "number") {
    response.total = total;
  }

  if (data !== null) {
    response.data = data;
  }

  if (errors) {
    response.errors = errors;
  }

  return response;
};

export default apiResponse;

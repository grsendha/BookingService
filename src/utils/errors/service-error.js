const { StatusCodes } = require("http-status-codes");

class ServiceError extends Error {
  constructor(
    message = "Something went wrong",
    explanation = "Service Layer Error",
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    this.name = "ServiceError";
    this.explanation = explanation;
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ServiceError;

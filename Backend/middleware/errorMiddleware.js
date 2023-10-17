const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectID") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    const valErrors = Object.values(err.errors).map((error) => error.message);
    message = `Invalid input: ${valErrors.join(", ")}`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };

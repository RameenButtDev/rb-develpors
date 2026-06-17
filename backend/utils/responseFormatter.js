exports.successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data
  });
};

exports.errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message
  });
};

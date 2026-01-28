/*const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware*/
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log('🔥 ERROR:', err);
  return res.status(500).json({
    msg: err.message,
    name: err.name,
    code: err.code,
  });
};

module.exports = errorHandlerMiddleware;

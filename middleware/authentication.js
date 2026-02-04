const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Reviewer: clearer 401 message + confirm expected format
  if (!authHeader) {
    throw new UnauthenticatedError("Authentication invalid: missing Authorization header");
  }

  // Instructor pattern: requires "Bearer " + token
  if (!authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError('Authentication invalid: use "Bearer <token>"');
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid: token missing");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid: token failed verification");
  }
};

module.exports = auth;

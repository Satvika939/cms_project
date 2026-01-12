// verify token and populate user
const jwt = require('jsonwebtoken');

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.sendStatus(401);

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res.sendStatus(403);
      }

      req.user = decoded;
      next();
    } catch {
      res.sendStatus(401);
    }
  };
};

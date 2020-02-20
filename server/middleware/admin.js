module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!req.userData.isAdmin)
    return res.status(403).json({ message: "Accesso denegado." });

  next();
};

const jwt = require('jsonwebtoken');

module.exports = (allowedRoles=[]) => {
  return function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
      res.status(401).json({
        msg: 'Authorization denied!!!',
      });
    }

    try {

      const decoded = jwt.verify(token, process.env.JWTSECRET);
      if(allowedRoles.length == 0 || allowedRoles.includes(decoded.user.role) || decoded.user.role == 'admin'){
        req.user = decoded.user;
        next();
      }else{
        console.log("de",decoded);
        res.status(403).json({
          msg: 'Access forbidden for this resource!',
        });
      }

    } catch (err) {
      console.error(err.message);
      res.status(401).json({
        msg: 'Authorization denied!',
      });
    }
  }
};

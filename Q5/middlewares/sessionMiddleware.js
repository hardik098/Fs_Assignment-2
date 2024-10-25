const session = require("express-session");

const sessionAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect("/loginSession");
  }
};

module.exports = sessionAuth;

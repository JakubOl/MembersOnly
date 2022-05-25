module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports.isAdmin = async (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.redirect("/");
  }
};

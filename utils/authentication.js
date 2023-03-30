function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.redirect("/users/login");
}

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) res.redirect("/");
  else next();
}

export { ensureAuthenticated, ensureNotAuthenticated };

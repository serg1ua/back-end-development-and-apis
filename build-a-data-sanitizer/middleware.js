export function inputCleaner(req, res, next) {
  const { username, comment } = req.body;
  if (username) {
    req.body.username = username.toLowerCase();
  }
  if (comment) {
    req.body.comment = comment.replace(/<[^>]*>/g, '');
  }
  next();
}

export function inputValidator(req, res, next) {
  const { username } = req.body;
  if (username.length < 3) {
    res.redirect('/form?error=Username must be at least 3 characters');
    return;
  }
  next();
}
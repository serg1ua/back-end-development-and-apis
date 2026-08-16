export function authorizeModification(req, res, next) {
  const { user } = req;
  if (user?.role === 'child' && Number(user.id) !== Number(req.params?.userId)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  next();
}

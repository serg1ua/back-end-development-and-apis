import users from "../data/users.json" with { type: "json" };

export function authenticate(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ "error": "No token provided." });
    return;
  }
  const token = authorization.split(' ').at(1);
  const user = users.find((u) => u.passwordHash === token);
  if (!user) {
    res.status(401).json({ "error": "Invalid or expired token." });
    return;
  }

  req.user = { ...req.user, token };
  next();
}
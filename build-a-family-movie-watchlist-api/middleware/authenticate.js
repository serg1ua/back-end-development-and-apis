import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: 'No token provided.' });
    return;
  }
  const token = authorization.split(' ').at(1);

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401).send({ error: 'Invalid or expired token.' });
    return;
  }

  req.user = decoded;
  next();
}

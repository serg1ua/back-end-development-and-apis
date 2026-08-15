import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express from 'express';
import users from '../../data/users.json' with { type: 'json' };

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).end('Username and password required');
    return;
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).end('User not found');
    return;
  }

  if (user && !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).end('Wrong password');
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' });

  res.status(200).json({ token });
});


export default router;

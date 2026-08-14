// import { createHash } from 'node:crypto';
import express from "express";
import users from "../../data/users.json" with { type: "json" };

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).end("Username and password required");
    return;
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).end("User not found");
    return;
  }

  // const hash = createHash("sha256")
  //   .update(password)
  //   .digest("hex");
  // console.log(hash, user.passwordHash);

  if (user && password !== user._password) {
    res.status(401).end("Wrong password");
    return;
  }

  res.status(200).json({ token: user.passwordHash });
});


export default router;


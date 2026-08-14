import express from "express";
import watchlist from "../../data/watchlists.json" with { type: "json" };

const router = express.Router();

router.get("/", (req, res) => {
  console.log("🚀 ~ req:", req.user);
  res.status(200).json(watchlist);
});


export default router;


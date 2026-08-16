import express from 'express';

import { authenticate } from '../../middleware/authenticate.js';
import { authorizeModification } from '../../middleware/authorize.js';

import watchlist from '../../data/watchlists.json' with { type: 'json' };

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  res.status(200).json(watchlist);
});

router.get('/:userId', (req, res) => {
  res.status(200).json(watchlist[req.params?.userId]);
});

router.post('/:userId/movies', authorizeModification, (req, res) => {
  const userId = req.params?.userId;

  watchlist[userId].push({ id: Number(req.body.title.split(' ').at(-1)), ...req.body });
  res.status(201).json(watchlist[userId]);
});

router.put('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const userId = req.params?.userId;
  const movieId = Number(req.params?.movieId);

  const userList = watchlist[userId];
  userList.forEach((mov, index) => {
    if (mov.id === movieId) {
      const updated = { id: movieId, ...mov, ...req.body };
      userList[index] = updated;
    }
  });
  res.status(200).end();
});

router.delete('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const movieId = Number(req.params?.movieId);

  Object.values(watchlist).forEach((list) => {
    const index = list.findIndex((mov) => mov.id === movieId);
    if (index !== -1) {
      list.splice(index, 1);
    }
  });
  res.status(200).end();
});

export default router;

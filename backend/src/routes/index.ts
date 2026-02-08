import express from 'express';
import ProductRouter from './product';

const router: express.Router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/api/v1', ProductRouter);
router.get('/api/v1', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default router;

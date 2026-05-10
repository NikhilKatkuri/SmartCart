import express from 'express'; 
import productRouter from './product';
import { aiRouter } from './ai';

const router: express.Router = express.Router({ mergeParams: true });
const baseName = '/api/v1';

router.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
});
 
router.use(baseName, productRouter);
router.use(baseName, aiRouter);

router.get(baseName, (_req, res) => {
      res.json({ message: 'API is working!' });
});

export default router;

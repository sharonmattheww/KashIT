import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  postTransaction,
  putTransaction,
  removeTransaction,
} from '../controllers/transactionsController.js';

const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/', postTransaction);
router.put('/:id', putTransaction);
router.delete('/:id', removeTransaction);

export default router;

import { Router } from 'express';
import { listEmployees } from '../controllers/employees.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, listEmployees);

export default router;

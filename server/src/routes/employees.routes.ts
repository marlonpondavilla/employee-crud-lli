import { Router } from 'express';
import {
	addEmployee,
	editEmployee,
	listEmployees,
	removeEmployee,
} from '../controllers/employees.controllers';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, listEmployees);
router.post('/', authenticate, addEmployee);
router.put('/:id', authenticate, editEmployee);
router.delete('/:id', authenticate, removeEmployee);

export default router;

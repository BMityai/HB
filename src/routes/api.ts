import express from 'express';
import { Request, Response, NextFunction } from 'express';
import RetailCrmController from '../app/Http/Controllers/RetailCrmController';
const router = express.Router();


// retailCrmController
const retailCrmController = new RetailCrmController();
router.get('/api/halyk_bank/new_order', (request: Request, response: Response, next: NextFunction) => {
    retailCrmController.createOrder(request, response, next);
});

export default router;

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import RetailCrmController from '../app/Http/Controllers/RetailCrmController';
const router = express.Router();


// retailCrmController
const retailCrmController = new RetailCrmController();

router.post('/api/halyk_bank/new_order', (request: Request, response: Response, next: NextFunction) => {
    retailCrmController.createOrder(request, response, next);
});

router.get('/api/halyk_bank/get_deeplink', (request: Request, response: Response, next: NextFunction) => {
    retailCrmController.getDeeplink(request, response, next);
});


export default router;

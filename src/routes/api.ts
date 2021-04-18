import express from 'express';
import { Request, Response, NextFunction } from 'express';
import HalykBankController from '../app/Http/Controllers/HalykBankController';
import RetailCrmController from '../app/Http/Controllers/RetailCrmController';
const router = express.Router();


// retailCrmController
const retailCrmController = new RetailCrmController;

//halykBankController
const halykBankController = new HalykBankController;


// Requests from crm
router.post('/api/halyk_bank/new_order', (request: Request, response: Response, next: NextFunction) => {
    retailCrmController.createOrder(request, response, next);
});

router.get('/api/halyk_bank/get_deeplink', (request: Request, response: Response, next: NextFunction) => {
    retailCrmController.getDeeplink(request, response, next);
});


// Requests from halyk bank
router.get('/api/orders/:order_number', (request: Request, response: Response, next: NextFunction) => {
    halykBankController.getOrder(request, response, next);
})

router.post('/api/order/confirmation', (request: Request, response: Response, next: NextFunction) => {
    halykBankController.confirmOrder(request, response, next);
})




export default router;

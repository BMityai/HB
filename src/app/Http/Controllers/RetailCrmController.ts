import { Request, Response, NextFunction } from 'express';
import LoggerService from 'sosise-core/build/Services/Logger/LoggerService';
import RetailCrmService from '../../Services/RetailCrmService';
import CreateOrderUnifier from '../../Unifiers/CreateOrderUnifier'
import IOC from 'sosise-core/build/ServiceProviders/IOC';


export default class RetailCrmController {

    /**
     * Receiving order from RetailCrm
     */
    public async createOrder(request: Request, response: Response, next: NextFunction) {
        const logger  = IOC.make(LoggerService) as LoggerService;
        const service = IOC.make(RetailCrmService) as RetailCrmService;
        const createOrderUnifier = new CreateOrderUnifier(request.query);


        try {
            let orderNumber = createOrderUnifier.orderNumber;

            logger.info('Request to create order ' + orderNumber + ' from retail crm');
            service.createOrder(orderNumber);
            logger.info('Order ' + orderNumber + ' created successfully');

            return response.send();
        } catch (error) {
            next(error);
        }
    }
}

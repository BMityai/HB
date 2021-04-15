import { Request, Response, NextFunction } from 'express';
import LoggerService from 'sosise-core/build/Services/Logger/LoggerService';
import RetailCrmService from '../../Services/RetailCrmService';
import CreateOrderUnifier from '../../Unifiers/CreateOrderUnifier'
import IOC from 'sosise-core/build/ServiceProviders/IOC';


export default class RetailCrmController {

    private service: RetailCrmService;
    private logger: LoggerService;

    constructor()
    {
        this.service = IOC.make(RetailCrmService) as RetailCrmService;
        this.logger  = IOC.make(LoggerService) as LoggerService;

    }
    /**
     * Receiving order from RetailCrm
     */
    public async createOrder(request: Request, response: Response, next: NextFunction) {
        const createOrderUnifier = new CreateOrderUnifier(request.query);

        try {
            let orderNumber = createOrderUnifier.orderNumber;

            this.logger.info('Request to create order ' + orderNumber + ' from retail crm');
            await this.service.createOrder(orderNumber);
            this.logger.info('Order ' + orderNumber + ' created successfully');

            return response.send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * Receiving order from RetailCrm
     */
    public async getDeeplink(request: Request, response: Response, next: NextFunction) {
        const createOrderUnifier = new CreateOrderUnifier(request.query);

        try {
            let orderNumber = createOrderUnifier.orderNumber;

            this.logger.info('Request to Get DeepLink ' + orderNumber + ' from retail crm');
            const deeplink = await this.service.getDeeplink(orderNumber);
            this.logger.info('Deeplink ' + deeplink + ' for order #' + orderNumber + ' created successfully');

            return response.send();
        } catch (error) {
            next(error);
        }
    }
}

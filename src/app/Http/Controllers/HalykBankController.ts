import { Request, Response, NextFunction } from 'express';
import { isEmpty, isNull } from 'lodash';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import LoggerService from 'sosise-core/build/Services/Logger/LoggerService';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import HalykBankService from '../../Services/HalykBankService';
import RetailCrmService from '../../Services/RetailCrmService';
import ConfirmOrderUnifier from '../../Unifiers/ConfirmOrderUnifier';
import CreateOrderUnifier from '../../Unifiers/CreateOrderUnifier';

export default class HalykBankController {

    private retailCrmService: RetailCrmService;
    private service: HalykBankService;
    private logger: LoggerService;

    constructor()
    {
        this.retailCrmService = IOC.make(RetailCrmService) as RetailCrmService;
        this.service = IOC.make(HalykBankService) as HalykBankService;
        this.logger  = IOC.make(LoggerService) as LoggerService;

    }
    /**
     * Processing a request from bank to receive an order
     */
    public async getOrder(request: Request, response: Response, next: NextFunction) {

        // Init unifier
        const orderNumberUnifier = new CreateOrderUnifier(request.params);
        try {

            // Get order number
            const orderNumber = orderNumberUnifier.orderNumber;

            this.logger.info('Request for order # ' + orderNumber + ' from Halyk Bank');
            
            // Prepare halyk bank order and get by number from db
            var order = await this.service.getOrder(orderNumber);

            // Requesting an order from retailCrm if there is no such order in the database
            if(isNull(order)) {
                await this.retailCrmService.createOrder(orderNumber);
                order = await this.service.getOrder(orderNumber);
            }

            // Log
            this.logger.info('Order # ' + orderNumber + ' successfully exported to Halyk Bank');
            
            // Remove unnecessary class properties
            order?.deleteProps(['order', 'id', 'site', 'payment_id']);

            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 0,
                message: 'success',
                data: order
            };

            // Send response
            return response.send(httpResponse);

        } catch (error) {
            next(error);
        }
    }

    public async confirmOrder(request: Request, response: Response, next: NextFunction)
    {
        // Unifier init
        const confirmOrderUnifier = new ConfirmOrderUnifier(request.body);

        try {

            // Get request data
            const confirmOrderInfo = confirmOrderUnifier.confirmOrderInfo;

            // Logger
            this.logger.info('Request for confirmation of order #' + confirmOrderInfo.orderNumber + ' from Halyk Bank');

            // Confirm order and sync with crm
            await this.service.confirmOrder(confirmOrderInfo);

             // Logger
             this.logger.info('Order #' + confirmOrderInfo.orderNumber + ' successfully synchronized with crm');

             // Prepare http response
            const httpResponse = {
                code: 0,
                message: 'success',
            };

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}

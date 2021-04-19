import { isEmpty, isNull } from "lodash";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import LoggerService from "sosise-core/build/Services/Logger/LoggerService";
import StoresEnum from "../Enums/StoresEnum";
import CantAddLoanDetailsToCrmException from "../Exceptions/CantAddLoanDetailsToCrmException";
import NoSuchOrderException from "../Exceptions/NoSuchOrderException";
import HalykBankDbRepositoryInterface from "../Repositories/HalykBankDbRepositoryInterface";
import HalykBankRepositoryInterface from "../Repositories/HalykBankRepositoryInterface";
import RetailCrmRepository from "../Repositories/RetailCrmRepository";
import ConfirmOrderInfoType from "../Types/ConfirmOrderInfoType";
import HalykBankOrderType from "../Types/HalykBankOrderType";

export default class HalykBankService {
    halykBankDbRepository: HalykBankDbRepositoryInterface;
    halykBankRepository: HalykBankRepositoryInterface;
    retailCrmRepository: RetailCrmRepository;
    private logger: LoggerService;


    /**
     * Constructor
     */
    constructor(
        HalykBankDbRepository: HalykBankDbRepositoryInterface,
        HalykBankRepository: HalykBankRepositoryInterface,
        RetailCrmRepository: RetailCrmRepository
    ) {
        this.halykBankDbRepository = HalykBankDbRepository;
        this.halykBankRepository = HalykBankRepository;
        this.retailCrmRepository = RetailCrmRepository;
        this.logger  = IOC.make(LoggerService) as LoggerService;

    }

    /**
     * Get order from db
     */

    public async getOrder(orderNumber: string): Promise<HalykBankOrderType | null> {
        const halykBankOrder = await this.halykBankDbRepository.getOrderByNumber(orderNumber);

        if (!isNull(halykBankOrder)) {
            // Logging to db
            await this.halykBankDbRepository.editComment(halykBankOrder.id, 'Order request from Halyk Bank');

            // Check is confirm
            halykBankOrder.checkIsConfirm();

            // Status check
            halykBankOrder.checkStatus();

            // Logging to db
            await this.halykBankDbRepository.editComment(halykBankOrder.id, 'The order has been exported to Halyk Bank');

            // Change order status
            await this.halykBankDbRepository.changeOrderStatus(halykBankOrder.id, 'exported to bank');

            // Send Confirmation of order export
            this.retailCrmRepository.sendOrderBeenExportedConfirmation(halykBankOrder.orderNumber, halykBankOrder.site as StoresEnum)
        }
        return halykBankOrder;
    }

    /**
     * Order confirmation by the bank
     */
    public async confirmOrder(confirmOrderInfo: ConfirmOrderInfoType): Promise<void> {
        const order = await this.halykBankDbRepository.getOrderByNumber(confirmOrderInfo.orderNumber);

        // Check is not empty and order status
        if (isNull(order) || order.isExportedToBank()) {
            throw new NoSuchOrderException('Order not found in crm');
        }

        // Confirm order in db
        await this.halykBankDbRepository.confirmOrder(confirmOrderInfo);

        // Update customer data in db
        await this.halykBankDbRepository.updateCustomerData(order.id, confirmOrderInfo);

        // Logging to db
        const status = confirmOrderInfo.isConfirm ? 'approved by bank' : 'denied by bank';
        await this.halykBankDbRepository.editComment(order.id, 'Order #' + order.orderNumber + ' app_status changed to "' + status + '"');

        // Send confirm order info to crm
        this.confirmOrderInCrm(order, confirmOrderInfo);
    }

    private async confirmOrderInCrm(order: HalykBankOrderType, confirmOrderInfo: ConfirmOrderInfoType): Promise<void> {
        try {

            const promises = new Array;

            //Change payment status in crm
            promises.push(this.retailCrmRepository.changeOrderPaymentStatus(order.paymentId, confirmOrderInfo));

            // Logging to db
            promises.push(this.halykBankDbRepository.editComment(order.id, 'Order #' + order.orderNumber + ' change payment status in crm'));

            // Update order detail in crm
            promises.push(this.retailCrmRepository.addLoanDetailsToOrder(order, confirmOrderInfo));

            // Logging to db
            promises.push(this.halykBankDbRepository.editComment(order.id, 'Add loan details to order in crm'));

            // Run all promises
            await Promise.all(promises)

        } catch(error) {
            // Logging to db
            await this.halykBankDbRepository.editComment(order.id, 'An error occurred while updating the order in crm. \n' + error)

            this.logger.critical(error);
            
            throw new CantAddLoanDetailsToCrmException('An error occurred while updating the order in crm')
        }
        
    }

}

import { isEmpty, isNull } from "lodash";
import StoresEnum from "../Enums/StoresEnum";
import HalykBankDbRepositoryInterface from "../Repositories/HalykBankDbRepositoryInterface";
import HalykBankRepositoryInterface from "../Repositories/HalykBankRepositoryInterface";
import RetailCrmRepository from "../Repositories/RetailCrmRepository";
import HalykBankOrderType from "../Types/HalykBankOrderType";

export default class HalykBankService {
    halykBankDbRepository: HalykBankDbRepositoryInterface;
    halykBankRepository: HalykBankRepositoryInterface;
    retailCrmRepository: RetailCrmRepository;


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
    }

    /**
     * Get Order From Db
     */

    public async getOrder(orderNumber: string): Promise <HalykBankOrderType | null>
    {
       const halykBankOrder = await this.halykBankDbRepository.getOrderByNumber(orderNumber);

        if( !isNull(halykBankOrder)) {
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

}

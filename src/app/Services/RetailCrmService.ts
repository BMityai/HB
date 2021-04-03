import IsNotHalykBankException from '../Exceptions/IsNotHalykBankException';
import HalykBankDbRepository from '../Repositories/HalykBankDbRepositoryInterface'
import HalykBankRepository   from '../Repositories/HalykBankRepositoryInterface'
import RetailCrmRepository   from '../Repositories/RetailCrmRepositoryInterface'
import CrmOrderType from "../Types/CrmOrderType";


export default class RetailCrmService {

    private halykBankDbRepository: HalykBankDbRepository
    private halykBankRepository: HalykBankRepository
    private retailCrmRepository: RetailCrmRepository


    /**
     * Constructor
     */
    constructor(
        halykBankDbRepository: HalykBankDbRepository, 
        halykBankRepository: HalykBankRepository, 
        retailCrmRepository: RetailCrmRepository) {
            this.halykBankDbRepository = halykBankDbRepository
            this.halykBankRepository = halykBankRepository
            this.retailCrmRepository = retailCrmRepository
    }

    /**
     * Get order by naumber from CRM and save to DB
     * 
     * @param orderNumber 
     */
    public async createOrder(orderNumber:number): Promise<any> {
        const crmOrder = await this.retailCrmRepository.getOrderByNumber(orderNumber);
        this.checkIsHalyk(crmOrder);
        

    }

    /**
     * Check Is Halyk Bank Payment Order
     * 
     * @CrmOrderType crmOrder 
     * @returns void 
     */
    private checkIsHalyk(crmOrder:CrmOrderType ): void {
        const key = Object.keys(crmOrder.payments)[0];
        const type = crmOrder.payments[key].type;
        if (type == 'halyk-credit' ) {
            return;
        }
        if (type == 'halyk-rassrochka' ) {
            return;
        }
        throw new IsNotHalykBankException('Order #' + crmOrder.number + ' Is Not HB Order');
    }
}

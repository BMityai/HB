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
     * Get order by number from CRM and save to DB
     * 
     * @param orderNumber 
     */
    public async createOrder(orderNumber:number): Promise<any> {
        const crmOrder = await this.retailCrmRepository.getOrderByNumber(orderNumber);
        crmOrder.checkIsHalyk();
        
        console.log(crmOrder);
    }

    
}

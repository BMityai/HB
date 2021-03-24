import HalykBankDbRepository from '../Repositories/HalykBankDbRepositoryInterface'
import HalykBankRepository   from '../Repositories/HalykBankRepositoryInterface'
import RetailCrmRepository   from '../Repositories/RetailCrmRepositoryInterface'

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

    public async createOrder(orderNumber:number): Promise<any> {
        let crmOrder = await this.retailCrmRepository.getOrderByNumber(orderNumber);
        console.log(orderNumber);
    }
}

import HalykBankDbRepository from '../Repositories/HalykBankDbRepositoryInterface'
import HalykBankRepository from '../Repositories/HalykBankRepositoryInterface'
import RetailCrmRepository from '../Repositories/RetailCrmRepositoryInterface'
import CrmOrderType from "../Types/CrmOrderType";


export default class RetailCrmService {

    private halykBankDbRepository: HalykBankDbRepository
    private halykBankRepository: HalykBankRepository
    private retailCrmRepository: RetailCrmRepository

    private SKIP_PRODUCT_STATUSES = [
        'niet-nighdie-na-ostatkakh',
        'otmienien-nie-ponravilsia-tovar',
        'otmienien-niedozvon',
        'nie-ustroila-stoimost-dostavki',
        'nie-ustroili-sroki-vypolnieniia',
        'nie-otpravliaiem-po-rieghlamientu',
        'failure',
        'otkaz-pri-obrabotkie',
        'otkaz-pri-ghotovnosti',
        'otmienien-nie-ustroila-dostavka',
        'otmienien-nie-ustroila-tsiena',
        'otmienien-kupil-v-drughom-miestie',
        'otmienien-nie-vykuplien-v-srok',
        'otmienien-oshibka-oformlieniia',
        'otmienien-tiestovyi-zakaz'
    ]


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
    public async createOrder(orderNumber: number): Promise<any> {
        const crmOrder = await this.retailCrmRepository.getOrderByNumber(orderNumber);

        //check is halyk bank order before save order
        crmOrder.checkIsHalyk();

        //save order
        const orderId = await this.halykBankDbRepository.saveOrder(crmOrder);
     
        const promises = new Array;

        //save customer phone promise
        promises.push(new Promise((resolve, reject) => {
                resolve(this.halykBankDbRepository.saveCustomerPhone(crmOrder.customerPhone, orderId));
            })
        )

        //save order products promise
        promises.push(new Promise((resolve, reject) => {
                resolve(this.saveOrderProducts(crmOrder, orderId));
            })
        )

        //save spend bonuses promise
        promises.push(new Promise((resolve, reject) => {
                resolve(this.halykBankDbRepository.saveSpendBonuses(crmOrder.payment.spendBonuses, orderId));
            })
        )

        //save order service promise
        promises.push(new Promise((resolve, reject) => {
                resolve(this.halykBankDbRepository.saveService(crmOrder.delivery, orderId));
            })
        )

        //save log info to db
        promises.push(new Promise((resolve, reject) => {
                resolve(this.halykBankDbRepository.editComment(orderId, 'import from crm'));
            })
        )

        //run all promises 
        Promise.all(promises);
    }

    protected async saveOrderProducts(crmOrder: CrmOrderType, orderId: number): Promise<void> {
        const promises = new Array
        for (const product of crmOrder.products) {
            if (this.SKIP_PRODUCT_STATUSES.includes(product.status)) {
                continue;
            }
            promises.push(new Promise((resolve, reject) => {
                return resolve(this.halykBankDbRepository.savePerProduct(product, orderId));
            }))
        }
        Promise.all(promises)
    }
}

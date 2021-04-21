import { isNull } from 'lodash';
import StoresEnum from '../Enums/StoresEnum';
import NoSuchOrderException from '../Exceptions/NoSuchOrderException';
import HalykBankDbRepository from '../Repositories/HalykBankDbRepositoryInterface'
import HalykBankRepository from '../Repositories/HalykBankRepositoryInterface'
import RetailCrmRepository from '../Repositories/RetailCrmRepositoryInterface'
import CrmOrderType from "../Types/CrmOrderType";
import HalykBankOrderType from '../Types/HalykBankOrderType';
import LoggerService from 'sosise-core/build/Services/Logger/LoggerService';
import IOC from 'sosise-core/build/ServiceProviders/IOC';



export default class RetailCrmService {

    private halykBankDbRepository: HalykBankDbRepository;
    private halykBankRepository: HalykBankRepository;
    private retailCrmRepository: RetailCrmRepository;
    private logger: LoggerService;


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
        retailCrmRepository: RetailCrmRepository
    ) {
        this.halykBankDbRepository = halykBankDbRepository;
        this.halykBankRepository = halykBankRepository;
        this.retailCrmRepository = retailCrmRepository;
        this.logger = IOC.make(LoggerService) as LoggerService;
    }

    /**
     * Get order by number from CRM and save to DB
     * 
     * @param orderNumber 
     */
    public async createOrder(orderNumber: string): Promise<void> {
        const crmOrder = await this.retailCrmRepository.getOrderByNumber(orderNumber);

        // check is halyk bank order before save order
        crmOrder.checkIsHalyk();

        //save order
        const orderId = await this.halykBankDbRepository.saveOrder(crmOrder);

        const promises = new Array;

        //save customer phone promise
        promises.push(this.halykBankDbRepository.saveCustomerPhone(crmOrder.customerPhone, orderId));


        //save order products promise
        promises.push(this.saveOrderProducts(crmOrder, orderId));

        //save spend bonuses promise
        promises.push(this.halykBankDbRepository.saveSpendBonuses(crmOrder.payment.spendBonuses, orderId));

        //save order service promise
        promises.push(this.halykBankDbRepository.saveService(crmOrder.delivery, orderId));


        //save log info to db
        promises.push(this.halykBankDbRepository.editComment(orderId, 'import from crm'));

        //run all promises 
        await Promise.all(promises);
    }

    /**
     * Save Order Products
     * 
     * @param crmOrder 
     * @param orderId 
     */
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

        // Run all promises
        await Promise.all(promises)
    }

    public async getDeeplink(orderNumber: string): Promise<string> {
        // Get order by orderNumber from Retail CRM
        const crmOrder = await this.retailCrmRepository.getOrderByNumber(orderNumber);

        // Check is halyk bank order before get deeplink
        crmOrder.checkIsHalyk();

        // Get deeplink from bank
        const deeplink = await this.halykBankRepository.getDeeplink(crmOrder);

        // Connect deeplink to crm order
        await this.retailCrmRepository.connectDeeplinkWithOrder(crmOrder.number, crmOrder.site as StoresEnum, deeplink);

        return deeplink;
    }

    public async cancelOrder(orderNumber: string): Promise<void> {

        // Get order by orderNumber from Retail CRM
        const order = await this.halykBankDbRepository.getOrderByNumber(orderNumber);

        if (isNull(order)) {
            throw new NoSuchOrderException('Order #' + orderNumber + ' Not Found');
        }

        // Log info to db
        await this.halykBankDbRepository.editComment(order.id, 'Request to cancel order from retail crm');

        try {
            // Send request to bank for cancel order
            await this.cancelOrderInBank(order);

            // Log
            await this.halykBankDbRepository.editComment(order.id, 'Order status successfully changed to "cancel"');
            this.logger.info('Order # ' + orderNumber + ' successfully changed status to "cancel"');

        } catch(error) {
            await this.halykBankDbRepository.editComment(order.id, 'An error occurred while changing the order status to "canceled" in bank. Error: ' + error.message);
            this.logger.critical(error);
        }


    }

    /**
     * Send request to bank for cancel order
     */
    private async cancelOrderInBank(order: HalykBankOrderType): Promise <void> {
        order.checkForIssetBusinessKey();
        await this.halykBankRepository.cancelOrder(order);
    }
        
}

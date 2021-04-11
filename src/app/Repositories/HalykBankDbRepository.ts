import HalykBankDbRepositoryInterface from './HalykBankDbRepositoryInterface';
import Database from 'sosise-core/build/Database/Database';
import dbConfig from '../../config/database';
import halykConfig from '../../config/halyk';
import CrmOrderType from '../Types/CrmOrderType';
import { isNull } from 'lodash';



export default class HalykBankDbRepository implements HalykBankDbRepositoryInterface {


    private dbConnection: Database;

    /**
     * Constructor
     */
    constructor() {
        this.dbConnection = Database.getConnection(dbConfig.default as string);
    }

    /**
     * Save Order From CRM
     */
    public async saveOrder(crmOrder: CrmOrderType): Promise<number>{
        const orderIds = await this.dbConnection.client.table('orders')  
            .insert({
                status: 'wait',
                number: crmOrder.number,
                cart_amount: crmOrder.cartAmount,
                site: crmOrder.site,
                delivery_type:crmOrder.delivery.type, 
                delivery_city: crmOrder.delivery.city,
                delivery_address: crmOrder.delivery.address,
                pickup_point_name: crmOrder.delivery.pickupPointName,
                credit_code: crmOrder.payment.creditCode,
                payment_id: crmOrder.payment.paymentId,
                created_date: crmOrder.createdDate,
                created_at: new Date(),
                updated_at: new Date()
            });
        return orderIds[0];
    }

    /**
     *  Save Spend Bonuses
 
   */
    public async saveSpendBonuses(spendBonuses: number, orderId: number): Promise<void>
    {
        await this.dbConnection.client.table('products').insert(
            {
                order_id: orderId,
                price: 0 - Math.abs(spendBonuses),
                name: 'Оплата бонусами',
                is_service: false,
                quantity: 1,
                group: 'Payd with bonuses',
                brand: 'MHV Bonuses',
                article: 'MHV_Bonuses',
                created_at: new Date(),
                updated_at: new Date()
            }
        )
    }

    /**
     * Save Customer Phone
     */
    public async saveCustomerPhone(phoneNumber: string, orderId: number): Promise <void>
    {
        await this.dbConnection.client.table('customers').insert({
            phone: phoneNumber,
            order_id: orderId,
            created_at: new Date,
            updated_at: new Date()
        })
    }

    /**
     * Save Order Per Product
     */
    public async savePerProduct(product, orderId: number): Promise <void> 
    {
        await this.dbConnection.client.table('products').insert(
            {
                order_id: orderId,
                price: product.price,
                name: product.name,
                is_service: false,
                quantity: product.quantity,
                group: product.group,
                article: product.article,
                created_at: new Date(),
                updated_at: new Date()
            }
        )
    }

    /**
     * saveService
    */public async saveService(deliveryInfo: any, orderId: number): Promise <void>
    {
        await this.dbConnection.client.table('products').insert({
            order_id: orderId,
            price: deliveryInfo.price,
            name: 'Доставка',
            is_service: true,
            quantity: 1,
            brand: 'MHV Delivery Service',
            group: 'Сервис / Доставка',
            article: 'dost-' + orderId, // Банк не знает какое значение передавать в это поле, попросили любое, но не пустое
            created_at: new Date(),
            updated_at: new Date()

        })
    }

    /**
     * Edit Comment
     */
    public async editComment(orderId: number, message: string): Promise <void>
    {
        const order = await this.dbConnection.client.table('orders').select('system_comment').where('id', orderId).first();
        await this.dbConnection.client.table('orders').update({
            system_comment: !isNull(order.system_comment) ? order.system_comment + new Date() + ' - ' + message + '  \n' : new Date() + ' - ' + message + '  \n',
            updated_at: new Date()
        });

    }
}

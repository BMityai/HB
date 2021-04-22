import CancelOrderFromBankException from "../Exceptions/CancelOrderFromBankException";
import CancelOrderFromCrmException from "../Exceptions/CancelOrderFromCrmException";
import IsConfirmHalykBankOrderException from "../Exceptions/IsConfirmHalykBankOrderException";
import NotSetBusinessKeyException from "../Exceptions/NotSetBusinessKeyException";
import OrderIsApprovedByBankException from "../Exceptions/OrderIsApprovedByBankException";

export default class HalykBankOrderType {
    public id: number;
    public site: string;
    public status: string;
    public cartAmount: string;
    public paymentId: string;
    public creditCode: string;
    public orderNumber: string;
    public deliveryType: string;
    public deliveryCity: string;
    public deliveryAddress: string;
    public pickupPointName: string;
    public goods: {
        price: string;
        name: string;
        group: string;
        brand: string;
        article: string;
        isService: string;
        quantity: string;
    }[] = [];
    public client: {
        fio: string;
        mobile: string;
        birthDate: string;
        city: string;
        childQnty: string;
    } = {
            fio: '',
            mobile: '',
            birthDate: '',
            city: '',
            childQnty: '0',
        }

    public businessKey: string | null;
    public order: any;

    constructor(order: any) {
        this.order = order;
        this.id = order.id;
        this.site = order.site;
        this.status = order.status;
        this.paymentId = order.payment_id;
        this.cartAmount = order.cart_amount;
        this.creditCode = order.credit_code;
        this.orderNumber = order.number;
        this.deliveryType = order.delivery_type;
        this.deliveryCity = order.delivery_city;
        this.deliveryAddress = order.delivery_address;
        this.pickupPointName = order.pickup_point_name;
        this.businessKey = order.business_key;
    }

    public setGoods(goods: any): void {
        for (const product of goods) {
            if (product.price == 0) {
                continue;
            }

            this.goods.push({
                price: product.price,
                name: product.name,
                group: product.group,
                brand: product.brand,
                article: product.article,
                isService: product.is_service,
                quantity: product.quantity
            })
        }
    }

    /**
     * Remove unnecessary class properties
     */
    public removeServiceProps(): void {
        const props = ['order', 'id', 'site', 'paymentId', 'businessKey', 'status'];
        for (const prop of props) {
            delete this[prop];
        }
    }

    public checkIsConfirm(): void {
        if (this.order.is_confirm) {
            throw new IsConfirmHalykBankOrderException('The bank has already made a decision on this order')
        }
    }


    public checkStatus(): void {
        const orderStatus = this.order.status;
        const orderNumber = this.order.number;

        // Is cancel from Retail Crm
        if (['cancel', 'done cancel', 'error cancel'].includes(orderStatus)) {
            throw new CancelOrderFromCrmException('Order #' + orderNumber + ' has been canceled by a customer');
        }
        // Is cancel from Bank
        if ((['denied by bank', 'done denied by bank', 'error denied by bank'].includes(orderStatus))) {
            throw new CancelOrderFromBankException('Order #' + orderNumber + ' has been canceled by the bank');
        }
        // Is approved by bank
        if ((['approved by the bank', 'error approved by the bank', 'done approved by the bank'].includes(orderStatus))) {
            throw new OrderIsApprovedByBankException('Order #' + orderNumber + ' has already been received by the bank for processing');
        }
    }

    public isExportedToBank(): boolean {
        return this.order.status != 'exported to bank';
    }

    public checkForIssetBusinessKey() {
        if (!this.businessKey) {
            throw new NotSetBusinessKeyException('Business key not set for order: ' + this.orderNumber);
        }
    }
}

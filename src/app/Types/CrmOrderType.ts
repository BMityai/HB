import IsNotHalykBankOrderException from "../Exceptions/IsNotHalykBankOrderException";
import lodash, { isEmpty, isNull } from 'lodash'

export default class CrmOrderType {
    
    private order: any;
    public number: number;
    public cartAmount: number;
    public site: string;
    public createdDate: string;
    public delivery: {
        type: string;
        city: string;
        address: string;
        pickupPointName: string;
        price: string
    } = {
        type: '',
        city: '',
        address: '',
        pickupPointName: '',
        price: ''
    };
    public payment: {
        paymentId: string;
        paymentType: string;
        creditCode: string;
        spendBonuses: number;
    } = {
        paymentId: '',
        paymentType: '',
        creditCode: '',
        spendBonuses: 0
    };
    public products: {
            status: string,
            price: number,
            name: string,
            group: string,
            article: string,
            isService: boolean,
            quantity: string
    }[] = [];
    public customerPhone: string;


    /**
     * Constructor
     * @param order 
     */
    constructor(order: any) {
        this.number = order.number;
        this.cartAmount = order.customFields.main_payment;
        this.site = order.site;
        this.createdDate = order.createdAt;
        this.order = order;
        this.setProperties();
    }

    public checkIsHalyk(): void
    {
        if(this.payment.paymentType == 'halyk-credit' || this.payment.paymentType == 'halyk-rassrochka') {
            return;
        }
        throw new IsNotHalykBankOrderException('order #' + this.number + ' is NOT Halyk Bank order');
    }

    /**
     * Set Crm Order Type Class Properties
     * @param order 
     */
    protected setProperties() {
        // set paymentType
        this.setPayment();

        //set deliveryType
        this.setDeliveryType();

        //set deliveryCity
        this.delivery.city = this.order.delivery.address.city;

        //set deliveryAddress
        this.setDeliveryAddress();

        //set pickupPointName
        this.setPickupPointName();

        //set creditCode
        this.delivery.price = this.order.delivery.cost;

        //set products
        this.setProducts();

        //set customer Phone
        this.setCustomerPhone();
    }

    /**
     * Set Delivery Type
     * @param order 
     */
    private setDeliveryType(): void
    {
        this.delivery.type = this.order.delivery.code == 2 ? 'pickup' : 'courier_delivery';
    }

    /**
     * Set Delivery Address
     */
    private setDeliveryAddress(): void
    {
        const city = this.order.delivery.address.city || '';
        const street = this.order.delivery.address.text ? ', ' + this.order.delivery.address.text : '';
        this.delivery.address =  city + street;
    }

    /**
     * Set Pickup Point Name
     */
    private setPickupPointName(): void
    {
        this.delivery.pickupPointName = this.order.delivery.code != 2 ? null : this.order.delivery.service.name;
    }

    /**
     * Set Payment
     */
    private setPayment(): void
    {
        const payments = this.order.payments;
        const key = Object.keys(payments)[0];
        
        //setPaymentId
        this.payment.paymentId = key;

        //setPaymentType
        this.payment.paymentType = payments[key].type;
        
        //setCreditCode
        this.payment.creditCode = this.payment.paymentType == 'halyk-credit' ? 'loan' : 'installment';

        //setSpendBonuses
        this.payment.spendBonuses = this.getSpenBonuses();
    }

    /**
     * Get Spend Bonuses
     * @returns 
     */
    private getSpenBonuses(): number
    {
        const payments = this.order.payments;
        for(const key of Object.keys(payments)) {
            let payment = payments[key];
            if(payment.paymentType == 'bonuses-sl' && payment.status == 'paid' && !isEmpty(payment.amount)) {
                return payment.amount;
            }
        };
        return 0;

    }

    /**
     * Set Order Products
     */
    private setProducts(): void
    {
        this.order.items.forEach(item => {
            this.products.push( {
                status: item.status,
                name: item.offer.name,
                price: this.getProductPrice(item),
                group: this.getGroup(item), 
                article: item.offer.xmlId ?? item.offer.externalId,
                isService: false,
                quantity: item.quantity
            })
        });
    }

    /**
     * Get Per Product Price
     * @param item 
     * @returns 
     */
    private getProductPrice(item: any): number
    {
        const discountTotal = item.discountTotal | 0;
        return item.initialPrice - discountTotal;
    }

    /**
     * Get Per Product Group (KIM | Categories)
     * @param item 
     * @returns 
     */
    private getGroup(item): string
    {
        const firstLevel = lodash.get(item, 'properties.kim_name_level1.value', null);
        const secondLevel = lodash.get(item, 'properties.kim_name_level2.value', null);
        const thirdLevel = lodash.get(item, 'properties.kim_name_level3.value', null);

        const firstCategory = firstLevel ?? null;
        const secondCategory = !isNull(secondLevel) ? '/' + secondLevel : null;
        const thirdCategory = !isNull(thirdLevel) ? '/' + thirdLevel : null;

        return firstCategory + secondCategory + thirdCategory;
    }

    /**
     * Set Customer Phone
     */
    private setCustomerPhone(): void
    {
        this.customerPhone = this.getCustomerPhone();
    }

    private getCustomerPhone(): string
    {
        const phone = this.order.phone;
        return phone.replace('/[^\d]/', '');
    }
}

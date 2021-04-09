import IsNotHalykBankOrderException from "../Exceptions/IsNotHalykBankOrderException";

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
    } = {
        type: '',
        city: '',
        address: '',
        pickupPointName: ''
    };
    public payment: {
        paymentId: string;
        paymentType: string;
        creditCode: string;
    } = {
        paymentId: '',
        paymentType: '',
        creditCode: ''
    }


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
        this.setPickupPointName();
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
        console.log(key);
        //setPaymentId
        this.payment.paymentId = key;

        //setPaymentType
        this.payment.paymentType = payments[key].type;
        
        //setCreditCode
        this.payment.creditCode = this.payment.paymentType == 'halyk-credit' ? 'loan' : 'installment';
    }
}

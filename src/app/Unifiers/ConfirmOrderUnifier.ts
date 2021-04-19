import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';
import lodash, { isEmpty, isNull } from 'lodash'
import ConfirmOrderInfoType from '../Types/ConfirmOrderInfoType';


/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class ConfirmOrderUnifier {

    private params: any;
    public confirmOrderInfo: ConfirmOrderInfoType = {
        orderNumber: '',
        isConfirm: false,
        credit: {
            businessKey: '',
            documentNumber: '',
            approvedAmount: '',
            code: '',
            period: 3
        },
        client: {
            iin: '',
            name: '',
            surname: '',
            patronymic: null,
            phone: ''
        }   
    };
    // }

    /**
     * Constructor
     */
    constructor(params: any) {
        // Remember incoming params
        this.params = params;

        // Validate, await is important otherwise we could not catch the exception
        this.validate();

        // Map data
        this.map();
    }

    /**
     * Request data validation
     */
    private validate() {
        // Create validator
        var fields = {
            orderNumber: ['required', 'numeric', 'min:5'],
            isConfirm: ['required', 'boolean']
        };
        if(this.params.isConfirm){
            fields['credit'] = {
                businessKey: ['required', 'string'],
                documentNumber: ['required', 'string'], 
                approvedAmount: ['required'],
                code: ['required', 'string']
            }
            fields['client'] = {
                iin: ['required'], 
                name: ['required', 'string'],
                surname: ['required', 'string'],
                patronymic: ['string'],
                phone: ['required']
            }
        }

        const validator = new Validator(this.params, fields);

        // If it fails throw exception
        if (validator.fails()) {
            throw new ValidationException('Validation exception', (validator.errors.all() as any));
        }
    }

    /**
     * Request data mapping
     */
    private map() {
        this.confirmOrderInfo.orderNumber = this.params.orderNumber;
        this.confirmOrderInfo.isConfirm = this.params.isConfirm;
        if(this.params.isConfirm) {

            // Set credit data
            this.confirmOrderInfo.credit.businessKey = this.params.credit.businessKey;
            this.confirmOrderInfo.credit.documentNumber = this.params.credit.documentNumber;
            this.confirmOrderInfo.credit.approvedAmount = this.params.credit.approvedAmount;
            this.confirmOrderInfo.credit.code = this.params.credit.code;
            this.confirmOrderInfo.credit.period = this.params.credit.period;

            // Set customer data
            this.confirmOrderInfo.client.iin = this.params.client.iin;
            this.confirmOrderInfo.client.name = this.params.client.name;
            this.confirmOrderInfo.client.surname = this.params.client.surname;
            this.confirmOrderInfo.client.patronymic = lodash.get(this.params, 'client.patronymic', null);
            this.confirmOrderInfo.client.phone = this.params.client.phone;
        }
    }
}

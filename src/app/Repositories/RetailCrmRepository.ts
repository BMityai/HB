import axios, { AxiosInstance } from 'axios';
import { defaultsDeep } from 'lodash';
import StoresEnum from '../Enums/StoresEnum';
import retailCrmConfig from '../../config/retailCrm';
import NoSuchOrderException from '../Exceptions/NoSuchOrderException';
import CrmOrderType from '../Types/CrmOrderType';
import RetailCrmRepositoryInterface from './RetailCrmRepositoryInterface';
import ConfirmOrderInfoType from '../Types/ConfirmOrderInfoType';
import HalykBankOrderType from '../Types/HalykBankOrderType';
import dayjs from 'dayjs';

export default class RetailCrmRepository implements RetailCrmRepositoryInterface {
    httpClient: AxiosInstance;
    private url: string;
    private apiKey: string;

    constructor() {
        this.url = retailCrmConfig.baseurl;
        this.apiKey = retailCrmConfig.key;
        this.httpClient = axios.create({
            baseURL: this.url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
    }

    /**
     * Get crm order by number method
     */
    public async getOrderByNumber(orderNumber: string): Promise<CrmOrderType> {
        // Prepare params
        const params = {
            'apiKey': this.apiKey,
            'filter[numbers][]': orderNumber
        }

        // Do request and get repsonse
        const response = await this.httpClient.get('v5/orders', { params: params });

        // Get order out of response
        const order = response.data.orders[0];

        if (!order) {
            throw new NoSuchOrderException('Order #' + orderNumber + ' Not Found In Crm');
        }

        return new CrmOrderType(order);
    }

    /**
     * Send deeplink to Retail CRM
     */
    public async connectDeeplinkWithOrder(orderNumber: string, store: StoresEnum, deeplink: string): Promise<void> {
        // prepare data
        const params = {
            'apiKey': this.apiKey,
            'order': JSON.stringify({
                customFields: {
                    deeplink: deeplink
                },
            }),
            'site': store
        }

        // Send request
        await this.httpClient.post('v5/orders/' + orderNumber + '/edit', params);
    }

    /**
     * Send confirmation of order export
     */
    public async sendOrderBeenExportedConfirmation(orderNumber: string, store: StoresEnum): Promise<void> {
        // Prepare params
        const params = {
            'apiKey': this.apiKey,
            'order': JSON.stringify({
                customFields: {
                    halyk_order_accepted: true
                },
            }),
            'site': store
        }

        // Send request
        await this.httpClient.post('v5/orders/' + orderNumber + '/edit', params);
    }

    /**
     * Сhange the status of payment for the order depending on the decision made on the loan
     */
    public async changeOrderPaymentStatus(paymentId: string, confirmOrderInfo: ConfirmOrderInfoType): Promise<void> {
        const status = confirmOrderInfo.isConfirm ? 'credit-approved' : 'failure';

        // Prepare params
        const params = {
            apiKey: this.apiKey,
            payment: JSON.stringify({
                status: status
            })
        }

        // Send request
        await this.httpClient.post('v5/orders/payments/' + paymentId + '/edit', params);
    }

    /**
     * Add loan details
     */
    public async addLoanDetailsToOrder(order: HalykBankOrderType, confirmOrderInfo: ConfirmOrderInfoType): Promise<void> {
        // Prepare params
        const params = {
            apiKey: this.apiKey,
            site: order.site,
            order: JSON.stringify({
                customFields: {
                    inn: confirmOrderInfo.client.iin,
                    bank_agreement_number: confirmOrderInfo.credit.documentNumber,
                    bank_agreement_date: dayjs().format('DD-MM-YYYY'),
                    name_credit_product: confirmOrderInfo.credit.code == 'loan' ? 'кредит' : 'рассрочка',
                    credit_term: confirmOrderInfo.credit.period,
                },
            })
        }

        // Send request
        await this.httpClient.post('v5/orders/' + order.orderNumber + '/edit', params);
    }

    /**
     * Send a request for successful order cancellation
     */
    public async confirmCancellation(order: HalykBankOrderType): Promise <void>
    {
        // Prepare params
        const params = {
            apiKey: this.apiKey,
            site: order.site,
            order: JSON.stringify({
                customFields: {
                    canceled_by_partner: true
                },
            })
        }

        // Send request
        await this.httpClient.post('v5/orders/' + order.orderNumber + '/edit', params);
    }
}

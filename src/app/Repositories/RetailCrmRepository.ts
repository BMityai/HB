import axios, { AxiosInstance } from 'axios';
import { defaultsDeep } from 'lodash';
import Helper from 'sosise-core/build/Helper/Helper';
import retailCrmConfig from '../../config/retailCrm';
import NoSuchOrderException from '../Exceptions/NoSuchOrderException';
import CrmOrderType from '../Types/CrmOrderType';
import RetailCrmRepositoryInterface from './RetailCrmRepositoryInterface';

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
    public async getOrderByNumber(orderNumber: number): Promise<CrmOrderType> {
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

        // Typecast to return type
        const returnObject: CrmOrderType = {
            number: order.number,
            totalSum: order.customFields.main_payment,
            payments: order.payments,
            site: order.site,
            delivery: order.delivery,
            createdDate: order.createdAt
        };
        return returnObject;
    }
}

import axios, { AxiosInstance } from 'axios';
import { defaultsDeep } from 'lodash';
import Helper from 'sosise-core/build/Helper/Helper';
import retailCrmConfig from '../../config/retailCrm';
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
    public async getOrderByNumber(orderNumber: string): Promise<CrmOrderType | null> {
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
            return null;
        }

        // Typecast to return type
        const returnObject: CrmOrderType = {
            id: order.id,
            externalId: order.externalId,
            totalSum: order.totalSumm
        };

        return returnObject;
    }
}

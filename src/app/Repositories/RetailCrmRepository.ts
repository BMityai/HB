import axios, { AxiosInstance } from 'axios';
import { defaultsDeep } from 'lodash';
import StoresEnum from '../Enums/StoresEnum';
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
    public async connectDeeplinkWithOrder(orderNumber: string, store: StoresEnum, deeplink: string): Promise<void> 
    {
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
       await this.httpClient.post('v5/orders/' + orderNumber + '/edit', params);
    }

    /**
     * Send confirmation of order export
     */
    public async sendOrderBeenExportedConfirmation(orderNumber: string, store: StoresEnum): Promise <void>
    {
        const params = {
            'apiKey': this.apiKey,
            'order': JSON.stringify({
                customFields: {
                    halyk_order_accepted: true
                },
            }),
            'site': store
        }
        await this.httpClient.post('v5/orders/' + orderNumber + '/edit', params);
    }
}

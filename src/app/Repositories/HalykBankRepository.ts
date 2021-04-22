import HalykBankRepositoryInterface from './HalykBankRepositoryInterface';
import halykConfig from '../../config/halyk';
import CrmOrderType from '../Types/CrmOrderType';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import HalykBankOrderType from '../Types/HalykBankOrderType';

export default class HalykBankRepository implements HalykBankRepositoryInterface {

    private httpClient: AxiosInstance;
    private scope: string;
    private clientId: string;
    private clientSecret: string;
    private getTokenUrl: string;

    constructor() {
        this.httpClient = axios.create(
            {
                baseURL: halykConfig.baseurl,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        )
        this.scope = halykConfig.scope;
        this.clientId = halykConfig.clientId;
        this.clientSecret = halykConfig.key;
        this.getTokenUrl = halykConfig.getTokenUrl;
    }

    /**
     * Get Deeplink
     */
    public async getDeeplink(crmOrder: CrmOrderType): Promise<string> {
        const params = {
            orderID: crmOrder.number,
            phone: crmOrder.customerPhone,
            merchant: 'marwin'
        };

        const response = await this.httpClient.get('commodity-credits/deeplinks/short', { params: params });
        return response.data.shortLink;
    }

    /**
     * Send request to bank for cancel order
     */
    public async cancelOrder(order: HalykBankOrderType): Promise<void> {
        // Interservice communication token
        const token = await this.getAnInterserviceCommunicationToken();

        // Prepare url for cancel order
        const url = 'homebank-api/api/v1/applications/commodity-credits/' + order.businessKey + '/status';

        // Prepare params
        const params = {
            status: 'cancelled'
        }

        // Prepare headers 
        const headers = {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json'
        }

        const response = await this.httpClient.put(url, params, {
            headers: headers
        });
    }

    private async getAnInterserviceCommunicationToken(): Promise<string> {

        // Prepare params (form-data)
        let formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        formData.append('scope', 'commodity_credits');
        formData.append('client_id', 'marwin');
        formData.append('client_secret', 'h4v5xRhOJFa75GhTzYvoT1HMesWfbF4kqU4qeNy1nHegTgblrJNWNstF2');

        // Send request
        const response = await this.httpClient.post('', formData, {
            baseURL: this.getTokenUrl,
            headers: {
                ...formData.getHeaders()
            }
        });

        return response.data.access_token;
    }
}

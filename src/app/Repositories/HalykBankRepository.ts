import HalykBankRepositoryInterface from './HalykBankRepositoryInterface';
import halykConfig from '../../config/halyk';
import CrmOrderType from '../Types/CrmOrderType';
import axios, { AxiosInstance } from 'axios';
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
        const token = await this.getAnInterserviceCommunicationToken();
        console.log(token);
    }

    private async getAnInterserviceCommunicationToken(): Promise<void> {

        // Prepare params
        const params = {
            grant_type: 'client_credentials',
            scope: this.scope,
            client_id: this.clientId,
            client_secret: this.clientSecret
        }

        console.log(params);

        const response = await this.httpClient.post('', params, {
            baseURL: this.getTokenUrl,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        
        console.log(response)
        return response.data.access_token;



    }
}

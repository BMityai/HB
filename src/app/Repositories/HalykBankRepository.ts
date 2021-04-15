import HalykBankRepositoryInterface from './HalykBankRepositoryInterface';
import halykConfig from '../../config/halyk';
import CrmOrderType from '../Types/CrmOrderType';
import axios, { AxiosInstance } from 'axios';

export default class HalykBankRepository implements HalykBankRepositoryInterface {
    
    private getDeeplinkurl: string;
    private httpClient: AxiosInstance;

    constructor()
    {
        this.httpClient = axios.create(
            {
                baseURL: halykConfig.baseurl,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        )
    }
    /**
     * Get Deeplink
     */
    public async getDeeplink(crmOrder: CrmOrderType): Promise <string>
    {
        const params = {
            orderID: crmOrder.number,
            phone: crmOrder.customerPhone,
            merchant: 'marwin'
        };

        const response = await this.httpClient.get('commodity-credits/deeplinks/short', {params: params});
        return response.data.shortLink;
    }
}

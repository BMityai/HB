import CrmOrderType from "../Types/CrmOrderType";
import HalykBankOrderType from "../Types/HalykBankOrderType";

export default interface HalykBankRepositoryInterface {
    /**
     * Get Deeplink
     */
    getDeeplink(crmOrder: CrmOrderType): Promise <string>;

    /**
     * Send request to bank for cancel order
     */
    cancelOrder(order: HalykBankOrderType): Promise<void>;
    
}

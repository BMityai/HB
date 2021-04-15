import CrmOrderType from "../Types/CrmOrderType";

export default interface HalykBankRepositoryInterface {
    /**
     * Get Deeplink
     */
    getDeeplink(crmOrder: CrmOrderType): Promise <string>;
    
}

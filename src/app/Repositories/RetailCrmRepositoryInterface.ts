import StoresEnum from "../Enums/StoresEnum";
import CrmOrderType from "../Types/CrmOrderType";

export default interface RetailCrmRepositoryInterface {

    /**
     * Get order by number method
     */
    getOrderByNumber(orderNumber: number): Promise<CrmOrderType>;

    /**
     * Send deeplink to Retail CRM
     */
    connectDeeplinkWithOrder(orderNumber: number, store: StoresEnum, deeplink: string): Promise<void>
}

import StoresEnum from "../Enums/StoresEnum";
import CrmOrderType from "../Types/CrmOrderType";

export default interface RetailCrmRepositoryInterface {

    /**
     * Get order by number method
     */
    getOrderByNumber(orderNumber: string): Promise<CrmOrderType>;

    /**
     * Send deeplink to Retail CRM
     */
    connectDeeplinkWithOrder(orderNumber: string, store: StoresEnum, deeplink: string): Promise<void>

    /**
     * Send Confirmation Of Order Export
     */
    sendOrderBeenExportedConfirmation(orderNumber: string, store: StoresEnum): Promise <void>
}

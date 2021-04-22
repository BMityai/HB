import StoresEnum from "../Enums/StoresEnum";
import ConfirmOrderInfoType from "../Types/ConfirmOrderInfoType";
import CrmOrderType from "../Types/CrmOrderType";
import HalykBankOrderType from "../Types/HalykBankOrderType";

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
     * Send confirmation of order export
     */
    sendOrderBeenExportedConfirmation(orderNumber: string, store: StoresEnum): Promise<void>

    /**
     * Сhange the status of payment for the order depending on the decision made on the loan
     */
    changeOrderPaymentStatus(paymentId: string, confirmOrderInfo: ConfirmOrderInfoType): Promise<void>

    /**
     * Add loan details
     */
    addLoanDetailsToOrder(order: HalykBankOrderType, confirmOrderInfo: ConfirmOrderInfoType): Promise<void> 

    /**
     * Send a request for successful order cancellation
     */
    confirmCancellation(order: HalykBankOrderType): Promise <void>

    


}

import ConfirmOrderInfoType from "../Types/ConfirmOrderInfoType";
import CrmOrderType from "../Types/CrmOrderType";
import HalykBankOrderType from "../Types/HalykBankOrderType";

export default interface HalykBankDbRepositoryInterface {

    /**
     * Save order from crm
     */
    saveOrder(crmOrder: CrmOrderType): Promise<number>

    /**
     * Save spend bonuses in products  
     */
    saveSpendBonuses(spendBonuses: number, orderId: number): Promise<void>

    /**
     * Save customer phone
     */
    saveCustomerPhone(phoneNumber: string, orderId: number): Promise<void>

    /**
     * Save order per product
     */
    savePerProduct(product: any, orderId: number): Promise<void>

    /**
     * Save order service
     */
    saveService(delivery: any, orderId: number): Promise<void>

    /**
     * Edit comment
     */
    editComment(orderId: number, message: string): Promise<void>

    /**
     * Get order by number
     */
    getOrderByNumber(ordreNumber: string): Promise<HalykBankOrderType | null>

    /**
     * Change order status
     */
    changeOrderStatus(orderId: number, status: string): Promise<void>

    /**
     * Confirm order
     */
    confirmOrder(confirmOrderInfo: ConfirmOrderInfoType): Promise<void>

    /**
     * Update customer info
     */
    updateCustomerData(orderId: number, confirmOrderInfo: ConfirmOrderInfoType): Promise <void>
}

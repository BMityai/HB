import CrmOrderType from "../Types/CrmOrderType";
import HalykBankOrderType from "../Types/HalykBankOrderType";

export default interface HalykBankDbRepositoryInterface {

    /**
     * Save Order From CRM
     */
    saveOrder(crmOrder: CrmOrderType): Promise<number>

    /**
     * Save Spend Bonuses In Products  
     */
    saveSpendBonuses(spendBonuses: number, orderId: number): Promise<void>

    /**
     * Save Customer Phone
     */
    saveCustomerPhone(phoneNumber: string, orderId: number): Promise<void>

    /**
     * Save Order Per Product
     */
    savePerProduct(product: any, orderId: number): Promise<void>

    /**
     * Save Order Service
     */
    saveService(delivery: any, orderId: number): Promise<void>

    /**
     * Edit Comment
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
}

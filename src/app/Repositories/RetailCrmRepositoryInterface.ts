import CrmOrderType from "../Types/CrmOrderType";

export default interface RetailCrmRepositoryInterface {

    /**
     * Get order by number method
     */
    getOrderByNumber(orderNumber: string): Promise<CrmOrderType | null>;
}

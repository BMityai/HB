export default interface CrmOrderType {
    number: number;
    totalSum: number;
    payments: object;
    site: string;
    delivery: object;
    createdDate: string;
}

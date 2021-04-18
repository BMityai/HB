export default interface ConfirmOrderInfoType {
    orderNumber: string;
    isConfirm: boolean;
    credit: {
        businessKey: string;
        documentNumber: string;
        approvedAmount: string;
        code: string;
        period: number
    },
    client: {
        iin: string;
        name: string;
        surname: string;
        patronyic: string | null;
        phone: string;
    }   
}

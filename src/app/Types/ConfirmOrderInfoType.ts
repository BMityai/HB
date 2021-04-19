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
        patronymic: string | null;
        phone: string;
    }   
}

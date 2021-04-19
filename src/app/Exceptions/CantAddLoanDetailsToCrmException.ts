import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionForHalykBank from '../Types/ExceptionForHalykBank';

export default class CantAddLoanDetailsToCrmException extends Exception {

    protected httpCode = 500;
    protected code = 3001;

    /**
     * Constructor
     */
    constructor(message: string) {
        super(message);
    }

    /**
     * Handle exception
     */
    public handle(exception: this): ExceptionForHalykBank {
        const response: ExceptionForHalykBank = {
            code: this.code, // optional
            httpCode: this.httpCode, // optional
            message: exception.message
        };
        return response;
    }
}

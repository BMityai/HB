import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionCustomType from '../Types/ExceptionForHalykBank';

export default class IsConfirmHalykBankOrderException extends Exception {

    protected httpCode = 404;
    protected code = 404;

    /**
     * Constructor
     */
    constructor(message: string) {
        super(message);
    }

    /**
     * Handle exception
     */
    public handle(exception: this): ExceptionCustomType {
        const response: ExceptionCustomType = {
            code: this.code, // optional
            httpCode: this.httpCode, // optional
            message: exception.message
        };
        return response;
    }
}

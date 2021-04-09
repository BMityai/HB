import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionCustomType from '../Types/ExceptionCustomType';

export default class IsNotHalykBankOrderException extends Exception {

    // This variables are optional, you may remove them
    protected httpCode = 404;

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
            httpCode: this.httpCode,
            message: exception.message
        };
        return response;
    }
}

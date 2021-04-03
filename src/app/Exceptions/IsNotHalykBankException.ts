import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionCustomType from '../Types/ExceptionCustomType';

export default class IsNotHalykBankException extends Exception {

    // This variables are optional, you may remove them
    protected httpCode = 404;

    /**
     * Constructor
     */
    constructor(message: string) {
        super(message);

        // This is just an example
    }

    /**
     * Handle exception
     */
    public handle(exception: this): ExceptionCustomType {
        const response: ExceptionCustomType = {
            message: exception.message,
        };
        return response;
    }
}

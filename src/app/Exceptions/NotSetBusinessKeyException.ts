import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionResponse from 'sosise-core/build/Types/ExceptionResponse';
import ExceptionForHalykBank from '../Types/ExceptionForHalykBank';

export default class NotSetBusinessKeyException extends Exception {

    protected httpCode = 404;
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
            message: exception.message,
        };
        return response;
    }
}

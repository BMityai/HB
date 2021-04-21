import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionResponse from 'sosise-core/build/Types/ExceptionResponse';
import ExceptionType from '../Types/ExceptionForHalykBank';

export default class NoSuchOrderException extends Exception {

    // This variables are optional, you may remove them
    public exampleVariable: string;
    protected httpCode = 404;
    protected code = 404;

    /**
     * Constructor
     */
    constructor(message: string = 'Order not found') {
        super(message);
    }

    /**
     * Handle exception
     */
    public handle(exception: this): ExceptionType {
        const response: ExceptionType = {
            httpCode: exception.httpCode,
            code: exception.code,
            message: exception.message,
        };
        return response;
    }
}

import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionResponse from 'sosise-core/build/Types/ExceptionResponse';
import ExceptionType from '../Types/ExceptionCustomType';

export default class NoSuchOrderException extends Exception {

    // This variables are optional, you may remove them
    public exampleVariable: string;
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
    public handle(exception: this): ExceptionType {
        const response: ExceptionType = {
            httpCode: exception.httpCode,
            message: exception.message,
        };
        return response;
    }
}

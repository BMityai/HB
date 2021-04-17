/**
 * IOC Config, please register here your services
 */
import RetailCrmService from '../app/Services/RetailCrmService';
import HalykBankDbRepository from '../app/Repositories/HalykBankDbRepository';
import HalykBankRepository from '../app/Repositories/HalykBankRepository';
import RetailCrmRepository from '../app/Repositories/RetailCrmRepository';
import HalykBankService from '../app/Services/HalykBankService';

const iocConfig = {
    /**
     * Singleton services
     *
     * How to register:
     * YourServiceName: () => new YourServiceName()
     *
     * How to use:
     * const logger = IOC.makeSingleton(LoggerService) as LoggerService;
     */
    singletons: {
    },

    /**
     * Non singleton services
     *
     * How to register:
     * YourServiceName: () => new YourServiceName()
     *
     * How to use:
     * const logger = IOC.make(LoggerService) as LoggerService;
     */
    nonSingletons: {
        /**
         * This service is included in the core out of the box
         * If you want to override LoggerService just uncomment this code and import all necessary modules
         */
        // LoggerService: () => {
        //     if (process.env.APP_ENV === 'local') {
        //         return new LoggerService(new LoggerPrettyConsoleRepository());
        //     }
        //     return new LoggerService(new LoggerJsonConsoleRepository());
        // }

        RetailCrmService:() => {
            return new RetailCrmService(
                new HalykBankDbRepository,
                new HalykBankRepository,
                new RetailCrmRepository
            );
        },

        HalykBankService:() => {
            return new HalykBankService(
                new HalykBankDbRepository,
                new HalykBankRepository,
                new RetailCrmRepository
            );
        },




        
    }
};

export default iocConfig;

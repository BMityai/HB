import HalykBankDbRepositoryInterface from './HalykBankDbRepositoryInterface';
import Axios, { AxiosInstance } from 'axios'
import halykConfig from '../../config/halyk';

export default class HalykBankDbRepository implements HalykBankDbRepositoryInterface {
    /**
     * Example
     */
    public async example(limit: number): Promise<any>
    {
        return 42;
    }
}

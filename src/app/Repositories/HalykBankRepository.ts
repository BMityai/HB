import HalykBankRepositoryInterface from './HalykBankRepositoryInterface';

export default class HalykBankRepository implements HalykBankRepositoryInterface {
    /**
     * Example
     */
    public async example(limit: number): Promise<any>
    {
        return 42;
    }
}

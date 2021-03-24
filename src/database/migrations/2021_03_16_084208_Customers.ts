import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class Customers extends BaseSchema {

    protected tableName = 'table_name_comes_here';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('order_id');
            table.string('name').nullable();
            table.string('surname').nullable();
            table.string('patronymic').nullable();
            table.string('iin').nullable();
            table.string('phone').nullable();
            table.timestamps(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(): Promise<void> {
        await this.dbConnection.schema.dropTable(this.tableName);
    }
}

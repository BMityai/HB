import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class Products extends BaseSchema {

    protected tableName = 'products';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('order_id');
            table.float('price');
            table.string('name');
            table.text('group');
            table.string('brand').nullable();
            table.string('article').nullable();
            table.boolean('is_service');
            table.integer('quantity').nullable();
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

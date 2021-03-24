import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class Orders extends BaseSchema {

    protected tableName = 'orders';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('status').defaultTo('wait');
            table.string('number').unique();
            table.float('cart_amount');
            table.string('site');
            table.string('delivery_type');
            table.string('delivery_city');
            table.string('delivery_address');
            table.string('pickup_point_name').nullable();
            table.string('credit_code');
            table.string('payment_id');
            table.boolean('is_confirm').defaultTo('false');
            table.string('business_key').nullable();
            table.string('document_number').nullable();
            table.string('approved_amount').nullable();
            table.string('code').nullable();
            table.integer('period').nullable();
            table.string('return_token').nullable();
            table.text('system_comment').nullable();
            table.dateTime('created_date');
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

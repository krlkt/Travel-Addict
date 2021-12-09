exports.up = function (knex) {
    return knex.schema
        .createTable('reisen', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.date('startDatum').notNullable();
            table.date('endDatum').notNullable();
            table.string('land').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('reisen')
}

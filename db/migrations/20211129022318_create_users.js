exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('userName', 255).notNullable();
            table.string('email').notNullable();
            table.string('password').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
}

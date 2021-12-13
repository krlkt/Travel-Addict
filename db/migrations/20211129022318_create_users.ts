import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('users', function (table) {
            table.string('email').notNullable();
            table.string('password').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('users')
}

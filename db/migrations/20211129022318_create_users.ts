import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('users', function (table) {
            table.uuid('id').primary()
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.boolean('confirmed').notNullable();
            table.string('confirmationCode').unique()
            table.timestamp('confirmationCodeValidUntil')
        })
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('users')
}

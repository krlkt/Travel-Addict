"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema
        .createTable('users', function (table) {
        table.uuid('id').primary();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.boolean('confirmed').notNullable();
        table.string('confirmationCode').unique();
        table.timestamp('confirmationCodeValidUntil');
    });
}
exports.up = up;
;
async function down(knex) {
    return knex.schema
        .dropTableIfExists('users');
}
exports.down = down;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema
        .createTable('reisen', function (table) {
        table.uuid('id').primary();
        table.string('name', 255).notNullable();
        table.date('startDatum').notNullable();
        table.date('endDatum').notNullable();
        table.string('land').notNullable();
        table.uuid('user_id').references('id').inTable('users').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}
exports.up = up;
;
async function down(knex) {
    return knex.schema
        .dropTableIfExists('reisen');
}
exports.down = down;

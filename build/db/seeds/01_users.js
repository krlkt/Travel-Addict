"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex("expenses").del();
    // Inserts seed entries
    await knex("expenses").insert([
        { email: 'karelkarunia24@gmail.com', password: 'karel1' },
        { email: 'admin@ta', password: 'admin' },
    ]);
}
exports.seed = seed;
;

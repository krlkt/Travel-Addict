"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    // Deletes ALL existing entries
    return knex('reisen').del()
        .then(function () {
        // Inserts seed entries
        return knex('reisen').insert([
            { id: "1eaae687-ad09-4824-b53d-0d7563d92951", name: 'Ferien', startDatum: '2018-04-19', endDatum: '2018-05-19', land: 'DE', user_id: '24ce658d-9a12-4783-96ad-924464e68080' },
            { id: "24ce658d-9a12-4783-96ad-924464e6ecf0", name: 'Familienausflug', startDatum: '2019-06-10', endDatum: '2019-06-20', land: 'RU', user_id: '24ce658d-9a12-4783-96ad-924464e68080' },
        ]);
    });
}
exports.seed = seed;
;

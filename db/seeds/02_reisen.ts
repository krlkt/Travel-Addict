import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    return knex('reisen').del()
        .then(function () {
            // Inserts seed entries
            return knex('reisen').insert([
                { id: "1", name: 'Ferien', startDatum: '2018-04-19', endDatum: '2018-05-19', land: 'DE' },
                { id: "2", name: 'Familienausflug', startDatum: '2019-06-10', endDatum: '2019-06-20', land: 'RU' },
            ]);
        });
};

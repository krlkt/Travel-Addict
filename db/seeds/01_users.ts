import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("expenses").del();

  // Inserts seed entries
  await knex("expenses").insert([
    { email: 'karelkarunia24@gmail.com', password: 'karel1' },
    { email: 'admin@ta', password: 'admin' },
  ]);
};

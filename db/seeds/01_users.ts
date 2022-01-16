import { Knex } from "knex";
import bcrypt from "bcrypt";


export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();
  const salt = await bcrypt.genSalt();
  const hunterpasswordHash = await bcrypt.hash('hunter2', salt);
  const adminpasswordHash = await bcrypt.hash('admin', salt);

  // Inserts seed entries
  await knex("users").insert([
    { id: '1eaae687-ad09-4824-b53d-0d7563d98080', email: 'huehne@htw-berlin.de', password: hunterpasswordHash, confirmed: true },
    { id: '24ce658d-9a12-4783-96ad-924464e68080', email: 'admin@ta', password: adminpasswordHash, confirmed: true },
  ]);
};

import { Knex } from "knex";
import bcrypt from "bcrypt";


export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("expenses").del();
  const salt = await bcrypt.genSalt();
  const karel1passwordHash = await bcrypt.hash('karel1', salt);
  const adminpasswordHash = await bcrypt.hash('admin', salt);

  // Inserts seed entries
  await knex("expenses").insert([
    { email: 'karelkarunia24@gmail.com', password: karel1passwordHash },
    { email: 'admin@ta', password: adminpasswordHash },
  ]);
};

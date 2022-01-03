import crypto from "crypto";
import { Knex } from "knex";

type Reise = {
  name: string;
  startDatum: Date;
  endDatum: Date;
  land: string;
  user_email: string;
};

type SavedReise = Reise & {
  id: string;
};

class ReiseService {
  reisen: SavedReise[] = [];
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async add(reise: Reise): Promise<SavedReise> {
    const newReise = {
      ...reise,
      id: crypto.randomUUID(),
    };
    await this.knex("reisen").insert(newReise);
    return newReise;
  }

  // TODO make sure only reisen belonged to user can delete their reisen
  async delete(uuid: string): Promise<void> {
    await this.knex("reisen").where({ id: uuid }).delete();
  }

  async update(uuid: string, newReise: Reise): Promise<void> {
    await this.knex("reisen").where({ id: uuid }).update(newReise);
  }

  async getAll(): Promise<SavedReise[]> {
    return this.knex("reisen");
  }

  async getUserEmail(id: string): Promise<string> {
    var reise = await this.knex("reisen").where({ id }).first()
    return reise.user_email
  }
}

export default ReiseService;

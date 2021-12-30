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

  async getAll(): Promise<Reise[]> {
    return this.knex("reisen");
  }

  async getReisenByUserId(userId: string): Promise<Reise[]> {
    return this.knex("reisen").where({ user_id: userId });
  }
}

export default ReiseService;

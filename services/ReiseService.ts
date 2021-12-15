import crypto from "crypto";
import { Knex } from "knex";

type Reise = {
  name: string;
  startDatum: Date;
  endDatum: Date;
  land: string;
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

  async delete(uuid: string): Promise<void> {
    await this.knex("reisen").where({ id: uuid }).delete();
  }

  async update(uuid: string, newReise: Reise): Promise<void>
  {
    await this.knex("reisen").where({id: uuid}).update(newReise);
  }

  async getAll(): Promise<Reise[]> {
    return this.knex("reisen");
  }
}

export default ReiseService;

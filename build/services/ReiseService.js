"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class ReiseService {
    constructor(knex) {
        this.reisen = [];
        this.knex = knex;
    }
    async add(reise) {
        const newReise = {
            ...reise,
            id: crypto_1.default.randomUUID(),
        };
        await this.knex("reisen").insert(newReise);
        return newReise;
    }
    async delete(uuid) {
        await this.knex("reisen").where({ id: uuid }).delete();
    }
    async getAll() {
        return this.knex("reisen");
    }
}
exports.default = ReiseService;

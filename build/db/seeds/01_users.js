"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed(knex) {
    // Deletes ALL existing entries
    await knex("users").del();
    const salt = await bcrypt_1.default.genSalt();
    const hunterpasswordHash = await bcrypt_1.default.hash('hunter2', salt);
    const adminpasswordHash = await bcrypt_1.default.hash('admin', salt);
    // Inserts seed entries
    await knex("users").insert([
        { id: '1eaae687-ad09-4824-b53d-0d7563d98080', email: 'huehne@htw-berlin.de', password: hunterpasswordHash, confirmed: true },
        { id: '24ce658d-9a12-4783-96ad-924464e68080', email: 'admin@ta', password: adminpasswordHash, confirmed: true },
    ]);
}
exports.seed = seed;
;

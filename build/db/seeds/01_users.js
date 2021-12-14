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
    const karel1passwordHash = await bcrypt_1.default.hash('karel1', salt);
    const adminpasswordHash = await bcrypt_1.default.hash('admin', salt);
    // Inserts seed entries
    await knex("users").insert([
        { email: 'karelkarunia24@gmail.com', password: karel1passwordHash },
        { email: 'admin@ta', password: adminpasswordHash },
    ]);
}
exports.seed = seed;
;

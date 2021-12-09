"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knexfile_1 = __importDefault(require("../knexfile"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const knex_1 = __importDefault(require("knex"));
const redis_1 = require("redis");
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Successfully connected to redis"));
const knex = (0, knex_1.default)(knexfile_1.default);
// Redis version 3 does not support the promise based
// interface yet. We can use node's `promisify` function
// though to turn the non-promise code into code that
// does return Promises and can hence be `await`ed.
const getAsync = (0, util_1.promisify)(client.get).bind(client);
const setExAsync = (0, util_1.promisify)(client.setex).bind(client);
class AuthService {
    async create(newUser) {
        const salt = await bcrypt_1.default.genSalt();
        const passwordHash = await bcrypt_1.default.hash(newUser.password, salt);
        await knex("users").insert({
            ...newUser,
            password: passwordHash,
        });
    }
    async delete(email) {
        await knex("users").where({ email }).delete();
    }
    async checkPassword(email, password) {
        const dbUser = await knex("users").where({ email }).first();
        if (!dbUser) {
            return false;
        }
        return bcrypt_1.default.compare(password, dbUser.password);
    }
    async login(email, password) {
        const correctPassword = await this.checkPassword(email, password);
        if (correctPassword) {
            const sessionId = crypto_1.default.randomUUID();
            // Set the new value with an expiry of 1 hour
            await setExAsync(sessionId, 60 * 60, email);
            return sessionId;
        }
        return undefined;
    }
    async getUserEmailForSession(sessionId) {
        return getAsync(sessionId);
    }
}
exports.default = AuthService;

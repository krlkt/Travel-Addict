"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomResponse = void 0;
const knexfile_1 = __importDefault(require("../knexfile"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const knex_1 = __importDefault(require("knex"));
const redis_1 = require("redis");
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const nodemailer_config_1 = require("../nodemailer.config");
// jwt variables
const sign = require('jwt-encode');
const secret = 'secret';
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
var CustomResponse;
(function (CustomResponse) {
    CustomResponse[CustomResponse["successful"] = 0] = "successful";
    CustomResponse[CustomResponse["failed"] = 1] = "failed";
    CustomResponse[CustomResponse["alreadyConfirmed"] = 2] = "alreadyConfirmed";
    CustomResponse[CustomResponse["userNotFound"] = 3] = "userNotFound";
    CustomResponse[CustomResponse["confirmationCodeExpired"] = 4] = "confirmationCodeExpired";
})(CustomResponse = exports.CustomResponse || (exports.CustomResponse = {}));
class AuthService {
    async create(newUser) {
        // set 'confirmation code valid until' to tomorrow
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // first check whether the user already exist
        const email = newUser.email;
        const newUser_email = await knex("users").where({ email }).first();
        // if new user email does not already exist, create the user
        if (!newUser_email) {
            const jwt = sign({ email: newUser.email }, secret);
            const salt = await bcrypt_1.default.genSalt();
            const passwordHash = await bcrypt_1.default.hash(newUser.password, salt);
            await knex("users").insert({
                id: crypto_1.default.randomUUID(),
                ...newUser,
                password: passwordHash,
                confirmed: false,
                confirmationCode: jwt,
                confirmationCodeValidUntil: tomorrow
            });
            (0, nodemailer_config_1.sendConfirmationEmail)(email, jwt);
            return true;
        }
        return false;
    }
    async delete(email) {
        await knex("users").where({ email }).delete();
    }
    async checkPassword(email, password) {
        const dbUser = await knex("users").where({ email }).first();
        if (!dbUser || !dbUser.confirmed) {
            console.log('email not found or email is not confirmed');
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
    async confirmAccount(confirmationCode) {
        const user = await knex("users").where({ confirmationCode: confirmationCode }).first();
        if (!user) {
            return CustomResponse.userNotFound;
        }
        const validUntil = user.confirmationCodeValidUntil;
        const now = new Date();
        // check valid until - now, if positive, its is in the past
        if ((now.getTime() - validUntil.getTime()) > 0) {
            console.log('valid Until is in the past, deleting the account...');
            await knex("users").where({ confirmationCode: confirmationCode }).del();
            return CustomResponse.confirmationCodeExpired;
        }
        // if email already confirmed, return alreadyConfirmed
        if (user["confirmed"] == true) {
            return CustomResponse.alreadyConfirmed;
        }
        user["confirmed"] = true;
        const updatedUser = await knex('users').where({ confirmationCode: confirmationCode }).update(user);
        if (updatedUser) {
            return CustomResponse.successful;
        }
        else {
            return CustomResponse.failed;
        }
    }
    async getAll() {
        return knex("users");
    }
}
exports.default = AuthService;

import config from "../knexfile";
import bcrypt from "bcrypt";
import Knex from "knex";

import { createClient } from "redis";
import crypto from "crypto";
import { promisify } from "util";
import { sendConfirmationEmail } from "../nodemailer.config"

// jwt variables
const sign = require('jwt-encode');
const secret = 'secret';

const client = createClient({
    url: process.env.REDIS_URL,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Successfully connected to redis"));



const knex = Knex(config);

// Redis version 3 does not support the promise based
// interface yet. We can use node's `promisify` function
// though to turn the non-promise code into code that
// does return Promises and can hence be `await`ed.
const getAsync = promisify(client.get).bind(client);
const setExAsync = promisify(client.setex).bind(client);

interface User {
    email: string;
    password: string;
    confirmed: boolean;
    confirmationCode: string;
    confirmationCodeValidUntil: Date;
}

export enum CustomResponse {
    successful,
    failed,
    alreadyConfirmed,
    userNotFound,
    confirmationCodeExpired
}
class AuthService {
    async create(newUser: User): Promise<Boolean> {
        // set 'confirmation code valid until' to tomorrow
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        // first check whether the user already exist
        const email = newUser.email
        const newUser_email = await knex<User>("users").where({ email }).first();
        // if new user email does not already exist, create the user
        if (!newUser_email) {
            const jwt = sign({ email: newUser.email }, secret);
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(newUser.password, salt);
            await knex("users").insert({
                id: crypto.randomUUID(),
                ...newUser,
                password: passwordHash,
                confirmed: false,
                confirmationCode: jwt,
                confirmationCodeValidUntil: tomorrow
            });
            sendConfirmationEmail(email, jwt)
            return true;
        }
        return false;
    }

    async delete(email: string): Promise<void> {
        await knex("users").where({ email }).delete()
    }

    async checkPassword(email: string, password: string): Promise<boolean> {
        const dbUser = await knex<User>("users").where({ email }).first();
        if (!dbUser || !dbUser.confirmed) {
            console.log('email not found or email is not confirmed')
            return false;
        }
        return bcrypt.compare(password, dbUser.password);
    }

    public async login(email: string, password: string): Promise<string | undefined> {
        const correctPassword = await this.checkPassword(email, password);
        if (correctPassword) {
            const sessionId = crypto.randomUUID();
            // Set the new value with an expiry of 1 hour
            await setExAsync(sessionId, 60 * 60, email);
            return sessionId;
        }
        return undefined;
    }

    public async getUserEmailForSession(sessionId: string): Promise<string | null> {
        return getAsync(sessionId);
    }

    async confirmAccount(confirmationCode: string): Promise<CustomResponse> {
        const user = await knex("users").where({ confirmationCode: confirmationCode }).first()
        if (!user) {
            return CustomResponse.userNotFound;
        }
        const validUntil = user.confirmationCodeValidUntil
        const now = new Date()
        // check valid until - now, if positive, its is in the past
        if ((now.getTime() - validUntil.getTime()) > 0) {
            console.log('valid Until is in the past, deleting the account...')
            await knex("users").where({ confirmationCode: confirmationCode }).del()
            return CustomResponse.confirmationCodeExpired
        }
        // if email already confirmed, return alreadyConfirmed
        if (user["confirmed"] == true) {
            return CustomResponse.alreadyConfirmed;
        }
        user["confirmed"] = true;
        const updatedUser = await knex('users').where({ confirmationCode: confirmationCode }).update(user)
        if (updatedUser) {
            return CustomResponse.successful;
        } else {
            return CustomResponse.failed
        }
    }

    async getAll(): Promise<User[]> {
        return knex("users");
    }
}

export default AuthService;

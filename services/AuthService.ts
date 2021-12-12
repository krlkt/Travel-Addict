import config from "../knexfile";
import bcrypt from "bcrypt";
import Knex from "knex";

import { createClient } from "redis";
import crypto from "crypto";
import { promisify } from "util";

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
const setExAsync = promisify(client.setEx).bind(client);

interface User {
    email: string;
    password: string;
}

class AuthService {
    async create(newUser: User): Promise<void> {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newUser.password, salt);
        await knex("users").insert({
            ...newUser,
            password: passwordHash,
        });
    }

    async delete(email: string): Promise<void> {
        await knex("users").where({ email }).delete()
    }

    async checkPassword(email: string, password: string): Promise<boolean> {
        const dbUser = await knex<User>("users").where({ email }).first();
        if (!dbUser) {
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
}

export default AuthService;

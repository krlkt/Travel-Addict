"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const serviceUrl = "http://localhost:8080";
describe(`/login`, () => {
    const authService = new AuthService_1.default();
    beforeAll(async () => {
        await authService.create({
            email: "user@example.org",
            password: "hunter2",
        });
    });
    afterAll(async () => {
        await authService.delete("user@example.org");
    });
    it("returns 400 when required parameter is missing", async () => {
        await (0, supertest_1.default)(serviceUrl)
            .post("/login")
            .send({ email: "no_password@example.org" })
            .expect(400);
    });
    it("returns 401 when sending wrong credentials", async () => {
        await (0, supertest_1.default)(serviceUrl)
            .post("/login")
            .send({ email: "user@example.org", password: "test123" })
            .expect(401);
    });
    it("returns 200 when sending correct credentials", async () => {
        await (0, supertest_1.default)(serviceUrl)
            .post("/login")
            .send({ email: "user@example.org", password: "hunter2" })
            .expect(200)
            .then((response) => {
            expect(response.headers).toMatchObject({
                "set-cookie": [expect.stringMatching("session=.*")],
            });
        });
    });
});

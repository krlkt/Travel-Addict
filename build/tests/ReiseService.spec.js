"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knexfile_1 = __importDefault(require("../knexfile"));
const crypto_1 = __importDefault(require("crypto"));
const knex_1 = require("knex");
const mock_knex_1 = __importDefault(require("mock-knex"));
const ReiseService_1 = __importDefault(require("../services/ReiseService"));
describe("ReiseService", () => {
    const tracker = mock_knex_1.default.getTracker();
    let service;
    beforeAll(() => {
        const knex = (0, knex_1.knex)(knexfile_1.default);
        service = new ReiseService_1.default(knex);
        mock_knex_1.default.mock(knex);
        tracker.install();
    });
    describe("add", () => {
        it("adds a uuid before inserting to db", async () => {
            // Arrange
            jest.spyOn(crypto_1.default, "randomUUID").mockReturnValueOnce("my-uuid-123");
            tracker.on("query", function checkResult(query) {
                expect(query.method).toEqual("insert");
                expect(query.sql).toEqual('insert into "reisen" ("endDatum", "id", "land", "name", "startDatum") values ($1, $2, $3, $4, $5)');
                expect(query.bindings).toEqual([
                    new Date(2021, 1, 2),
                    "my-uuid-123",
                    "DE",
                    "Test Reise",
                    new Date(2021, 1, 1),
                ]);
                query.response(1);
            });
            // Act
            const result = await service.add({
                name: "Test Reise",
                startDatum: new Date(2021, 1, 1),
                endDatum: new Date(2021, 1, 2),
                land: "DE",
                user_email: "admin@ta"
            });
            // Assert
            expect(result).toEqual({
                name: "Test Reise",
                startDatum: new Date(2021, 1, 1),
                endDatum: new Date(2021, 1, 2),
                land: "DE",
                id: "my-uuid-123",
            });
        });
    });
});

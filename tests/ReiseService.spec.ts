import config from "../knexfile";
import crypto from "crypto";
import { knex as knexDriver } from "knex";
import mockKnex from "mock-knex";
import ReiseService from "../services/ReiseService";

describe("ReiseService", () => {
    const tracker = mockKnex.getTracker();
    let service: ReiseService;

    beforeAll(() => {
        const knex = knexDriver(config);
        service = new ReiseService(knex);
        mockKnex.mock(knex);
        tracker.install();
    });

    describe("add", () => {
        it("adds a uuid before inserting to db", async () => {
            // Arrange
            jest.spyOn(crypto, "randomUUID").mockReturnValueOnce("my-uuid-123");
            tracker.on("query", function checkResult(query) {
                expect(query.method).toEqual("insert");
                expect(query.sql).toEqual(
                    'insert into "reisen" ("endDatum", "id", "land", "name", "startDatum") values ($1, $2, $3, $4, $5)'
                );
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
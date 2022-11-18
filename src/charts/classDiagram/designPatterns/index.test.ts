import knex from "knex";
import { getAllDesignPatterns } from ".";
import { ClassDiagram } from "../ClassDiagram";
import { initDatabase } from "../database";
import { relations, classes } from "./singleton/singleton.test";

const dPatterns = [{ id: 1, className: "Singleton", pattern: "singleton" }];

const conn = knex({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);

describe("Singleton tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });

    test("design pattern table exists", async () => {
        expect(conn.schema.hasTable("patterns"));
    });

    test("Get all design patterns", async () => {
        await getAllDesignPatterns(conn).then((res) => {
            expect(JSON.stringify(res)).toStrictEqual(
                JSON.stringify(dPatterns)
            );
        });
    });
});

import { getKnexConnection } from "../database";
import { getAllDesignPatterns } from ".";
import { ClassDiagram } from "../ClassDiagram";
import { initDatabase } from "../database";
import { relations, classes } from "./singleton/singleton.test";

const dPatterns = [{ id: 1, pattern: "singleton" }];

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);

describe("Singleton tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });

    test("design pattern table exists", async () => {
        expect(knex.schema.hasTable("patterns"));
    });

    test("Get all design patterns", async () => {
        await getAllDesignPatterns(knex).then((res) => {
            expect(JSON.stringify(res)).toStrictEqual(
                JSON.stringify(dPatterns)
            );
        });
    });
});

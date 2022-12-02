import {getKnexConnection} from "../database";
import { ClassDiagram } from "../ClassDiagram";
import { initDatabase } from "../database";
import { getPrivateConstructor } from "./queries";
import {
    classes as singletonClasses,
    relations as singletonRelations,
} from "./singleton/singleton.test";

describe("General queries tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        let classDiagram: ClassDiagram = new ClassDiagram(
            singletonClasses,
            singletonRelations
        );
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });

    test("getPrivateConstructor", async () => {
        await getPrivateConstructor(knex, "Singleton").then((res) => {
            expect(JSON.stringify(res)).toStrictEqual(
                JSON.stringify([
                    {
                        id: 7,
                        returnType: "void",
                        name: "Singleton",
                        accessibility: "private",
                        classifier: "none",
                        class: "Singleton",
                    },
                ])
            );
        });
    });
});

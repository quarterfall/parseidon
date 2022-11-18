import knex from "knex";
import { ClassDiagram } from "../ClassDiagram";
import { initDatabase } from "../database";
import { getPrivateConstructor} from "./queries";
import { classes as singletonClasses, relations as singletonRelations } from "./singleton/singleton.test"; 


describe("General queries tests", () => {

    const conn = knex({
        client: "sqlite3",
        connection: {
            filename: ":memory:",
        },
        useNullAsDefault: true,
    });    
    beforeAll(async () => {
            
        let classDiagram: ClassDiagram = new ClassDiagram(singletonClasses, singletonRelations);
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });

    test("getPrivateConstructor", async() => {
        await getPrivateConstructor(conn, "Singleton").then(res => {
            expect(JSON.stringify(res)).toStrictEqual(JSON.stringify([{id: 7, returnType: "void", name: "Singleton", parameter: "", accessibility: "private", classifier: "none", class: "Singleton"}]))
        })
    });

   

});
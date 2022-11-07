import knex from "knex";
import { ClassDiagram } from "../ClassDiagram";
import { initDatabase } from "../database";
import { checkSingletonByName } from "./singleton";

const conn = knex({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});
export const relations = [
    {
        id1: "Animal",
        id2: "Duck",
        relation: { type1: 1, type2: "none", lineType: 0 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Animal",
        id2: "Fish",
        relation: { type1: 1, type2: "none", lineType: 0 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Animal",
        id2: "Zebra",
        relation: { type1: 1, type2: "none", lineType: 0 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Singleton",
        id2: "Singleton",
        relation: { type1: "none", type2: 3, lineType: 0 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
];

export const classes = {
    Animal: {
        id: "Animal",
        type: "",
        cssClasses: [],
        methods: ["+isMammal()", "+mate()"],
        members: ["+int age", "+String gender"],
        annotations: [],
        domId: "classid-Animal-5",
    },
    Duck: {
        id: "Duck",
        type: "",
        cssClasses: [],
        methods: ["+swim()", "+quack()"],
        members: ["+String beakColor"],
        annotations: [],
        domId: "classid-Duck-6",
    },
    Fish: {
        id: "Fish",
        type: "",
        cssClasses: [],
        methods: ["-canEat()"],
        members: ["-int sizeInFeet"],
        annotations: [],
        domId: "classid-Fish-7",
    },
    Zebra: {
        id: "Zebra",
        type: "",
        cssClasses: [],
        methods: ["+run()"],
        members: ["+bool is_wild"],
        annotations: [],
        domId: "classid-Zebra-8",
    },
    Singleton: {
        id: "Singleton",
        type: "",
        cssClasses: [],
        methods: ["-Singleton()", "+getInstance()$ Singleton"],
        members: ["-Singleton singleton$"],
        annotations: [],
        domId: "classid-Singleton-9",
    },
};

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);

describe("Singleton tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });

    test("Check singleton", async () => {
        expect(await checkSingletonByName("Singleton", conn)).toStrictEqual(
            true
        );
        expect(await checkSingletonByName("Animal", conn)).toStrictEqual(false);
        expect(
            await checkSingletonByName("inexistentClass", conn)
        ).toStrictEqual(false);
    });
});

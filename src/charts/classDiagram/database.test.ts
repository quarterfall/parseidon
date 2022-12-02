import { getKnexConnection } from "./database";
import { ClassDiagram } from "./ClassDiagram";
import {
    initDatabase,
    getAllRelations,
    getAllWithRelation,
    getAllClasses,
    getAll,
} from "./database";

import { classes, relations } from "./designPatterns/singleton/singleton.test";

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);
const classes1 = [
    {
        id: "Animal",
        type: "",
        members: "+int age,+String gender",
        methods: "+isMammal(int lol),+mate()",
    },
    {
        id: "Duck",
        type: "",
        members: "+String beakColor",
        methods: "+swim(),+quack()",
    },
    { id: "Fish", type: "", members: "-int sizeInFeet", methods: "-canEat()" },
    { id: "Zebra", type: "", members: "+bool is_wild", methods: "+run()" },
    {
        id: "Singleton",
        type: "",
        members: "-Singleton singleton$",
        methods: "-Singleton(),+getInstance()$ Singleton",
    },
];

const relations1 = [
    {
        id: 1,
        first_class: "Duck",
        relation: "inheritance",
        second_class: "Animal",
    },
    {
        id: 2,
        first_class: "Fish",
        relation: "inheritance",
        second_class: "Animal",
    },
    {
        id: 3,
        first_class: "Zebra",
        relation: "inheritance",
        second_class: "Animal",
    },
    {
        id: 4,
        first_class: "Singleton",
        relation: "association",
        second_class: "Singleton",
    },
];

describe("Database tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });

    test("Get all relations", async () => {
        let i: number = 0;
        await getAllRelations(knex).then((res) => {
            res.forEach((relation) => {
                expect(JSON.stringify(relation)).toStrictEqual(
                    JSON.stringify(relations1[i])
                );
                i++;
            });
        });
    });

    test("Get all inheritance relations", async () => {
        await getAllWithRelation("inheritance", knex).then((res) => {
            res.forEach((relation) => {
                expect(relation.relation).toStrictEqual("inheritance");
            });
        });
    });

    test("Get all classes", async () => {
        let i: number = 0;
        await getAllClasses(knex).then((res) => {
            res.forEach((relation) => {
                expect(JSON.stringify(relation)).toStrictEqual(
                    JSON.stringify(classes1[i])
                );
                i++;
            });
        });
    });

    test("Get all parameters", async () => {
        await getAll(knex, "parameters").then((res) => {
            expect(res).toEqual([
                {
                    id: 1,
                    type: "int",
                    name: "lol",
                    class: "Animal",
                    methodName: "isMammal",
                },
            ]);
        });
    });
});

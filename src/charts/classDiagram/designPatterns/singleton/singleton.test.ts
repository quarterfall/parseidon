import {getKnexConnection} from "../../database";
import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { checkSingletonByName } from "./singleton";
import {
    getPrivateStaticSingletonInstance,
    getPublicMethodReturningSingleton,
    getSingletonInstancesFromOtherClasses,
} from "./singleton.queries";


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
        methods: ["+isMammal(int lol)", "+mate()"],
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
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });

    test("Check singleton", async () => {
        expect(await checkSingletonByName(knex)).toStrictEqual(true);
    });

    test("getPublicMethodsReturningSingleton", async () => {
        await getPublicMethodReturningSingleton(knex, "Singleton").then(
            (res) => {
                expect(JSON.stringify(res)).toStrictEqual(
                    JSON.stringify([
                        {
                            id: 8,
                            returnType: "Singleton",
                            name: "getInstance",
                            accessibility: "public",
                            classifier: "static",
                            class: "Singleton",
                        },
                    ])
                );
            }
        );
    });

    test("getSingletonInstancesFromOtherClasses", async () => {
        await getSingletonInstancesFromOtherClasses(knex, "Singleton").then(
            (res) => {
                expect(res.length).toBe(0);
            }
        );
    });

    test("getPrivateStaticSingletonInstance", async () => {
        await getPrivateStaticSingletonInstance(knex, "Singleton").then(
            (res) => {
                expect(JSON.stringify(res)).toStrictEqual(
                    JSON.stringify([
                        {
                            id: 6,
                            type: "Singleton",
                            name: "singleton",
                            accessibility: "private",
                            classifier: "static",
                            class: "Singleton",
                        },
                    ])
                );
            }
        );
    });
});

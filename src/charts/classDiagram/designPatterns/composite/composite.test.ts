import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { getAllDesignPatterns } from "..";
import knex from "knex";
import { checkClassAndParameterOfMethod, compareClassesIDToSecondClass } from "./composite.queries";
import { checkIfClassOfMemberHasARelation } from "../queries";
const classes = {
    Composite: {
        id: "Composite",
        type: "",
        cssClasses: [],
        methods: ["+add(Component c)", "+remove(Component c)", "+execute()"],
        members: ["-Component[] children"],
        annotations: [],
        domId: "classid-Composite-615",
    },
    Component: {
        id: "Component",
        type: "",
        cssClasses: [],
        methods: ["+execute()"],
        members: [],
        annotations: ["interface"],
        domId: "classid-Component-616",
    },
    Leaf: {
        id: "Leaf",
        type: "",
        cssClasses: [],
        methods: ["+execute()"],
        members: [],
        annotations: [],
        domId: "classid-Leaf-617",
    },
};
const relations = [
    {
        id1: "Composite",
        id2: "Component",
        relation: {
            type1: "none",
            type2: 3,
            lineType: 0,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Leaf",
        id2: "Component",
        relation: {
            type1: "none",
            type2: 1,
            lineType: 1,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Composite",
        id2: "Component",
        relation: {
            type1: "none",
            type2: 1,
            lineType: 1,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Component",
        id2: "Composite",
        relation: {
            type1: "none",
            type2: 0,
            lineType: 0,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
];

const patterns = [
    {
        id: 1,
        className: "all",
        pattern: "composite",
    },
];
const conn = knex({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);

describe("Composite pattern tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });

    test("Test check composite", async() => {
        expect(JSON.stringify(await getAllDesignPatterns(conn))).toStrictEqual(JSON.stringify(patterns));
    });

    test("Test first step", async () => {
        await conn
        .from("relations")
        .select("relations.first_class")
        .where("relations.relation","realization")
        .then(res => {
            expect(res).toEqual([{first_class:"Leaf"}, {first_class:"Composite"}])
        })
    })

    test("Test second step", async () => {
        await conn
        .from("relations")
        .select("relations.first_class")
        .where("relations.relation","realization")
        .join("classes", compareClassesIDToSecondClass())
        .then(res => {
            expect(res).toEqual([{first_class:"Leaf"}, {first_class:"Composite"}])
        })
    })

    test("Test third step", async () => {
        await conn
        .from("relations")
        .select("relations.first_class")
        .where("relations.relation","realization")
        .join("classes", compareClassesIDToSecondClass())
        .join("members", checkIfClassOfMemberHasARelation())
        .whereLike("members.type", "%[]")
        .then(res => {
            expect(res).toEqual([{first_class:"Composite"}])
        })
    })

    test("Test fourth step", async () => {
        await conn
        .from("relations")
        .select("relations.first_class")
        .where("relations.relation","realization")
        .join("classes", compareClassesIDToSecondClass())
        .join("members", checkIfClassOfMemberHasARelation())
        .whereLike("members.type", "%[]")
        .join("methods", checkClassAndParameterOfMethod())
        .then(res => {
            expect(res.length).toEqual(2);
        })
    })
    
});
import knex from "knex";
import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { getAllDesignPatterns } from "..";
import { compareClassIDToClassOfMethod } from "../queries";
import { compareMethodClassToRelationClass, compareMethodReturnTypeToClass } from "./factory.queries";

const classes = {
    CreatorA: {
        id: "CreatorA",
        type: "",
        cssClasses: [],
        methods: ["+createProduct() Product"],
        members: [],
        annotations: [],
        domId: "classid-CreatorA-183",
    },
    Template: {
        id: "Template",
        type: "",
        cssClasses: [],
        methods: ["+Laugh()"],
        members: [],
        annotations: ["interface"],
        domId: "classid-Template-187",
    },
    Creator: {
        id: "Creator",
        type: "",
        cssClasses: [],
        methods: ["+someOperation()", "+createProduct()* Product"],
        members: [],
        annotations: ["abstract"],
        domId: "classid-Creator-184",
    },
    ProductA: {
        id: "ProductA",
        type: "",
        cssClasses: [],
        methods: ["+doStuff()"],
        members: [],
        annotations: [],
        domId: "classid-ProductA-185",
    },
    Product: {
        id: "Product",
        type: "",
        cssClasses: [],
        methods: ["+doStuff()"],
        members: [],
        annotations: ["interface"],
        domId: "classid-Product-186",
    },
};
const relations = [
    {
        id1: "CreatorA",
        id2: "Creator",
        relation: { type1: "none", type2: 1, lineType: 0 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "ProductA",
        id2: "Product",
        relation: { type1: "none", type2: 1, lineType: 1 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Creator",
        id2: "Product",
        relation: { type1: "none", type2: 3, lineType: 1 },
        relationTitle1: "none",
        relationTitle2: "none",
    },
];

const patterns = [
    {
        id:1,
        className: "all",
        pattern: "factory"
    },
    
]

const conn = knex({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);
describe("Factory pattern tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });
    test("check factory pattern",async () => {
        expect(JSON.stringify(await getAllDesignPatterns(conn))).toStrictEqual(JSON.stringify(patterns));
    });

    test("Test first step", async() => {
       await conn
        .from("classes")
        .select("classes.id")
        .join("methods", compareClassIDToClassOfMethod())
        .where("classes.annotations","abstract")
        .andWhere("methods.classifier","abstract")
        .then(res => {
            expect(res).toEqual([{id: "Creator"}])
        })
    });

    test("Test second step", async() => {
        await conn
        .from("classes")
        .select("classes.id")
        .join("methods", compareClassIDToClassOfMethod())
        .where("classes.annotations","abstract")
        .andWhere("methods.classifier","abstract")
        .join("relations", compareMethodReturnTypeToClass())
        .where("relations.relation","realization")
        .then(res => {
            expect(res).toEqual([{id: "Creator"}])
        })
    });

    test("Test third step", async() => {
        await conn
        .from("classes")
        .select("classes.id")
        .join("methods", compareClassIDToClassOfMethod())
        .where("classes.annotations","abstract")
        .andWhere("methods.classifier","abstract")
        .join("relations", compareMethodReturnTypeToClass())
        .where("relations.relation","realization")
        .join("relations as r", compareMethodClassToRelationClass())
        .where("r.relation","inheritance")
        .then(res => {
            expect(res).toEqual([{id: "Creator"}])
        })
    })
});

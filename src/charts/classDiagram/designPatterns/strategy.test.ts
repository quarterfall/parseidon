import knex from "knex";
import { ClassDiagram } from "../ClassDiagram";
import { initDatabase } from "../database";
import { getAllDesignPatterns } from ".";

const classes = {
    Context: {
        id: "Context",
        type: "",
        cssClasses: [],
        methods: ["+setStrategy(strategy)", "+doSomething()"],
        members: ["-Strategy strategy"],
        annotations: [],
        domId: "classid-Context-3986",
    },
    Strategy: {
        id: "Strategy",
        type: "",
        cssClasses: [],
        methods: ["+execute(data)"],
        members: [],
        annotations: ["interface"],
        domId: "classid-Strategy-3987",
    },
    ConcreteStrategy: {
        id: "ConcreteStrategy",
        type: "",
        cssClasses: [],
        methods: ["+execute(data)"],
        members: [],
        annotations: [],
        domId: "classid-ConcreteStrategy-3988",
    },
};
const relations = [
    {
        id1: "Context",
        id2: "Strategy",
        relation: {
            type1: 0,
            type2: "none",
            lineType: 0,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "Context",
        id2: "Strategy",
        relation: {
            type1: "none",
            type2: 3,
            lineType: 0,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "ConcreteStrategy",
        id2: "Strategy",
        relation: {
            type1: "none",
            type2: 1,
            lineType: 1,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
];

const patterns = [
    {
        id:1,
        className: "all",
        pattern: "strategy"
    }
]

const conn = knex({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);
describe("Strategy pattern tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });
    test("check strategy pattern",async () => {
        expect(JSON.stringify(await getAllDesignPatterns(conn))).toStrictEqual(JSON.stringify(patterns));
    });
});
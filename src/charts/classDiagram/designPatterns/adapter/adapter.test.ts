import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { getAllDesignPatterns } from "..";
import knex from "knex";
import { checkIfClassHasRelation, checkIfClassOfMemberHasARelation } from "../queries";
import { checkIfAdapterClassHasRelation} from "./adapter.queries";

const classes = {
        Adapter: {
            id: "Adapter",
            type: "",
            cssClasses: [],
            methods: ["+method(data)"],
            members: ["-Service adaptee"],
            annotations: [],
            domId: "classid-Adapter-3029"
        },
        Service: {
            id: "Service",
            type: "",
            cssClasses: [],
            methods: [
                "+serviceMethod(data)"
            ],
            members: [],
            annotations: [],
            domId: "classid-Service-3030"
        },
        Client_Interface: {
            id: "Client_Interface",
            type: "",
            cssClasses: [],
            methods: [
                "+method(data)"
            ],
            members: [],
            annotations: [
                "interface"
            ],
            domId: "classid-Client_Interface-3031"
        }
    }
   const relations = [
        {
            id1: "Adapter",
            id2: "Service",
            relation: {
                type1: "none",
                type2: 3,
                lineType: 0
            },
            relationTitle1: "none",
            relationTitle2: "none"
        },
        {
            id1: "Adapter",
            id2: "Client_Interface",
            relation: {
                type1: "none",
                type2: 1,
                lineType: 1
            },
            relationTitle1: "none",
            relationTitle2: "none"
        }
]
const patterns = [
    {
        id:1,
        className: "all",
        pattern: "adapter"
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

describe("Adapter pattern tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });

    test("Test check adapter", async() => {
        expect(JSON.stringify(await getAllDesignPatterns(conn))).toStrictEqual(JSON.stringify(patterns));
    });
    
    test("Test first step", async() => {
        await conn
        .from("classes")
        .select("classes.id")
        .where("annotations","interface")
        .then(res => {
            expect(res).toEqual([{id: "Client_Interface"}])
        })
    });

    test("Test second step", async() => {
        await conn
        .from("classes")
        .select("classes.id")
        .where("annotations","interface")
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation","realization")
        .then(res => {
            expect(res).toEqual([{id: "Client_Interface"}])
        })
    });

    test("Test third step", async() => {
        await conn
        .from("classes")
        .select("classes.id")
        .where("annotations","interface")
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation","realization")
        .join("members", checkIfClassOfMemberHasARelation())
        .then(res => {
            expect(res).toEqual([{id: "Client_Interface"}])
        })
    })

    test("Test fourth step", async() => {
        await conn
        .from("classes")
        .select("classes.id")
        .where("annotations","interface")
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation","realization")
        .join("members", checkIfClassOfMemberHasARelation())
        .join("relations as r", checkIfAdapterClassHasRelation())
        .then(res => {
            expect(res).toEqual([{id: "Client_Interface"}])
        })
    })
}); 
import {getKnexConnection} from "../../database";
import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { getAllDesignPatterns } from "..";
import {
    checkIfRelationWithMemberTypeExists,
    checkIfClassHasRelation,
    compareClassIDToClassOfMethod,
} from "../queries";
import { compareMemberTypeToStrategyInterface } from "./strategy.queries";

export const classes = {
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
    Strategy1: {
        id: "Strategy1",
        type: "",
        cssClasses: [],
        methods: [],
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
export const relations = [
    {
        //aggregation
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
        //association
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
        //realization
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
        id: 1,
        className: "all",
        pattern: "strategy",
    },
];

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);
describe("Strategy pattern tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });
    test("check strategy pattern", async () => {
        expect(JSON.stringify(await getAllDesignPatterns(knex))).toStrictEqual(
            JSON.stringify(patterns)
        );
    });

    test("test first step", async () => {
        await knex
            .from("methods")
            .select("methods.name")
            .whereLike("methods.name", "set%")
            .then((res) => {
                expect(res).toEqual([{ name: "setStrategy" }]);
            });
    });

    test("test second step", async () => {
        await knex
            .from("methods")
            .select("methods.name")
            .whereLike("methods.name", "set%")
            .join("classes", compareClassIDToClassOfMethod())
            .join("relations", checkIfClassHasRelation())
            .where("relations.relation", "aggregation")
            .then((res) => {
                expect(res).toEqual([{ name: "setStrategy" }]);
            });
    });

    test("test third step", async () => {
        await knex
            .from("methods")
            .select("methods.name")
            .whereLike("methods.name", "set%")
            .join("classes", compareClassIDToClassOfMethod())
            .join("relations", checkIfClassHasRelation())
            .where("relations.relation", "aggregation")
            .join("members", compareMemberTypeToStrategyInterface())
            .where("members.accessibility", "private")
            .then((res) => {
                expect(res).toEqual([{ name: "setStrategy" }]);
            });
    });

    test("test fourth step", async () => {
        await knex
            .from("methods")
            .select("methods.name")
            .whereLike("methods.name", "set%")
            .join("classes", compareClassIDToClassOfMethod())
            .join("relations", checkIfClassHasRelation())
            .where("relations.relation", "aggregation")
            .join("members", compareMemberTypeToStrategyInterface())
            .where("members.accessibility", "private")
            .join("relations as r", checkIfRelationWithMemberTypeExists())
            .where("r.relation", "realization")
            .then((res) => {
                expect(res).toEqual([{ name: "setStrategy" }]);
            });
    });
});

import { ClassDiagram } from "../../ClassDiagram";
import { getKnexConnection, initDatabase } from "../../database";
import { getAllDesignPatterns } from "..";
import {
    checkClassAndParameterOfMethod,
    compareClassesIDToSecondClass,
    compareParameterToRelationClasses,
} from "./composite.queries";
import { checkIfClassOfMemberHasARelation } from "../queries";
import { checkInterfaceArrayName } from "./composite";
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
    //association
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
    //realization
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
    //realization
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
    //aggregation
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
        pattern: "composite",
    },
];

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);

describe("Composite pattern tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });

    test("Test check composite", async () => {
        expect(JSON.stringify(await getAllDesignPatterns(knex))).toStrictEqual(
            JSON.stringify(patterns)
        );
    });

    test("Test first step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .then((res) => {
                expect(res).toEqual([
                    { first_class: "Leaf" },
                    { first_class: "Composite" },
                ]);
            });
    });

    test("Test second step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .join("classes", compareClassesIDToSecondClass())
            .then((res) => {
                expect(res).toEqual([
                    { first_class: "Leaf" },
                    { first_class: "Composite" },
                ]);
            });
    });

    test("Test third step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .join("classes", compareClassesIDToSecondClass())
            .join("members", checkIfClassOfMemberHasARelation())
            .whereLike("members.type", "%[]")
            .then((res) => {
                expect(res).toEqual([{ first_class: "Composite" }]);
            });
    });

    test("Test fourth step", async () => {
        await knex
            .from("relations")
            .select("*")
            .where("relations.relation", "realization")
            .join("classes", compareClassesIDToSecondClass())
            .join("members", checkIfClassOfMemberHasARelation())
            .whereLike(
                "members.type",
                `${await checkInterfaceArrayName(knex)}[]`
            )
            .join("methods", checkClassAndParameterOfMethod())
            .join("parameters", compareParameterToRelationClasses())
            .then((res) => {
                expect(res.length).toBeGreaterThanOrEqual(2);
            });
    });
});

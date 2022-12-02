import {getKnexConnection} from "../../database";
import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { getAllDesignPatterns } from "..";
import {
    checkParameterOfConstructor,
    compareClassOfMemberToClassID,
    compareRelationFirstClassToClass,
} from "./proxy.queries";
import { compareFirstClassToMemberClass } from "../queries";

const classes = {
    ThirdPartyYTLib: {
        id: "ThirdPartyYTLib",
        type: "",
        cssClasses: [],
        methods: ["+listVideos()", "+getVideoInfo(id)", "+downloadVideo(id)"],
        members: [],
        annotations: ["interface"],
        domId: "classid-ThirdPartyYTLib-33",
    },
    CachedYTClass: {
        id: "CachedYTClass",
        type: "",
        cssClasses: [],
        methods: [
            "+CachedYTClass(ThirdPartyYTClass s)",
            "+listVideos()",
            "+getVideoInfo(id)",
            "+downloadVideo(id)",
        ],
        members: ["-ThirdPartyYTClass service"],
        annotations: [],
        domId: "classid-CachedYTClass-34",
    },
    ThirdPartyYTClass: {
        id: "ThirdPartyYTClass",
        type: "",
        cssClasses: [],
        methods: ["+listVideos()", "+getVideoInfo(id)", "+downloadVideo(id)"],
        members: [],
        annotations: [],
        domId: "classid-ThirdPartyYTClass-35",
    },
};

const relations = [
    {
        id1: "CachedYTClass",
        id2: "ThirdPartyYTLib",
        relation: {
            type1: "none",
            type2: 1,
            lineType: 1,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "ThirdPartyYTClass",
        id2: "ThirdPartyYTLib",
        relation: {
            type1: "none",
            type2: 1,
            lineType: 1,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    {
        id1: "CachedYTClass",
        id2: "ThirdPartyYTLib",
        relation: {
            type1: 0,
            type2: 3,
            lineType: 0,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
];

const patterns = [
    {
        id: 1,
        pattern: "proxy",
    },
];

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);
describe("Proxy pattern tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });
    test("check proxy pattern", async () => {
        expect(JSON.stringify(await getAllDesignPatterns(knex))).toStrictEqual(
            JSON.stringify(patterns)
        );
    });

    test("test first step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .join("classes", compareRelationFirstClassToClass())
            .then((res) => {
                expect(res.length).toBeGreaterThanOrEqual(2);
            });
    });

    test("test second step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .join("classes", compareRelationFirstClassToClass())
            .join("members", compareClassOfMemberToClassID())
            .then((res) => {
                expect(res).toEqual([{ first_class: "CachedYTClass" }]);
            });
    });

    test("test third step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .join("classes", compareRelationFirstClassToClass())
            .join("members", compareClassOfMemberToClassID())
            .join("parameters", checkParameterOfConstructor())
            .then((res) => {
                expect(res).toEqual([{ first_class: "CachedYTClass" }]);
            });
    });

    test("test fourth step", async () => {
        await knex
            .from("relations")
            .select("relations.first_class")
            .where("relations.relation", "realization")
            .join("classes", compareRelationFirstClassToClass())
            .join("members", compareClassOfMemberToClassID())
            .join("parameters", checkParameterOfConstructor())
            .join("relations as r", compareFirstClassToMemberClass())
            .then((res) => {
                expect(res.length).toBeGreaterThanOrEqual(1);
            });
    });
});

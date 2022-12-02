import {getKnexConnection} from "../../database";
import { ClassDiagram } from "../../ClassDiagram";
import { initDatabase } from "../../database";
import { checkObserver } from "./observer";

const classes = {
    EventManager: {
        id: "EventManager",
        type: "",
        cssClasses: [],
        methods: [
            "+subscribe(EventListeners l)",
            "+unsubscribe(EventListeners l)",
            "+notify(EventType event, String data)",
        ],
        members: ["-EventListeners[] listeners"],
        annotations: [],
        domId: "classid-EventManager-60",
    },
    EventListeners: {
        id: "EventListeners",
        type: "",
        cssClasses: [],
        methods: ["+update(String filename)"],
        members: [],
        annotations: ["interface"],
        domId: "classid-EventListeners-61",
    },
    EmailAlertsListener: {
        id: "EmailAlertsListener",
        type: "",
        cssClasses: [],
        methods: ["+update(String filename)"],
        members: [],
        annotations: [],
        domId: "classid-EmailAlertsListener-62",
    },
    LoggingListener: {
        id: "LoggingListener",
        type: "",
        cssClasses: [],
        methods: ["+update(String filename)"],
        members: [],
        annotations: [],
        domId: "classid-LoggingListener-63",
    },
};

const relations = [
    //aggregation/association
    {
        id1: "EventManager",
        id2: "EventListeners",
        relation: {
            type1: 0,
            type2: 3,
            lineType: 0,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
    //realization
    {
        id1: "EmailAlertsListener",
        id2: "EventListeners",
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
        id1: "LoggingListener",
        id2: "EventListeners",
        relation: {
            type1: "none",
            type2: 1,
            lineType: 1,
        },
        relationTitle1: "none",
        relationTitle2: "none",
    },
];

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);

describe("Observer pattern tests", () => {
    const knex = getKnexConnection();
    beforeAll(async () => {
        await initDatabase(knex, classDiagram);
    });

    afterAll(async () => {
        knex.destroy();
    });

    test("Check observer",async () => {
        await checkObserver(knex).then(res => {
            expect(res).toEqual(true);
        })
    })

    // test("Test first step", async () => {
    //     await knex
    //         .from("classes")
    //         .select("*")
    //         .where("classes.type", "interface")
    //         .join("relations", async function () {
    //             this.on("relations.second_class", "classes.id");
    //         })
    //         .where("relations.relation", "realization")
    //         .then((res) => {
    //             expect(res.length).toBeGreaterThanOrEqual(1);
    //         });
    // });

    // test("Test second step", async () => {
    //     await knex
    //         .from("classes")
    //         .select("*")
    //         .where("classes.type", "interface")
    //         .join("relations", async function () {
    //             this.on("relations.second_class", "classes.id");
    //         })
    //         .where("relations.relation", "realization")
    //         .join("relations as r", async function () {
    //             this.on("r.first_class", "classes.id");
    //         })
    //         .where("r.relation", "aggregation")
    //         .then((res) => {
    //             expect(res.length).toBeGreaterThanOrEqual(1);
    //         });
    // });

    // test("Test third step", async () => {
    //     await knex
    //         .from("classes")
    //         .select("*")
    //         .where("classes.type", "interface")
    //         .join("relations", async function () {
    //             this.on("relations.second_class", "classes.id");
    //         })
    //         .where("relations.relation", "realization")
    //         .join("relations as r", async function () {
    //             this.on("r.first_class", "classes.id");
    //         })
    //         .where("r.relation", "aggregation")
    //         .join("members", async function () {
    //             this.on("members.class", "r.second_class");
    //         })
    //         .whereLike(
    //             "members.type",
    //             `${await checkInterfaceArrayName(knex)}[]`
    //         )
    //         .then((res) => {
    //             expect(res.length).toBeGreaterThanOrEqual(1);
    //         });
    // });

    // test("Test fourth step", async () => {
    //     await knex
    //         .from("classes")
    //         .select("*")
    //         .where("classes.type", "interface")
    //         .join("relations", async function () {
    //             this.on("relations.second_class", "classes.id");
    //         })
    //         .where("relations.relation", "realization")
    //         .join("relations as r", async function () {
    //             this.on("r.first_class", "classes.id");
    //         })
    //         .where("r.relation", "aggregation")
    //         .join("members", async function () {
    //             this.on("members.class", "r.second_class");
    //         })
    //         .whereLike(
    //             "members.type",
    //             `${await checkInterfaceArrayName(knex)}[]`
    //         )
    //         .join("methods", async function () {
    //             this.on("methods.class", "members.class");
    //         })
    //         .join("parameters", async function () {
    //             this.on("parameters.class", "methods.class").andOn(
    //                 "parameters.type",
    //                 "classes.id"
    //             );
    //         })
    //         .then((res) => {
    //             expect(res.length).toBeGreaterThanOrEqual(1);
    //         });
    // });
});

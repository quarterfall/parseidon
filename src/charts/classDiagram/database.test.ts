import knex from "knex";
import { ClassDiagram } from "./ClassDiagram";
import { initDatabase, getAllRelations, getAllWithRelation, getAllClasses } from "./database";

import { classes, relations } from "./designPatterns/singleton.test";

let classDiagram: ClassDiagram = new ClassDiagram(classes, relations);
const classes1 = [
    {
      id: "Animal",
      type: "",
      members: "+int age,+String gender",
      methods: "+isMammal(),+mate()",
      annotations: ""
    },
    {
      id: "Duck",
      type: "",
      members: "+String beakColor",
      methods: "+swim(),+quack()",
      annotations: ""
    },
    { id: "Fish", type: "", members: "-int sizeInFeet", methods: "-canEat()", annotations: "" },
    { id: "Zebra", type: "", members: "+bool is_wild", methods: "+run()", annotations: "" },
    {
      id: "Singleton",
      type: "",
      members: "-Singleton singleton$",
      methods: "-Singleton(),+getInstance()$ Singleton",
      annotations: ""
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

const conn = knex({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});

describe("Database tests", () => {
    beforeAll(async () => {
        await initDatabase(conn, classDiagram);
    });

    afterAll(async () => {
        conn.destroy();
    });

    test("Get all relations", async () => {
        let i: number = 0;
        await getAllRelations(conn).then((res) => {
            res.forEach((relation) => {
                expect(JSON.stringify(relation)).toStrictEqual(
                    JSON.stringify(relations1[i])
                );
                i++;
            });
        });
    });

    test("Get all inheritance relations", async () => {
        await getAllWithRelation("inheritance", conn).then((res) => {
            res.forEach((relation) => {
                expect(relation.relation).toStrictEqual("inheritance");
            });
        });
    });

    test("Get all classes", async () => {
        let i:number = 0;
        await getAllClasses(conn).then((res)=> {
            res.forEach((relation) => {
                expect(JSON.stringify(relation)).toStrictEqual(JSON.stringify(classes1[i]));
                i++;
            });
        })
    })
});

import { ClassDiagram } from "./ClassDiagram";

const classes = {
    Animal: {
        id: "Animal",
        type: "",
        cssClasses: [],
        methods: ["+isMammal()", "+mate()"],
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
};

const debug = [
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
];

const newClasses = [
    {
        id: "Animal",
        type: "",
        methods: ["+isMammal()", "+mate()"],
        members: ["+int age", "+String gender"],
        annotations: []
    },
    {
        id: "Duck",
        type: "",
        methods: ["+swim()", "+quack()"],
        members: ["+String beakColor"],
        annotations: []
    },
    {
        id: "Fish",
        type: "",
        methods: ["-canEat()"],
        members: ["-int sizeInFeet"],
        annotations: []
    },
];

const relations = [
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
];

let classDiagram: ClassDiagram = new ClassDiagram(classes, debug);

describe("Database tests", () => {
    test("Test getClasses", () => {
        expect(classDiagram.getClasses()).toStrictEqual(newClasses);
    });

    test("Test getDebug", () => {
        expect(classDiagram.getDebug()).toStrictEqual(debug);
    });

    test("Test getRelations", () => {
        expect(classDiagram.getRelations()).toStrictEqual(relations);
    });
});

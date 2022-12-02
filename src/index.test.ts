import { parseidon } from ".";

const input = {
    classes: {
        Singleton: {
            id: "Singleton",
            type: "",
            cssClasses: [],
            methods: ["-Singleton()", "+getInstance()$ Singleton"],
            members: ["-Singleton singleton$"],
            annotations: [],
            domId: "classid-Singleton-6",
        },
        SecondSingleton: {
            id: "SecondSingleton",
            type: "",
            cssClasses: [],
            methods: ["-SecondSingleton()", "+getInstance()$ SecondSingleton"],
            members: ["-SecondSingleton singleton$"],
            annotations: [],
            domId: "classid-SecondSingleton-7",
        },
        Animal: {
            id: "Animal",
            type: "",
            cssClasses: [],
            methods: ["+isMammal()", "+mate()"],
            members: ["+int age", "+String gender"],
            annotations: [],
            domId: "classid-Animal-8",
        },
        Duck: {
            id: "Duck",
            type: "",
            cssClasses: [],
            methods: ["+swim()", "+quack()"],
            members: ["+String beakColor"],
            annotations: [],
            domId: "classid-Duck-9",
        },
        Fish: {
            id: "Fish",
            type: "",
            cssClasses: [],
            methods: ["-canEat()"],
            members: ["-int sizeInFeet"],
            annotations: [],
            domId: "classid-Fish-10",
        },
        Zebra: {
            id: "Zebra",
            type: "",
            cssClasses: [],
            methods: ["+run()"],
            members: ["+bool is_wild"],
            annotations: [],
            domId: "classid-Zebra-11",
        },
    },
    relations: [
        {
            id1: "Singleton",
            id2: "Singleton",
            relation: {
                type1: "none",
                type2: 3,
                lineType: 0,
            },
            relationTitle1: "none",
            relationTitle2: "none",
        },
        {
            id1: "SecondSingleton",
            id2: "SecondSingleton",
            relation: {
                type1: "none",
                type2: 3,
                lineType: 0,
            },
            relationTitle1: "none",
            relationTitle2: "none",
        },
        {
            id1: "Animal",
            id2: "Duck",
            relation: {
                type1: 1,
                type2: "none",
                lineType: 0,
            },
            relationTitle1: "none",
            relationTitle2: "none",
        },
        {
            id1: "Animal",
            id2: "Fish",
            relation: {
                type1: 1,
                type2: "none",
                lineType: 0,
            },
            relationTitle1: "none",
            relationTitle2: "none",
        },
        {
            id1: "Animal",
            id2: "Zebra",
            relation: {
                type1: 1,
                type2: "none",
                lineType: 0,
            },
            relationTitle1: "none",
            relationTitle2: "none",
        },
    ],
};

const result = {
    classes: [
        {
            id: "Singleton",
            members: "-Singleton singleton$",
            methods: "-Singleton(),+getInstance()$ Singleton",
            patternLabel: null,
            type: null,
        },
        {
            id: "SecondSingleton",
            members: "-SecondSingleton singleton$",
            methods: "-SecondSingleton(),+getInstance()$ SecondSingleton",
            patternLabel: null,
            type: null,
        },
        {
            id: "Animal",
            members: "+int age,+String gender",
            methods: "+isMammal(),+mate()",
            patternLabel: null,
            type: null,
        },
        {
            id: "Duck",
            members: "+String beakColor",
            methods: "+swim(),+quack()",
            patternLabel: null,
            type: null,
        },
        {
            id: "Fish",
            members: "-int sizeInFeet",
            methods: "-canEat()",
            patternLabel: null,
            type: null,
        },
        {
            id: "Zebra",
            members: "+bool is_wild",
            methods: "+run()",
            patternLabel: null,
            type: null,
        },
    ],
    designPatterns: [
        {
            className: "all",
            id: 1,
            pattern: "singleton",
        }
    ],

    relations: [
        {
            first_class: "Singleton",
            id: 1,
            relation: "association",
            second_class: "Singleton",
        },
        {
            first_class: "SecondSingleton",
            id: 2,
            relation: "association",
            second_class: "SecondSingleton",
        },
        {
            first_class: "Duck",
            id: 3,
            relation: "inheritance",
            second_class: "Animal",
        },
        {
            first_class: "Fish",
            id: 4,
            relation: "inheritance",
            second_class: "Animal",
        },
        {
            first_class: "Zebra",
            id: 5,
            relation: "inheritance",
            second_class: "Animal",
        },
    ],
};

describe("Parseidon tests", () => {
    test("Method test", async () => {
        parseidon({input}).then((res) => {
            expect(res).toEqual(result);
        });
    });
});

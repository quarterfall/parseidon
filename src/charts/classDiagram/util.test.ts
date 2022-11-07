import {
    getAccessibility,
    getClassifierMember,
    getClassifierMethod,
    getDesignPatternArray,
    getMemberName,
    getMemberReturnType,
    getMethodName,
    getMethodReturnType,
} from "./util";

const debug = [
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

describe("Index tests", () => {
    test("Test getDesignPattern", () => {
        expect(getDesignPatternArray(debug)).toStrictEqual(relations);
    });

    test("Test getAccessibility with correct string", () => {
        expect(getAccessibility("+String name")).toStrictEqual("public");
    });

    test("Test getClassifierMember", () => {
        expect(getClassifierMember("-String name$")).toStrictEqual("static");
    });

    test("Test getClassifierMethod with no classifier string", () => {
        expect(getClassifierMethod("-getName() String")).toStrictEqual("none");
    });

    test("Test getClassifierMethod with classifier string", () => {
        expect(getClassifierMethod("-getName()$ String")).toStrictEqual(
            "static"
        );
    });

    test("Test getMemberReturnType", () => {
        expect(getMemberReturnType("+int age")).toStrictEqual("int");
    });

    test("Test getMemberName", () => {
        expect(getMemberName("+int age")).toStrictEqual("age");
    });

    test("Test getMethodReturnType", () => {
        expect(getMethodReturnType("-isAnimal() bool")).toStrictEqual("bool");
    });

    test("Test getMethodName", () => {
        expect(getMethodName("-isAnimal() bool")).toStrictEqual("isAnimal");
    });

    test("Test getMemberName with classifier and accessibility", () => {
        expect(getMemberName("+String lol$")).toStrictEqual("lol");
    });

    test("Test getMethodReturnType with classifier", () => {
        expect(getMethodReturnType("+isAlive()$ bool")).toStrictEqual("bool");
    });
});

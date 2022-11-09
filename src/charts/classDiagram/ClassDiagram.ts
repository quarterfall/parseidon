import { getDesignPatternArray } from "./util";

export type Relation = {
    id: number;
    first_class: string;
    relation: string;
    second_class: string;
};

export type _Class = {
    id: string;
    type: string;
    members: string[];
    methods: string[];
    annotations: string[];
    domId?: string;
    cssClasses?: string[];
};

export type Member = {
    id: number;
    type: string;
    name: string;
    accessibility: string;
    classifier: string;
};

export type Method = {
    id: number;
    returnType: string;
    name: string;
    keyword: string;
    accessibility: string;
    classifier: string;
};

export type DesignPattern = {
    id: number;
    className: string;
    singleton: string;
};

export class ClassDiagram {
    classes: _Class[];
    relations: Relation[];
    debug: any[];

    constructor(classes: {}, debug: any[]) {
        this.classes = Object.values(classes);
        this.classes.forEach((_class) => {
            delete _class.cssClasses;
            delete _class.domId;
        });
        this.debug = debug;
        this.relations = getDesignPatternArray(this.debug);
        console.log(
            `Parsed class diagram with ${this.relations.length} relations`
        );
    }

    getClasses(): _Class[] {
        return this.classes;
    }

    getDebug(): any[] {
        return this.debug;
    }

    getRelations(): Relation[] {
        return this.relations;
    }
}

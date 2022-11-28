import { transformIntoRelations } from "./util";

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
    annotations?: string[];
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
    accessibility: string;
    classifier: string;
    parameters: string[];
};

export type DesignPattern = {
    id: number;
    className: string;
    pattern: string;
};

export class ClassDiagram {
    classes: _Class[];
    relations: Relation[];
    debug: any[];

    constructor(classes: {}, debug: any[]) {
        this.classes = Object.values(classes);
        (this.classes || []).forEach((_class) => {
            delete _class.cssClasses;
            delete _class.domId;
            _class.type = "";
            if (_class.annotations) {
                _class.type = _class.annotations[0];
            }
            delete _class.annotations;
        });
        this.debug = debug;
        this.relations = transformIntoRelations(this.debug);
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

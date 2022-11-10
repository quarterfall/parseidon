import {Knex} from "knex";
import { Member, Method, Relation, _Class } from "../ClassDiagram";
import { getAllWhere } from "../database";

export async function checkForRelation(conn: Knex, className: string, relationName: string): Promise<boolean> {
    let relations: Relation[] = await getAllWhere(conn, "relations", {
        second_class: className,
        relation: relationName
    });
    if (relations.length>0) {return true;}
    else {return false;}
}

export async function getAllInterfaces(conn:Knex): Promise<_Class[]> {
    return getAllWhere(conn,"classes",{
        annotations: "interface"
    });
}

export async function getAllAbstractClasses(conn: Knex): Promise<_Class[]> {
    return getAllWhere(conn,"classes",{
        annotations: "abstract"
    });
}

export async function getAllMethodsFromClass(conn: Knex, className: string) {
    return getAllWhere(conn,"methods", {
        class: className
    });
}

export async function getAllMembersFromClass(conn: Knex, className: string) {
    return getAllWhere(conn,"members", {
        class: className
    });
}

export async function getPrivateMembersOfClassType(conn: Knex, classType: string, className: string) {
    return getAllWhere(conn,"members", {
        accessibility: "private",
        type: classType,
        class: className
    });
}

export async function getSetters(conn: Knex, className: string) {

    let setters: Method[] = [];
    let methods: Method[] = await getAllWhere(conn, "methods", {
        class: className,
    });

    for(let method of methods) {
        if (method.name.substring(0,3)==="set") {
            setters.push(method);
        }
    }

    return setters;

    
}

export async function checkForAbstractMethodReturningInterface(conn: Knex, className: string): Promise<boolean> {
    let methods: Method[] = await getAllWhere(conn, "methods", {
        classifier: "abstract",
        returnType: className
    });

    if (methods.length>0) {return true;}
    else {return false;}
}

export async function getPrivateConstructor(conn: Knex<any, any[]>, className: string) {
    return getAllWhere(conn, "methods", {
        accessibility: "private",
        name: className
    });
}

export async function getMethodReturningClassInstance(conn: Knex<any, any[]>, className: string) {
    return getAllWhere(conn, "methods", {
        accessibility: "public",
        returnType: className,
        classifier: "static"
    });
}

export async function getPrivateStaticClassInstance(conn: Knex<any, any[]>, className: string) {
    return getAllWhere(conn, "members", {
        type: className,
        accessibility: "private",
        classifier: "static"
    });
}

export async function checkIfOtherClassesHaveClassInstance(conn: Knex<any, any[]>, className: string) {
    let temp: Member[] = await getAllWhere(conn, "members", {
        type: className,
        class: !className
    });

    if (temp.length>0) {return false;} else {
        return true;
    }
}

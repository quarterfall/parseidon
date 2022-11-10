import {Knex} from "knex";
import { Relation, _Class } from "../ClassDiagram";
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
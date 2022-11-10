import { Knex } from "knex";
import { Method, _Class } from "../ClassDiagram";
import { getAllWhere } from "../database";
import { checkForRelation, getAllAbstractClasses, getAllInterfaces, getAllMethodsFromClass } from "./util";

export async function insertFactory(knex: Knex) {
    if (await checkFactory(knex) == true) {
        await knex("patterns").insert({
            className: "all",
            pattern: "factory"
        })
    }
}

export async function checkFactory(
    conn: Knex,
): Promise<boolean> {

    let interfaces: _Class[] = await getAllInterfaces(conn);

    let abstractClasses: _Class[] = await getAllAbstractClasses(conn);

    if (interfaces.length<1) { return false;}

    for (let _interface of interfaces) {
        if (await checkForRelation(conn, _interface.id, "realization") == true) {
            for (let abstractClass of abstractClasses) {
                let methods: Method[] = await getAllMethodsFromClass(conn, abstractClass.id);
                if (methods.length>1) {
                    if (await checkForAbstractMethodReturningInterface(_interface)) {
                        return checkForRelation(conn, abstractClass.id, "inheritance");
                    } 
                } else {
                    continue;
                }
            }
        } 
    }

    return false;

   async function checkForAbstractMethodReturningInterface(_class: _Class): Promise<boolean> {
        let methods: Method[] = await getAllWhere(conn, "methods", {
            classifier: "abstract",
            returnType: _class.id
        });

        if (methods.length>0) {return true;}
        else {return false;}

    }

   
}

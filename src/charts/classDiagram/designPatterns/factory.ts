import { Knex } from "knex";
import { _Class } from "../ClassDiagram";
import { checkForAbstractMethodReturningInterface, checkForRelation, getAllAbstractClasses, getAllInterfaces, getAllMethodsFromClass } from "./util";

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

    for (let _interface of interfaces) {
        if (await checkForRelation(conn, _interface.id, "realization")) {
            for (let abstractClass of abstractClasses) {
                if ((await getAllMethodsFromClass(conn, abstractClass.id)).length>1) {
                    if (await checkForAbstractMethodReturningInterface(conn,_interface.id)) {
                        return checkForRelation(conn, abstractClass.id, "inheritance");
                    } 
                } 
            }
        } 
    }
    return false;
}

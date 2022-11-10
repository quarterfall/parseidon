import { Knex } from "knex";
import {
    _Class,
} from "../ClassDiagram";
import { getAll } from "../database";
import { checkForRelation, getAllInterfaces, getPrivateMembersOfClassType, getSetters } from "./util";


export async function insertStrategy(knex: Knex) {
    if (await checkStrategy(knex) == true) {
        await knex("patterns").insert({
            className: "all",
            pattern: "strategy"
        })
    }
}

export async function checkStrategy(
    conn: Knex,
): Promise<boolean> {

    let interfaces: _Class[] = await getAllInterfaces(conn);
    let allClasses: _Class[] = await getAll(conn,"classes");

    for (let _interface of interfaces) {
        if (_interface.methods.length > 0) {
            for (let _class of allClasses) {
                if ((await getPrivateMembersOfClassType(conn, _interface.id, _class.id)).length>0 && _class.methods.length>1) {
                    if ((await getSetters(conn, _class.id)).length>0) {
                        return checkForRelation(conn, _interface.id, "realization");
                    }
                }
            }
        }
    }
    return false;
}

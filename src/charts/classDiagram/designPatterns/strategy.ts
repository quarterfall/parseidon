import { Knex } from "knex";
import {
    ClassDiagram,
    Member,
    Method,
    Relation,
    _Class,
} from "../ClassDiagram";
import { getAll, getAllWhere } from "../database";


export async function insertStrategy(knex: Knex, classDiagram: ClassDiagram) {
    if (await checkStrategy(knex,classDiagram) == true) {
        await knex("patterns").insert({
            className: "all",
            pattern: "strategy"
        })
    }
}

export async function checkStrategy(
    conn: Knex,
    classDiagram: ClassDiagram
): Promise<boolean> {
    let classes: _Class[] = classDiagram.getClasses();

    // check for strategy interface
    for (let _class of classes) {
        //if found
        if (_class.annotations.includes("interface")) {
            //check if has methods
            if (_class.methods.length > 0) {
                //loop to find context class
                for (let _contextClass of classes) {
                    //get members
                    let contextClassMembers: Member[] = await getAllWhere(
                        conn,
                        "members",
                        { class: _contextClass.id }
                    );
                    //loop through members
                    for (let i = 0; i < contextClassMembers.length; i++) {

                        //if find private member of interface type
                        if (
                            contextClassMembers[i].accessibility ===
                                "private" &&
                            contextClassMembers[i].type === _class.id
                        ) {
                            //get methods
                            let contextClassMethods: Method[] =
                                await getAllWhere(conn, "methods", {
                                    class: _contextClass.id,
                                });
                            //if more than 1 method
                            if (contextClassMethods.length > 1) {
                                //loop through methods
                                for (
                                    let i = 0;
                                    i < contextClassMethods.length;
                                    i++
                                ) {
                                    //check for setter
                                    if (
                                        contextClassMethods[i].name ===
                                        "set" + _class.id
                                    ) {
                                        //get relations
                                        let relations: Relation[] =
                                            await getAll(conn, "relations");
                                        //loop through relations
                                        for (
                                            let i = 0;
                                            i < relations.length;
                                            i++
                                        ) {
                                            //if one class implements strategy interface
                                            if (
                                                relations[i].second_class === _class.id && 
                                                relations[i].relation === "realization"
                                            ) {
                                                
                                                return true;
                                            } else {
                                                if (i == relations.length - 1) {
                                                    break;
                                                }
                                            }
                                        }
                                    } else if (
                                        i ==
                                        contextClassMethods.length - 1
                                    ) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

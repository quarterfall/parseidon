import { Knex } from "knex";
import { ClassDiagram, Method, Relation, _Class } from "../ClassDiagram";
import { getAllWhere } from "../database";

export async function insertFactory(knex: Knex, classDiagram: ClassDiagram) {
    if (await checkFactory(knex,classDiagram) == true) {
        await knex("patterns").insert({
            className: "all",
            pattern: "factory"
        })
    }
}



export async function checkFactory(
    conn: Knex,
    classDiagram: ClassDiagram
): Promise<boolean> {
    let classes: _Class[] = classDiagram.getClasses();

    let relations: Relation[] = classDiagram.getRelations();

    //look for an interface
    for (let _class of classes) {
        //found possible product interface
        if (_class.annotations.includes("interface")) {
            //check for at least one class implementing  interface
            checkForRealizationRelation(_class);

            //look for abstract class
            for (let abstractClass of classes) {
                //if found
                if (abstractClass.annotations.includes("abstract")) {
                    //get methods
                    let methods: Method[] = await getAllWhere(conn, "methods", {
                        class: abstractClass.id,
                    });

                    if (methods.length > 1) {
                        //check if there is an abstract method returning product interface
                        checkForAbstractMethodReturningInterface(methods, _class);
                        //check if there is at least one class inheriting from abstract class
                        return checkForClassInheritingFromCreator(relations, abstractClass, methods);
                    }
                }
            }
        }
    }
    return false;

    function checkForClassInheritingFromCreator(relations: Relation[], abstractClass: _Class, methods: Method[]): boolean {
        for (let i = 0; i < relations.length; i++) {
            if (
                relations[i].second_class ===
                    abstractClass.id &&
                relations[i].relation === "inheritance"
            ) {
                return true;
            } else {
                if (i == methods.length - 1) {
                    continue;
                }
            }
        }
        return false;
    } 

    function checkForAbstractMethodReturningInterface(methods: Method[], _class: _Class) {
        for (let i = 0; i < methods.length; i++) {
            if (methods[i].classifier === "abstract" &&
                methods[i].returnType === _class.id) {
                break;
            } else {
                if (i == methods.length - 1) {
                    continue;
                }
            }
        }
    }

    function checkForRealizationRelation(_class: _Class) {
        for (let i = 0; i < relations.length; i++) {
            if (relations[i].second_class === _class.id &&
                relations[i].relation === "realization") {
                break;
            } else {
                if (i == relations.length - 1) {
                    continue;
                }
            }
        }
    }
}

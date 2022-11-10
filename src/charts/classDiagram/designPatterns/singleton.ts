import { Knex } from "knex";
import { ClassDiagram, Member, Method, _Class } from "../ClassDiagram";
import { getPrivateStaticClassInstance, getPrivateConstructor, getMethodReturningClassInstance, checkIfOtherClassesHaveClassInstance } from "./util";

export async function insertSingletons(knex: Knex, classDiagram: ClassDiagram) {
    let classes: _Class[] = classDiagram.getClasses();
    for (let i = 0; i < classes.length; i++) {
        if (await checkSingletonByName(classes[i].id, knex)) {
            await knex("patterns").insert({
                className: classes[i].id,
                pattern: "singleton",
            });
        }
    }
}

export async function checkSingletonByName(className: string,conn: Knex): Promise<boolean> {

    //step 1 check for private static instance of class

    let members : Member[] = await getPrivateStaticClassInstance(conn, className);

    if (members.length<1) { return false; }

    //step 2 check for private constructor

    let methods : Method[] = await getPrivateConstructor(conn, className);

    if (methods.length<1) {return false;}

    //step 3 public method returning instance

    let methods1 = await getMethodReturningClassInstance(conn, className);

    if (methods1.length<1) { return false; }

    //step 4 check other class members for singleton class instance

    return checkIfOtherClassesHaveClassInstance(conn, className);
}


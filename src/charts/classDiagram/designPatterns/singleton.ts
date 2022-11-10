import { Knex } from "knex";
import { ClassDiagram, Member, Method, _Class } from "../ClassDiagram";
import { getAllWhere } from "../database";

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
async function checkIfOtherClassesHaveClassInstance(conn: Knex<any, any[]>, className: string) {
    let temp: Member[] = await getAllWhere(conn, "members", {
        type: className,
        class: !className
    });

    if (temp.length>0) {return false;} else {
        return true;
    }
}

async function getPrivateConstructor(conn: Knex<any, any[]>, className: string): Promise<Method[]> {
    return getAllWhere(conn, "methods", {
        accessibility: "private",
        name: className
    });
}

async function getMethodReturningClassInstance(conn: Knex<any, any[]>, className: string): Promise<Method[]> {
    return getAllWhere(conn, "methods", {
        accessibility: "public",
        returnType: className,
        classifier: "static"
    });
}

async function getPrivateStaticClassInstance(conn: Knex<any, any[]>, className: string): Promise<Member[]> {
    return getAllWhere(conn, "members", {
        type: className,
        accessibility: "private",
        classifier: "static"
    });
}


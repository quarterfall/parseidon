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

export async function checkSingletonByName(
    className: string,
    conn: Knex
): Promise<boolean> {
    let classMembers: Member[] = await getAllWhere(conn, "members", {
        class: className,
    });
    let classMethods: Method[] = await getAllWhere(conn, "methods", {
        class: className,
    });
    let allOtherMembers: Member[] = [];

    await conn
        .from("members")
        .select("*")
        .whereNot({ class: className })
        .then((rows) => {
            rows.forEach((row) => {
                allOtherMembers.push(row);
            });
        });

    if (!classMembers.length) {
        return false;
    }

    //step 1 check for private static instance of class

    for (let i = 0; i < classMembers.length; i++) {
        if (
            classMembers[i].type === className &&
            classMembers[i].accessibility === "private" &&
            classMembers[i].classifier === "static"
        ) {
            break;
        } else {
            if (i == classMembers.length - 1) {
                return false;
            }
        }
    }

    //step 2 check for private constructor

    for (let i = 0; i < classMethods.length; i++) {
        if (
            classMethods[i].accessibility === "private" &&
            classMethods[i].name === className
        ) {
            break;
        } else {
            if (i == classMethods.length - 1) {
                return false;
            }
        }
    }

    //step 3 public method returning instance

    for (let i = 0; i < classMethods.length; i++) {
        if (
            classMethods[i].accessibility === "public" &&
            classMethods[i].returnType === className &&
            classMethods[i].classifier === "static"
        ) {
            break;
        } else {
            if (i == classMethods.length - 1) {
                return false;
            }
        }
    }

    //step 4 check other class members for singleton class instance

    for (let member of allOtherMembers) {
        if (member.type === className) {
            return false;
        }
    }

    return true;
}

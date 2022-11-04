import { Knex } from "knex";
import { ClassDiagram, Relation, _Class } from "./ClassDiagram";
import {
    getAccessibility,
    getClassifierMember,
    getClassifierMethod,
    getMemberName,
    getMemberReturnType,
    getMethodName,
    getMethodReturnType,
} from "./util";

import { createDesignPatternTable } from "./designPatterns";
import { insertSingletons } from "./designPatterns/singleton";

export async function initDatabase(conn: Knex, classDiagram: ClassDiagram) {
    await createMethodsTable(conn);
    await createMembersTable(conn);
    await createClassesTable(conn);
    await createRelationsTable(conn);
    await createDesignPatternTable(conn);

    await insertMembersAndMethods(conn, classDiagram);

    //insert classes
    await insertArray(conn, "classes", classDiagram.getClasses());

    //insert relations
    await insertArray(conn, "relations", classDiagram.getRelations());

    await insertSingletons(conn, classDiagram);
}

export async function getAllRelations(conn: Knex): Promise<Relation[]> {
    return getAll(conn, "relations");
}

export async function getAllClasses(conn: Knex): Promise<_Class[]> {
    return getAll(conn, "classes");
}

export async function getAllWithRelation(
    relationName: string,
    conn: Knex
): Promise<Relation[]> {
    return getAllWhere(conn, "relations", { relation: relationName });
}

export async function getAll(conn: Knex, tableName: string): Promise<any[]> {
    return conn
        .from(tableName)
        .select("*")
        .then((rows) => {
            return rows;
        })
        .catch((e) => {
            console.log(e);
            throw e;
        });
}

export async function getAllWhere(
    conn: Knex,
    tableName: string,
    condition: any
): Promise<any[]> {
    return conn
        .from(tableName)
        .select("*")
        .where(condition)
        .then((rows) => {
            return rows;
        })
        .catch((e) => {
            console.log(e);
            throw e;
        });
}

export async function createMethodsTable(knex: Knex) {
    await knex.schema.createTable("methods", (table) => {
        table.increments("id").primary();
        table.string("returnType");
        table.string("name");
        table.string("accessibility");
        table.string("classifier");
        table.string("class");
    });

    return knex("methods");
}

export async function createMembersTable(knex: Knex) {
    await knex.schema.createTable("members", (table) => {
        table.increments("id").primary();
        table.string("type");
        table.string("name");
        table.string("accessibility");
        table.string("classifier");
        table.string("class");
    });

    return knex("members");
}

export async function createClassesTable(knex: Knex) {
    await knex.schema.createTable("classes", (table) => {
        table.string("id").primary();
        table.string("type");
        table.string("members");
        table.string("methods");
    });

    return knex("classes");
}

export async function createRelationsTable(knex: Knex) {
    await knex.schema.createTable("relations", (table) => {
        table.increments("id").primary();
        table.string("first_class");
        table.string("relation");
        table.string("second_class");
    });

    return knex("relations");
}

export async function insertArray(conn: Knex, tableName: string, array: any[]) {
    return conn(tableName)
        .insert(array)
        .then(() => console.log(`${tableName} inserted`))
        .catch((e) => {
            console.log(e);
            throw e;
        });
}

export async function insertMembersAndMethods(
    conn: Knex,
    classDiagram: ClassDiagram
) {
    //insert methods and members
    classDiagram.getClasses().forEach((_class) => {
        _class.members.forEach(async (member) => {
            await conn("members").insert({
                type: getMemberReturnType(member),
                name: getMemberName(member),
                accessibility: getAccessibility(member),
                classifier: getClassifierMember(member),
                class: _class.id,
            });
        });

        _class.methods.forEach(async (method) => {
            await conn("methods").insert({
                returnType:
                    getMethodReturnType(method) !== ""
                        ? getMethodReturnType(method)
                        : "void",
                name: getMethodName(method),
                accessibility: getAccessibility(method),
                classifier: getClassifierMethod(method),
                class: _class.id,
            });
        });
    });
}

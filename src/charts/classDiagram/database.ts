import knexConn,{ Knex } from "knex";
import { ClassDiagram, Relation, _Class } from "./ClassDiagram";
import {
    getAccessibility,
    getClassifierMember,
    getClassifierMethod,
    getMemberName,
    getMemberReturnType,
    getMethodName,
    getMethodParameter,
    getMethodReturnType,
} from "./util";

export const getKnexConnection = () => knexConn({
    client: "sqlite3",
    connection: {
        filename: ":memory:",
    },
    useNullAsDefault: true,
});

export async function initDatabase(knex: Knex, classDiagram: ClassDiagram) {
    await createMethodsTable(knex);
    await createMembersTable(knex);
    await createClassesTable(knex);
    await createRelationsTable(knex);
    await createParametersTable(knex);

    await insertMembersMethodsParameters(knex, classDiagram);

    //insert classes
    await insertArray(knex, "classes", classDiagram.getClasses());

    //insert relations
    await insertArray(knex, "relations", classDiagram.getRelations());
}

export async function getAllRelations(knex: Knex): Promise<Relation[]> {
    return getAll(knex, "relations");
}

export async function getAllClasses(knex: Knex): Promise<_Class[]> {
    return getAll(knex, "classes");
}

export async function getAllWithRelation(
    relationName: string,
    knex: Knex
): Promise<Relation[]> {
    return getAllWhere(knex, "relations", { relation: relationName });
}

export async function getAll(knex: Knex, tableName: string): Promise<any[]> {
    return knex
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
    knex: Knex,
    tableName: string,
    condition: any
): Promise<any[]> {
    return knex
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
        table.string("patternLabel");
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

export async function createParametersTable(knex: Knex) {
    await knex.schema.createTable("parameters", (table) => {
        table.increments("id").primary();
        table.string("type");
        table.string("name");
        table.string("class");
        table.string("methodName");
    });

    return knex("parameters");
}

export async function insertArray(knex: Knex, tableName: string, array: any[]) {
    return knex(tableName)
        .insert(array)
        .then()
        .catch((e) => {
            console.log(e);
            throw e;
        });
}

export async function insertMembersMethodsParameters(
    knex: Knex,
    classDiagram: ClassDiagram
) {
    //insert methods and members
    (classDiagram.getClasses() || []).forEach((_class) => {
        (_class?.members || []).forEach(async (member) => {
            await knex("members").insert({
                type: getMemberReturnType(member),
                name: getMemberName(member),
                accessibility: getAccessibility(member),
                classifier: getClassifierMember(member),
                class: _class.id,
            });
        });

        (_class?.methods || []).forEach(async (method) => {
            await knex("methods").insert({
                returnType:
                    getMethodReturnType(method) !== ""
                        ? getMethodReturnType(method)
                        : "void",
                name: getMethodName(method),
                accessibility: getAccessibility(method),
                classifier: getClassifierMethod(method),
                class: _class.id,
            });

            (getMethodParameter(method) || []).forEach(async (parameter) => {
                if (parameter !== "") {
                    await knex("parameters").insert({
                        type: getMemberReturnType(parameter),
                        name: getMemberName(parameter),
                        class: _class.id,
                        methodName: getMethodName(method),
                    });
                }
            });
        });
    });
}

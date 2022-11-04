import { Knex } from "knex";
import { DesignPattern } from "../ClassDiagram";
import { getAll } from "../database";

export async function createDesignPatternTable(knex: Knex) {
    await knex.schema.createTable("patterns", (table) => {
        table.increments("id").primary();
        table.string("className");
        table.string("singleton");
    });
}

export async function getAllDesignPatterns(
    conn: Knex
): Promise<DesignPattern[]> {
    return getAll(conn, "patterns");
}

import { Knex } from "knex";
import { DesignPattern, _Class } from "../ClassDiagram";
import { getAll } from "../database";
import { checkAdapter } from "./adapter";
import { checkComposite } from "./composite";
import { checkFactory } from "./factory";
import { checkSingletonByName } from "./singleton";
import { checkStrategy } from "./strategy";

export async function getAllDesignPatterns(
    conn: Knex
): Promise<DesignPattern[]> {
    let designPatterns: DesignPattern[] = [];
    let classes: _Class[] = await getAll(conn, "classes");
    let patternId: number = 1;
    for (let i=0;i<classes.length;i++) {
        if ((await checkSingletonByName(conn, classes[i].id))) {
            designPatterns.push({id:patternId++, className: classes[i].id, pattern: "singleton"})
        }
    }

    await checkFactory(conn).then(res => {
        if (res) {
            designPatterns.push({id:patternId++, className: "all", pattern: "factory"})
        }
    });

    await checkStrategy(conn).then(res => {
        if (res) {
            designPatterns.push({id:patternId++, className: "all", pattern: "strategy"})
        }
    });

    await checkAdapter(conn).then(res => {
        if (res) {
            designPatterns.push({id:patternId++, className: "all", pattern: "adapter"})
        }
    })

    await checkComposite(conn).then(res => {
        if (res) {
            designPatterns.push({id:patternId++, className: "all", pattern: "composite"})
        }
    })


    return designPatterns;

}



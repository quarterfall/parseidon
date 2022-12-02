import { Knex } from "knex";
import { DesignPattern, _Class } from "../ClassDiagram";
import { checkAdapter } from "./adapter";
import { checkComposite } from "./composite";
import { checkFactory } from "./factory";
import { checkProxy } from "./proxy";
import { checkSingletonByName } from "./singleton";
import { checkStrategy } from "./strategy";
// import { checkObserver } from "./observer";

export async function getAllDesignPatterns(
    knex: Knex
): Promise<DesignPattern[]> {
    let designPatterns: DesignPattern[] = [];
    let patternId: number = 1;

    if (await checkSingletonByName(knex)) {
        designPatterns.push({
            id: patternId++,
            className: "all",
            pattern: "singleton",
        });
    }

    if (await checkFactory(knex)) {
        designPatterns.push({
            id: patternId++,
            className: "all",
            pattern: "factory",
        });
    }

    if (await checkStrategy(knex)) {
        designPatterns.push({
            id: patternId++,
            className: "all",
            pattern: "strategy",
        });
    }

    if (await checkAdapter(knex)) {
        designPatterns.push({
            id: patternId++,
            className: "all",
            pattern: "adapter",
        });
    }

    if (await checkComposite(knex)) {
        designPatterns.push({
            id: patternId++,
            className: "all",
            pattern: "composite",
        });
    }

    if (await checkProxy(knex)) {
        designPatterns.push({
            id: patternId++,
            className: "all",
            pattern: "proxy",
        });
    }

    // if (await checkObserver(knex)) {
    //     designPatterns.push({
    //         id: patternId++,
    //         className: "all",
    //         pattern: "observer",
    //     });
    // }

    return designPatterns;
}

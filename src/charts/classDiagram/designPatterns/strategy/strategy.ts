import { Knex } from "knex";
import {
    checkIfRelationWithMemberTypeExists,
    checkIfClassHasRelation,
    compareClassIDToClassOfMethod,
} from "../queries";
import {
    compareClassIDToMemberType,
    compareMemberTypeToStrategyInterface,
} from "./strategy.queries";

export async function checkStrategy(knex: Knex): Promise<Boolean> {
    const strategyQuery = knex
        //get setter methods from a class (Context) with an aggregation relation
        .from("methods")
        .select("*")
        .whereLike("methods.name", "set%")
        .join("classes", compareClassIDToClassOfMethod())
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation", "aggregation")
        //check if the class has a private interface (Strategy) member
        .join("members", compareMemberTypeToStrategyInterface())
        .where("members.accessibility", "private")
        .join("classes as c", compareClassIDToMemberType())
        .where("c.type", "interface")
        //check if the interface is implemented by a class (Concrete Strategy)
        .join("relations as r", checkIfRelationWithMemberTypeExists())
        .where("r.relation", "realization");

    if ((await strategyQuery).length) {
        await strategyQuery.then(async (res) => {
            if (res.length) {
                await knex
                    .from("classes")
                    .where("id", res[0].class)
                    .update("patternLabel", "Context");
                await knex
                    .from("classes")
                    .where("id", res[0].first_class)
                    .update("patternLabel", "ConcreteStrategy");
                await knex
                    .from("classes")
                    .where("id", res[0].second_class)
                    .update("patternLabel", "Strategy");
            }
        });
        return true;
    } else {
        return false;
    }
}

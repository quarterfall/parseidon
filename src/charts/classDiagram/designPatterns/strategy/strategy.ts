import { Knex } from "knex";
import { _Class } from "../../ClassDiagram";
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
    //get setter methods from a class (Context) with an aggregation relation
    return Boolean(
        (  
            await knex
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
                .where("c.annotations", "interface")
                //check if the interface is implemented by a class (Concrete Strategy)
                .join("relations as r", checkIfRelationWithMemberTypeExists())
                .where("r.relation", "realization")
        ).length
    );
}

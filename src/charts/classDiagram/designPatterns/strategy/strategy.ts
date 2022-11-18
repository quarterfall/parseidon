import { Knex } from "knex";
import { _Class } from "../../ClassDiagram";
import {checkIfRelationWithMemberTypeExists , checkIfClassHasRelation, compareClassIDToClassOfMethod} from "../queries";
import { compareMemberTypeToStrategyInterface } from "./strategy.queries";

export async function checkStrategy(knex: Knex): Promise<Boolean> {
   
    return knex
        .from("methods")
        .select("*")
        .whereLike("methods.name", "set%")
        .join("classes", compareClassIDToClassOfMethod())
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation","aggregation")
        .join("members", compareMemberTypeToStrategyInterface())
        .where("members.accessibility","private")
        .join('relations as r', checkIfRelationWithMemberTypeExists())
        .where("r.relation","realization")
        .then(res => {return Boolean(res.length)})

}

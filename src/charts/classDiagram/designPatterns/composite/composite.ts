import { Knex } from "knex";
import { checkIfClassOfMemberHasARelation } from "../queries";
import { checkClassAndParameterOfMethod, compareClassesIDToFirstClass } from "./composite.queries";

export async function checkComposite(knex: Knex): Promise<Boolean> {

    return knex
        .from("relations")
        .select("*")
        .where("relations.relation","realization")
        .join("classes", compareClassesIDToFirstClass())
        .join("members", checkIfClassOfMemberHasARelation())
        .whereLike("members.type", "%[]")
        .join("methods", checkClassAndParameterOfMethod())
        .then(res => {
            if (res.length == 2) {
                return true;
            }
            return false;
        })
        

}
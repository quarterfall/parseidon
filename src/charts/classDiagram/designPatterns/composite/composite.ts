import { Knex } from "knex";
import { checkIfClassOfMemberHasARelation } from "../queries";
import {
    checkClassAndParameterOfMethod,
    compareClassesIDToSecondClass,
    compareParameterToRelationClasses,
} from "./composite.queries";

export async function checkComposite(knex: Knex): Promise<Boolean> {
    //get an implementation relation
    return Boolean(
        (
            await knex
                .from("relations")
                .select("*")
                .where("relations.relation", "realization")
                //get the implemented interface (component)
                .join("classes", compareClassesIDToSecondClass())
                .where("classes.type", "interface")
                //check if a member of the class (composite) implementing the interface is an array of interface type
                .join("members", checkIfClassOfMemberHasARelation())
                .whereLike(
                    "members.type",
                    `${await checkInterfaceArrayName(knex)}[]`
                )
                .join("relations as r", async function(){
                    this.on("r.first_class","members.class")
                })
                .where("r.relation","realization")
                //check for two methods containing as a parameter an interface instance
                .join("methods", checkClassAndParameterOfMethod())
                .join("parameters", compareParameterToRelationClasses())
        ).length > 1
    );
}

export async function checkInterfaceArrayName(knex: Knex): Promise<string> {
    const result = await knex
        .from("relations")
        .select("*")
        .where("relations.relation", "realization")
        .join("classes", compareClassesIDToSecondClass())
        .where("classes.type", "interface")
        .join("members", checkIfClassOfMemberHasARelation());
    if (result.length) {
        return result[0].second_class;
    } else {
        return "null";
    }
}

import { Knex } from "knex";
import { compareFirstClassToMemberClass } from "../queries";
import { checkParameterOfConstructor, compareClassOfMemberToClassID, compareRelationFirstClassToClass } from "./proxy.queries";
//import { checkIfClassHasRelation } from "../queries";

export async function checkProxy(knex: Knex): Promise<Boolean> {
    return Boolean(
        (
            //get classes implementing interface
            await knex
                .from("relations")
                .select("*")
                .where("relations.relation", "realization")
                .join("classes", compareRelationFirstClassToClass())
                //find proxy class by checking if class of member is of service class
                .join("members", compareClassOfMemberToClassID())
                // check if parameter of constructor is of service class
                .join("parameters", checkParameterOfConstructor())
                // check for association between proxy class and service class
                .join("relations as r", compareFirstClassToMemberClass())
        ).length
    );
}

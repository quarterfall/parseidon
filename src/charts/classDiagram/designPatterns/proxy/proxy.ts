import { Knex } from "knex";
import { compareFirstClassToMemberClass } from "../queries";
import {
    checkParameterOfConstructor,
    compareClassOfMemberToClassID,
    compareRelationFirstClassToClass,
} from "./proxy.queries";
//import { checkIfClassHasRelation } from "../queries";

export async function checkProxy(knex: Knex): Promise<Boolean> {
    const proxyQuery = knex
        //get classes implementing the interface
        .from("relations")
        .select("*")
        .where("relations.relation", "realization")
        .join("classes", compareRelationFirstClassToClass())
        //find proxy class by checking if class of member is of service class
        .join("members", compareClassOfMemberToClassID())
        // check if parameter of constructor is of service class
        .join("parameters", checkParameterOfConstructor())
        // check for association between proxy class and service class
        .join("relations as r", compareFirstClassToMemberClass());

        if ((await proxyQuery).length) {
            await proxyQuery.then(async (res) => {
                if (res.length) {
                     await knex
                         .from("classes")
                         .where("id", res[0].first_class)
                         .update("patternLabel", "Proxy");
                }
            });
            return true;
        } else {
            return false;
        }
}

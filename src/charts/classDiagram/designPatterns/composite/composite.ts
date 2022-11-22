import { Knex } from "knex";
import { checkIfClassOfMemberHasARelation } from "../queries";
import { checkClassAndParameterOfMethod, compareClassesIDToSecondClass } from "./composite.queries";

export async function checkComposite(knex: Knex): Promise<Boolean> {

    //get an implementation relation
    return knex
        .from("relations")
        .select("*")
        .where("relations.relation","realization")
        //get the implemented interface (component)
        .join("classes", compareClassesIDToSecondClass())
        .where("classes.annotations","interface")
        //check if a member of the class (composite) implementing the interface is an array of interface type
        .join("members", checkIfClassOfMemberHasARelation())
        .whereLike("members.type", "%[]")
        //check for two methods containing as a parameter an interface instance
        .join("methods", checkClassAndParameterOfMethod())
        .then(res => {
            return res.length == 2;
        })
        

}
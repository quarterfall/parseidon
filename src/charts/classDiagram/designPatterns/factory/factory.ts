import { Knex } from "knex";
import { _Class } from "../../ClassDiagram";
import { compareClassIDToClassOfMethod} from "../queries";
import { compareMethodReturnTypeToClass, compareMethodClassToRelationClass, compareClassIDToRelationSecondClass } from "./factory.queries";

export async function checkFactory(knex: Knex) {
    return knex
        .from("classes")
        .select("*")
        .join("methods", compareClassIDToClassOfMethod())
        .where("classes.annotations","abstract")
        .andWhere("methods.classifier","abstract")
        .join("relations", compareMethodReturnTypeToClass())
        .where("relations.relation","realization")
        .join("classes as c",compareClassIDToRelationSecondClass())
        .where("c.annotations","interface")
        .join("relations as r", compareMethodClassToRelationClass())
        .where("r.relation","inheritance")
        .then(res => {
            return Boolean(res.length);
        })
        
}

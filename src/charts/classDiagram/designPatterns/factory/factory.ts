import { Knex } from "knex";
import { _Class } from "../../ClassDiagram";
import { compareClassIDToClassOfMethod } from "../queries";
import {
    compareMethodReturnTypeToClass,
    compareMethodClassToRelationClass,
    compareClassIDToRelationSecondClass,
} from "./factory.queries";

export async function checkFactory(knex: Knex) {
    const factoryQuery = knex
        //get an abstract class (creator) that has an abstract method
        .from("classes")
        .select("*")
        .join("methods", compareClassIDToClassOfMethod())
        .where("classes.type", "abstract")
        .andWhere("methods.classifier", "abstract")
        //check if the return type of that method is an implemented interface (product)
        .join("relations", compareMethodReturnTypeToClass())
        .where("relations.relation", "realization")
        .join("classes as c", compareClassIDToRelationSecondClass())
        .where("c.type", "interface");

    if ((await factoryQuery).length) {
        await factoryQuery.then(async (res) => {
            if (res.length) {
                await knex
                    .from("classes")
                    .where("id", res[0].first_class)
                    .update("patternLabel", "Concrete Product");
                await knex
                    .from("classes")
                    .where("id", res[0].second_class)
                    .update("patternLabel", "Product");
                await knex
                    .from("classes")
                    .where("id", res[0].class)
                    .update("patternLabel", "Creator");
                await factoryQuery
                    //check if there is a class inheriting from the abstract class (creator)
                    .join("relations as r", compareMethodClassToRelationClass())
                    .where("r.relation", "inheritance")
                    .then(async (res) => {
                        if (res.length) {
                            await knex
                                .from("classes")
                                .where("id", res[0].first_class)
                                .update("patternLabel", "Concrete Creator");
                        }
                    });
            }
        });
        return true;
    } else {
        return false;
    }
}

import { Knex } from "knex";

export function checkClassAndParameterOfMethod(): Knex.JoinCallback {
    return async function() {
        this.on("methods.class","relations.first_class")
    }
}

export function compareClassesIDToSecondClass(): Knex.JoinCallback {
    return async function() {
        this.on("classes.id", "relations.second_class")
    }
}

export function compareParameterToRelationClasses(): Knex.JoinCallback {
    return async function() {
        this.on("parameters.type","relations.second_class")
        .andOn("parameters.class","relations.first_class")
    }
}
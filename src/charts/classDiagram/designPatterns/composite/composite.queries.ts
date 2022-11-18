import { Knex } from "knex";

export function compareRelationFirstClassToClass(): Knex.JoinCallback {
    return async function() {
        this.on("classes.id", "=","relations.first_class")
    }
}

export function checkClassAndParameterOfMethod(): Knex.JoinCallback {
    return async function() {
        this.on("methods.class","relations.first_class")
        .on("methods.parameter","relations.second_class")
    }
}

export function compareClassesIDToFirstClass(): Knex.JoinCallback {
    return async function() {
        this.on("classes.id", "=","relations.first_class")
    }
}
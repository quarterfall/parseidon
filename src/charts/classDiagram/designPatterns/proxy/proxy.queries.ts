import { Knex } from "knex";

export function compareRelationFirstClassToClass(): Knex.JoinCallback {
    return async function() {
        this.on("classes.id", "=","relations.first_class")
    }
}

export function compareClassOfMemberToClassID(): Knex.JoinCallback {
    return async function () {
        this.on("members.class", "classes.id");
    }
}

export function checkParameterOfConstructor(): Knex.JoinCallback {
    return async function () {
        this.on("parameters.methodName", "members.class");
        this.andOn("parameters.type", "members.type");
    }
}
import { Knex } from "knex"

export function compareMethodReturnTypeToClass(): Knex.JoinCallback {
    return async function(){
        this.on("methods.returnType","=","relations.second_class")
    }
}

export function compareMethodClassToRelationClass(): Knex.JoinCallback {
    return async function(){
        this.on("methods.class", "r.second_class")
    }
}

export function compareClassIDToRelationSecondClass(): Knex.JoinCallback {
    return async function() {
        this.on("c.id","=","relations.second_class")
    }
}
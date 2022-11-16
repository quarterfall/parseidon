import { Knex } from "knex";

export function checkIfClassOfMemberHasARelation(): Knex.JoinCallback {
    return async function() {
        this.on("relations.first_class","=","members.class")
    }
}

export function checkIfAdapterClassHasRelation(): Knex.JoinCallback {
    return async function() {
        this.on("r.second_class","=","classes.id")
    }
}

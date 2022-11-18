import { Knex } from "knex";


export function checkIfAdapterClassHasRelation(): Knex.JoinCallback {
    return async function() {
        this.on("r.second_class","=","members.type")
    }
}


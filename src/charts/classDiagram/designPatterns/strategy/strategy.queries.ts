import { Knex } from "knex";

export function compareMemberTypeToStrategyInterface(): Knex.JoinCallback {
    return async function () {
        this.on("methods.class", "=", "members.class")
            .andOn("members.type", "relations.first_class");
    };
}



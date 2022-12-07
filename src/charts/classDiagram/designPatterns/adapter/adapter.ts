import { Knex } from "knex";
import {
    checkIfClassHasRelation,
    checkIfClassOfMemberHasARelation,
} from "../queries";
import { checkIfAdapterClassHasRelation } from "./adapter.queries";

export async function checkAdapter(knex: Knex): Promise<Boolean> {
    //get implemented interface (client)
    const adapterQuery = knex
    .from("classes")
    .select("*")
    .where("classes.type", "interface")
    .join("relations", checkIfClassHasRelation())
    .where("relations.relation", "realization")
    //check if class (service) of the member of the class (adapter) implementing the interface (client) has an association relation
    .join("members", checkIfClassOfMemberHasARelation())
    .join("relations as r", checkIfAdapterClassHasRelation())
    .where("r.relation", "association");

    if ((await adapterQuery).length) {
        await adapterQuery.then(async (res) => {
            if (res.length) {
                await knex
                    .from("classes")
                    .where("id", res[0].first_class)
                    .update("patternLabel", "Adapter");
            }
        });
        return true;
    } else {
        return false;
    }
}

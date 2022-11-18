import { Knex } from "knex";
import { checkIfClassHasRelation, checkIfClassOfMemberHasARelation} from "../queries";
import { checkIfAdapterClassHasRelation } from "./adapter.queries";

export async function checkAdapter(knex: Knex): Promise<Boolean> {

    return knex
        .from("classes")
        .select("*")
        .where("annotations","interface")
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation","realization")
        .join("members", checkIfClassOfMemberHasARelation())
        .join("relations as r", checkIfAdapterClassHasRelation())
        .where("r.relation","association")
        .then(res => {
            return Boolean(res.length);
        })


}
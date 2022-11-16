import { Knex } from "knex";
import { checkIfClassHasRelation} from "../queries";
import { checkIfAdapterClassHasRelation, checkIfClassOfMemberHasARelation } from "./adapter.queries";

export async function checkAdapter(knex: Knex): Promise<Boolean> {

    return knex
        .from("classes")
        .select("*")
        .where("annotations","interface")
        .join("relations", checkIfClassHasRelation())
        .where("relations.relation","realization")
        .join("members", checkIfClassOfMemberHasARelation())
        .join("relations as r", checkIfAdapterClassHasRelation())
        .then(res => {
            return Boolean(res.length);
        })


}
import {Knex} from "knex";


export const getPrivateConstructor = async (knex: Knex, className: string) => {
    return knex.from("methods").select("*").where({
        accessibility: "private",
        name: className,
    });
};

//refactor anonymous functions

export function compareClassIDToClassOfMethod(): Knex.JoinCallback {
    return async function () {
         this.on("classes.id","=","methods.class")
    };
} 

export function checkIfClassHasRelation(): Knex.JoinCallback {
    return async function() {
        this.on("relations.second_class","=","classes.id")
    }
}

export function checkIfRelationWithMemberTypeExists(): Knex.JoinCallback {
    return async function() {
        this.on("r.second_class","=","members.type")
    }
}

export function checkIfClassOfMemberHasARelation(): Knex.JoinCallback {
    return async function() {
        this.on("relations.first_class","=","members.class")
    }
}


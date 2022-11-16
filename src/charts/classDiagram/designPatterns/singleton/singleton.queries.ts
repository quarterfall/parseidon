import { Knex } from "knex";

export const getPublicMethodReturningSingleton = async (knex: Knex, className: string) => {
    return knex.from("methods").select("*").where({
        accessibility: "public",
        returnType: className,
        classifier: "static",
    });
};

export const getSingletonInstancesFromOtherClasses = async (knex: Knex, className: string) => {
    return knex.from("members").select("*").where({
        type: className,
        class: !className,
    });
};

export const getPrivateStaticSingletonInstance = async (knex: Knex, className: string) => {
    return knex.from("members").select("*").where({
        accessibility: "private",
        type: className,
        classifier: "static",
    });
};

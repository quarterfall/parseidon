import { Knex } from "knex";

// type checkObserverType = {
//     id: number,
//     type:string,
//     members:string,
//     methods: string,
//     first_class: string,
//     relation: string,
//     second_class: string
// }

export async function checkObserver(knex: Knex): Promise<Boolean> {
    const observerQuery = knex
        .from("classes")
        .select("*")
        .where("classes.type", "interface")
        .join("relations", async function () {
            this.on("relations.second_class", "classes.id");
        })
        .where("relations.relation", "realization")
        //find Publisher (class) by seeing aggregation from interface class (Subscriber)
        .join("relations as r", async function () {
            this.on("r.first_class", "classes.id");
        })
        .where("r.relation", "aggregation")
        .join("members", async function () {
            this.on("members.class", "r.second_class");
        })
        .whereLike("members.type", `${await checkInterfaceArrayName(knex)}[]`)
        //check for two methods with parameter of type Subscriber interface
        .join("methods", async function () {
            this.on("methods.class", "members.class");
        })
        .join("parameters", async function () {
            this.on("parameters.class", "methods.class").andOn(
                "parameters.type",
                "classes.id"
            );
        });

    if ((await observerQuery).length) {
        return observerQuery.then(async (result) => {
            if (!result.length) {
                return false;
            }
            return knex
                .from("relations")
                .select("*")
                .where("first_class", result[0].second_class)
                .andWhere("second_class", result[0].first_class)
                .andWhere("relation", "realization")
                .then(async (res) => {
                    if (res.length) {
                        return false;
                    }
                    await knex
                        .from("classes")
                        .where("id", result[0].first_class)
                        .update("patternLabel", "subscriber");
                    await knex
                        .from("classes")
                        .where("id", result[0].second_class)
                        .update("patternLabel", "publisher");
                    return true;
                });
        });
    } else {
        return false;
    }
}

export async function checkInterfaceArrayName(knex: Knex): Promise<string> {
    const result = await knex
        .from("classes")
        .select("*")
        .where("classes.type", "interface")
        .join("relations", async function () {
            this.on("relations.second_class", "classes.id");
        })
        .where("relations.relation", "realization")
        .join("relations as r", async function () {
            this.on("r.first_class", "classes.id");
        })
        .where("r.relation", "aggregation")
        .join("members", async function () {
            this.on("members.class", "r.second_class");
        });
    return result.length ? result[0].first_class : "";
}

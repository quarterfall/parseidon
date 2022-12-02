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
    const findSubscriberAndPublisherQuery = knex
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
        .where("r.relation", "aggregation");

    const observerQuery =  findSubscriberAndPublisherQuery.then(
        async (res) => {
            if (!res.length) {
                return [];
            }
            if (
                (
                    await knex
                        .from("relations")
                        .select("*")
                        .where("relations.first_class", res[0].second_class)
                        .andWhere("relations.relation", "realization")
                        .andWhere("relations.second_class", res[0].first_class)
                ).length == 0
            ) {
                return await findSubscriberAndPublisherQuery
                    .join("members", async function () {
                        this.on("members.class", "r.second_class");
                    })
                    .whereLike(
                        "members.type",
                        `${await checkInterfaceArrayName(knex)}[]`
                    )
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
            } else {
                return [];
            }
        }
    );
    if ((await observerQuery).length) {
    
        await observerQuery.then(async (res) => {
            console.log(res)
            await knex
                .from("classes")
                .where("id", res[0].class)
                .update("patternLabel", "singleton");
        });
        return true;
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

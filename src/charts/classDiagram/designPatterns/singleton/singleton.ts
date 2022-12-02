import { Knex } from "knex";

export async function checkSingletonByName(knex: Knex) {
    const singletonQuery = knex
        .from("classes")
        .select("*")
        .join("members", async function () {
            this.on("members.class", "classes.id").andOn(
                "members.type",
                "classes.id"
            );
        })
        .where("members.accessibility", "private")
        .where("members.classifier", "static")
        .join("methods", async function () {
            this.on("methods.class", "classes.id").andOn(
                "methods.name",
                "classes.id"
            );
        })
        .where("methods.accessibility", "private")
        .join("methods as m", async function () {
            this.on("m.class", "classes.id").andOn(
                "m.returnType",
                "classes.id"
            );
        });

    if ((await singletonQuery).length) {
        await singletonQuery.then(async (res) => {
            console.log(res);
            if (res.length) {
                await knex
                    .from("classes")
                    .where("id", res[0].class)
                    .update("patternLabel", "singleton");
            }
        });
        return true;
    } else {
        return false;
    }
}

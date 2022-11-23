import { Knex } from "knex";
import { _Class } from "../../ClassDiagram";
import { getPrivateConstructor } from "../queries";
import {
    getPrivateStaticSingletonInstance,
    getPublicMethodReturningSingleton,
    getSingletonInstancesFromOtherClasses,
} from "./singleton.queries";

export async function checkSingletonByName(knex: Knex, className: string) {
    
    if ((await getPrivateStaticSingletonInstance(knex, className)).length) {
        if ((await getPrivateConstructor(knex, className)).length) {
            if ((await getPublicMethodReturningSingleton(knex, className)).length) {
                return !(await getSingletonInstancesFromOtherClasses(knex, className)).length
            }
        }
    }
    return false;
}




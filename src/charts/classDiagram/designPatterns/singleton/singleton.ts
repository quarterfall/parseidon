import { Knex } from "knex";
import { _Class } from "../../ClassDiagram";
import { getPrivateConstructor} from "../queries";
import { getPrivateStaticSingletonInstance, getPublicMethodReturningSingleton, getSingletonInstancesFromOtherClasses } from "./singleton.queries";

export async function checkSingletonByName(knex: Knex, className: string) {
    
    return getPrivateStaticSingletonInstance(knex, className).then((res) => {
        if (!res.length) {
            return false;
        }
        return getPrivateConstructor(knex, className).then((res) => {
            if (!res.length) {
                return false;
            }
            return getPublicMethodReturningSingleton(knex, className).then((res) => {
                if (!res.length) {
                    return false;
                }
                return getSingletonInstancesFromOtherClasses(knex, className).then((res) => {
                    return !res.length;
                });
            });
        });
    });
}

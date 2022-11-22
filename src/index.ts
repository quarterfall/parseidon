import knex from "knex";
import {
    ClassDiagram,
    DesignPattern,
    getAllClasses,
    getAllDesignPatterns,
    getAllRelations,
    initDatabase,
    Relation,
    _Class,
} from "./charts/classDiagram";

export type ParseidonOptions = {
    input: ClassDiagramType
}

export type ClassDiagramType = {
    classes: any,
    relations: MermaidRelation[]
}

export type MermaidRelation = {
    id1: string,
    id2: string,
    relation: {type1: number | string, type2: number | string, lineType: number | string},
    relationTitle1: string,
    relationTitle2: string
}

export async function parseidon({input}: ParseidonOptions): Promise<
    | {
          classes: _Class[];
          relations: Relation[];
          designPatterns: DesignPattern[];
      }
    | undefined
> {
    try {
        console.log("[Starting Parse]");
        //establish database connection
        const conn = knex({
            client: "sqlite3",
            connection: {
                filename: ":memory:",
            },
            useNullAsDefault: true,
        });

        let classDiagram: ClassDiagram = new ClassDiagram(
            input.classes,
            input.relations
        );
       
        await initDatabase(conn, classDiagram);
        let classes: _Class[] = await getAllClasses(conn);
        let relations: Relation[] = [];
        let designPatterns: DesignPattern[] = [];    
        if (!classDiagram?.getRelations().length) {
            conn.destroy();
            return {
                classes,
                relations,
                designPatterns
            }
        }
        relations = await getAllRelations(conn);
        designPatterns = await getAllDesignPatterns(conn);
        conn.destroy();
        return {
            classes,
            relations,
            designPatterns,
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
}

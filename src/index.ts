import knex from "knex";
import mermaid from "mermaid";
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

export async function parseidon(input: string): Promise<
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

        //clear parser
        mermaid.mermaidAPI.parse(input).parser.yy.clear();
        //parse input
        const temp = mermaid.mermaidAPI.parse(input).parser.yy;

        let classDiagram: ClassDiagram = new ClassDiagram(
            temp.getClasses(),
            temp.getRelations()
        );
        if (!classDiagram?.getRelations().length) {
            throw new Error("Class diagram has no relations!");
        }
        await initDatabase(conn, classDiagram);
        let classes: _Class[] = await getAllClasses(conn);
        let relations: Relation[] = await getAllRelations(conn);
        let designPatterns: DesignPattern[] = await getAllDesignPatterns(conn);

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

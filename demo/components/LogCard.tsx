import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export type DesignPattern = {
    id: number;
    className: string;
    pattern: string;
};

export type Relation = {
    id: number;
    first_class: string;
    relation: string;
    second_class: string;
};

export type _Class = {
    id: string;
    type: string;
    members: string[];
    methods: string[];
    annotations: string[];
    domId?: string;
    cssClasses?: string[];
};

export interface MermaidParsedClassDiagram {
    classes: _Class[];
    designPatterns: DesignPattern[];
    relations: Relation[];
}

const LogCard = ({ log }: { log: MermaidParsedClassDiagram | null }) => {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <div>
                    <h3>Classes</h3>
                    <ul>
                        {log?.classes.map((_class: any) => (
                            <li key={`class_${_class.id}`}>{_class.id}</li>
                        ))}
                    </ul>
                </div>
                {(log?.relations.length || []) > 0 ? (
                    <div>
                        <h3>Relations</h3>
                        <ul>
                            {log?.relations.map((relation: any) => (
                                <li key={`relation_${relation.id}`}>
                                    Class {relation.first_class} has{" "}
                                    {relation.relation} with{" "}
                                    {relation.second_class}
                                </li>
                            ))}
                        </ul>{" "}
                    </div>
                ) : (
                    <h3>No relations</h3>
                )}
                {(log?.designPatterns || []).length > 0 ? (
                    <div>
                        <h3>Design Patterns</h3>
                        <ul>
                            {log?.designPatterns.map((pattern: any) => (
                                <div key={`pattern_${pattern.id}`}>
                                    {pattern.className === "all" && (
                                        <li>{pattern.pattern} pattern</li>
                                    )}
                                    {pattern.className !== "all" && (
                                        <li>
                                            Class {pattern.className} is a{" "}
                                            {pattern.pattern}
                                        </li>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <h3>No design patterns</h3>
                )}
            </CardContent>
        </Card>
    );
};
export default LogCard;

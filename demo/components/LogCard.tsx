import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import { useEffect, useState } from "react";
import { MermaidRendererProps } from "./MermaidRenderer";
import mermaid from "mermaid";

const LogCard = ({ chart }: MermaidRendererProps) => {
    const [classDiagram, setClassDiagram] = useState<{
        classes: any[];
        relations: any[];
        designPatterns: any[];
    }>({
        classes: [],
        relations: [],
        designPatterns: [],
    });
    mermaid.mermaidAPI
        .parse(chart.substring(10).slice(0, -3).trim())
        .parser.yy.clear();

    const temp = mermaid.mermaidAPI.parse(
        chart.substring(10).slice(0, -3).trim()
    ).parser.yy;

    console.log({ classes: temp.getClasses(), relations: temp.getRelations() });

    useEffect(() => {
        axios
            .post(
                "http://localhost:3000/api/post/parse",
                { classes: temp.getClasses(), relations: temp.getRelations() },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .then((res) => {
                setClassDiagram(res.data);
                console.log(res.data);
            })
            .catch((e) => console.log(e));
    }, []);

    console.log(classDiagram);

    return (
        <Card sx={{ minWidth: 275, mt: "10px" }}>
            <CardContent>
                <div>
                    <h3>Classes</h3>
                    <ul>
                        {classDiagram.classes.map((_class) => (
                            <li>{_class.id}</li>
                        ))}
                    </ul>
                </div>
                {classDiagram.relations.length > 0 ? (
                    <div>
                        <h3>Relations</h3>
                        <ul>
                            {classDiagram.relations.map((relation) => (
                                <li>
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
                {classDiagram.designPatterns.length > 0 ? (
                    <div>
                        <h3>Design Patterns</h3>
                        <ul>
                            {classDiagram.designPatterns.map((pattern) => (
                                <li>
                                    Class {pattern.className} is a singleton
                                </li>
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

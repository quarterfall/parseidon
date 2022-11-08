import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import { useEffect, useState } from "react";
import { MermaidRendererProps } from "./MermaidRenderer";

const LogCard = ({ chart }: MermaidRendererProps) => {
    const [classDiagram, setClassDiagram] = useState<{
        chart: any;
        chartType: string;
    }>({ chart: { classes: [], debug: [], relations: [] }, chartType: "" });
    let data = JSON.stringify({
        input: chart.substring(10).slice(0, -3).trim(),
    });
    console.log(data);
    useEffect(() => {
        axios
            .post("http://localhost:3000/api/post/parse", data, {
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
                setClassDiagram(res.data);
                console.log(res.data);
                console.log(classDiagram);
            })
            .catch((e) => console.log(e));
    }, []);

    // console.log(classDiagram.chart.classes);

    return (
        <Card sx={{ minWidth: 275, mt: "10px" }}>
            <CardContent>{JSON.stringify(classDiagram)}</CardContent>
        </Card>
    );
};
export default LogCard;

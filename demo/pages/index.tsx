import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import InputForm from "../components/InputForm";
import LogCard from "../components/LogCard";
import MermaidRenderer from "../components/MermaidRenderer";
import Navbar from "../components/Navbar";

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

export default function Home() {
    const [code, setCode] = useState(
        "```mermaid \n classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n      -Singleton singleton$\r\n      -Singleton()\r\n      +getInstance()$ Singleton    \r\n    }\n```"
    );
    const [cardVisible, setCardVisible] = useState(false);

    const [log, setLog] = useState<MermaidParsedClassDiagram>({
        classes: [],
        relations: [],
        designPatterns: [],
    });

    function changeCardVisible() {
        setCardVisible(!cardVisible);
    }

    useEffect(() => {
        mermaid.mermaidAPI
            .parse(code.substring(10).slice(0, -3).trim())
            .parser.yy.clear();
    }, [code]);

    return (
        <div>
            <Navbar />
            <Grid container spacing={2} sx={{ padding: 6 }}>
                <Grid item xs={6}>
                    <InputForm
                        commonCardVisible={cardVisible}
                        code={code}
                        setCode={setCode}
                        setLog={setLog}
                        changeCardVisible={changeCardVisible}
                    />
                </Grid>
                <Grid item xs={6}>
                    {cardVisible && (
                        <Stack spacing={1}>
                            <MermaidRenderer chart={code} />
                            <LogCard log={log} />
                        </Stack>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

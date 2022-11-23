import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputForm from "../components/InputForm";
import LogCard, { MermaidParsedClassDiagram } from "../components/LogCard";
import MermaidRenderer from "../components/MermaidRenderer";
import Navbar from "../components/Navbar";

export default function Home() {
    const [code, setCode] = useState(
        "```mermaid \n classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n      -Singleton singleton$\r\n      -Singleton()\r\n      +getInstance()$ Singleton    \r\n    }\n```"
    );

    const [log, setLog] = useState<MermaidParsedClassDiagram | null>({
        classes: [],
        relations: [],
        designPatterns: [],
    });

    return (
        <>
            <Navbar />
            <Grid container spacing={2} sx={{ padding: 6 }}>
                <Grid item xs={6}>
                    <InputForm code={code} setCode={setCode} setLog={setLog} />
                </Grid>
                <Grid item xs={6}>
                    {log && (
                        <Stack spacing={1}>
                            <MermaidRenderer chart={code} />
                            <LogCard log={log} />
                        </Stack>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

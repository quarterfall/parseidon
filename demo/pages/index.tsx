import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import mermaid from "mermaid";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputForm from "../components/InputForm";
import LogCard from "../components/LogCard";
import MermaidRenderer from "../components/MermaidRenderer";
import Navbar from "../components/Navbar";
import { IFormInput } from "../interfaces/IFormInput";

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
    const [code, setCode] = useState("");
    const [log, setLog] = useState<MermaidParsedClassDiagram>({
        classes: [],
        relations: [],
        designPatterns: [],
    });

    const defaultValues = {
        code: "```mermaid \n classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n      -Singleton singleton$\r\n      -Singleton()\r\n      +getInstance()$ Singleton    \r\n    }```",
    };

    const { handleSubmit, control, watch, reset } = useForm<IFormInput>({
        defaultValues,
    });

    const [cardVisible, setCardVisible] = useState(
        watch("code") !== defaultValues.code
    );

    function changeCardVisible() {
        setCardVisible(!cardVisible);
        reset({
            code: defaultValues.code || "",
        });
    }

    async function parseDiagram() {
        console.log(code);

        mermaid.mermaidAPI
            .parse(code.substring(10).slice(0, -3).trim())
            .parser.yy.clear();

        let temp = mermaid.mermaidAPI.parse(
            code.substring(10).slice(0, -3).trim()
        ).parser.yy;

        console.log({
            classes: temp.getClasses(),
            relations: temp.getRelations(),
        });
        axios
            .post(
                "https://europe-west1-quarterfall.cloudfunctions.net/parseidon",
                {
                    input: {
                        classes: temp.getClasses(),
                        relations: temp.getRelations(),
                    },
                }
            )
            .then((res) => {
                setLog(res.data);
                console.log(res.data);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
        setCode(data.code);
        setCardVisible(!cardVisible);
        await parseDiagram();
    };

    return (
        <>
            <Navbar />
            <Grid container spacing={2} sx={{ paddingX: 10, marginTop: 6 }}>
                <Grid item xs={6}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputForm
                            control={control}
                            changeCardVisible={changeCardVisible}
                            commonCardVisible={cardVisible}
                        />
                    </form>
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
        </>
    );
}

import Grid from "@mui/material/Grid";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputForm from "../components/InputForm";
import LogCard from "../components/LogCard";
import MermaidRenderer from "../components/MermaidRenderer";
import Navbar from "../components/Navbar";
import { IFormInput } from "../interfaces/IFormInput";

export default function Home() {
    const [code, setCode] = useState("");

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

    //move post request
    const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
        setCode(data.code);
        setCardVisible(!cardVisible);
    };

    return (
        <>
            <Navbar />
            <Grid container columnSpacing={-20} rowSpacing={3}>
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
                        <div>
                            <MermaidRenderer chart={code} />
                            <LogCard chart={code} />
                        </div>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

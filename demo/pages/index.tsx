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
        code: "```mermaid \n classDiagram \n classA <|-- classB \n classC *-- classD \n classE o-- classF \n classG <-- classH \n classI -- classJ \n classK <.. classL \n classM <|.. classN \n classO .. classP \n```",
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

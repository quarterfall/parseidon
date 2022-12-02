import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormInput } from "../interfaces/IFormInput";
import { MermaidParsedClassDiagram } from "./ParseidonLogCard";
import { TextFieldController } from "./TextFieldController";
import axios from "axios";
import mermaid from "mermaid";
import { Dispatch, SetStateAction } from "react";
import React from "react";
import MermaidFormButtons from "./MermaidFormButtons";

export interface InputFormProps {
    input: {
        data: {
            code?: string;
            log?: MermaidParsedClassDiagram
        } | null
        setData: Dispatch<SetStateAction<{
            code?: string;
            log?: MermaidParsedClassDiagram;
        } | null>>
    }
}
const InputForm = ({
    input
}: InputFormProps) => {


    const defaultValues = {
        code: "```mermaid \n classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n      -Singleton singleton$\r\n      -Singleton()\r\n      +getInstance()$ Singleton    \r\n    } \n ```",
    };

    const { handleSubmit, control, reset } = useForm<IFormInput>({
        defaultValues,
    });


    function resetCode() {
        reset({
            code: defaultValues.code || "",
        });
        input.setData(null);
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {

        if (data?.code) {
            mermaid.mermaidAPI
                .parse(data.code.substring(10).slice(0, -3).trim())
                .parser.yy.clear();

            let parsedInput = mermaid.mermaidAPI.parse(
                data.code.substring(10).slice(0, -3).trim()
            ).parser.yy;

            console.log({
                classes: parsedInput.getClasses(),
                relations: parsedInput.getRelations(),
            });
            const parsedResult = await axios.post(
                "https://europe-west1-quarterfall.cloudfunctions.net/parseidon",
                {
                    input: {
                        classes: parsedInput.getClasses(),
                        relations: parsedInput.getRelations(),
                    },
                },
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                }
            );

            input.setData({
                code: data.code,
                log: parsedResult?.data
            })

        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card
                sx={{
                    minWidth: 200,
                    position: "relative",
                }}
            >
                <CardContent>
                    <TextFieldController
                        control={control}
                        name="code"
                        label="MermaidJS"
                        variant="outlined"
                    />
                </CardContent>
                <CardActions
                    sx={{
                        justifyContent: "flex-end",
                        marginRight: 2,
                        marginBottom: 2,
                    }}
                >
                    <MermaidFormButtons
                        resetCode={resetCode}
                    />
                </CardActions>
            </Card>
        </form>

    );
};
export default InputForm;

import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormInput } from "../interfaces/IFormInput";
import { TextFieldController } from "./TextFieldController";

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

export interface InputFormProps {
    commonCardVisible: boolean;
    code: string;
    setCode: (_: string) => void;
    setLog: (_: MermaidParsedClassDiagram) => void;
    changeCardVisible(): void;
}
const InputForm = ({
    commonCardVisible,
    code,
    setCode,
    setLog,
    changeCardVisible,
}: InputFormProps) => {
    // Move useForm here
    // use the watch("code") to disable send button when the code hasn't changed
    // You can track this with a simple code, setCode useState()
    // disabled={watch("code") === code}

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const defaultValues = {
        code: "```mermaid \n classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n      -Singleton singleton$\r\n      -Singleton()\r\n      +getInstance()$ Singleton    \r\n    }\n```",
    };

    const { handleSubmit, control, reset, watch } = useForm<IFormInput>({
        defaultValues,
        mode: "onChange",
    });

    function resetCode() {
        reset({
            code: defaultValues.code || "",
        });
        setSubmitButtonDisabled(false);
    }

    async function parseDiagram() {
        let parsedInput = mermaid.mermaidAPI.parse(
            code.substring(10).slice(0, -3).trim() || ""
        ).parser.yy;

        axios
            .post(
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
            )
            .then((res) => {
                console.log(res.data);
                setLog(res.data);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
        if (!data.code) {
            return;
        }
        setCode(data?.code);
        changeCardVisible();
        await parseDiagram();
    };

    const onHandleSubmit = async (data: IFormInput) => {
        onSubmit(data);
        setSubmitButtonDisabled(true);
    };

    useEffect(() => {
        setSubmitButtonDisabled(false);
    }, [watch("code")]);

    return (
        <form onSubmit={handleSubmit(onHandleSubmit)}>
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
                    <Button
                        variant="contained"
                        data-cy="send_Button"
                        type="submit"
                        disabled={submitButtonDisabled}
                    >
                        Send
                    </Button>
                    <Button
                        onClick={() => {
                            resetCode();
                            changeCardVisible();
                        }}
                        variant="text"
                        data-cy="reset_Button"
                        sx={{ ml: "10px" }}
                        disabled={commonCardVisible ? false : true}
                    >
                        Reset
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};
export default InputForm;

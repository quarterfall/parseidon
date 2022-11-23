import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import mermaid from "mermaid";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormInput } from "../interfaces/IFormInput";
import { MermaidParsedClassDiagram } from "./LogCard";
import { TextFieldController } from "./TextFieldController";

export interface InputFormProps {
    code: string;
    setCode: (_: string) => void;
    setLog: (_: MermaidParsedClassDiagram | null) => void;
    resetButtonDisabled?: boolean;
}
const InputForm = ({ code, setCode, setLog }: InputFormProps) => {
    const defaultValues = {
        code: "```mermaid \n classDiagram\r\n    Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n    Singleton --> Singleton\r\n    Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n      -Singleton singleton$\r\n      -Singleton()\r\n      +getInstance()$ Singleton    \r\n    }\n```",
    };

    const { handleSubmit, control, reset, watch } = useForm<IFormInput>({
        defaultValues,
    });

    function resetCode() {
        reset({
            code: defaultValues.code || "",
        });
        setLog(null);
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
        if (!data.code) {
            return;
        }
        setCode(data?.code);

        mermaid.mermaidAPI
            .parse(code.substring(10).slice(0, -3).trim())
            .parser.yy.clear();

        let parsedInput = mermaid.mermaidAPI.parse(
            data?.code.substring(10).slice(0, -3).trim() || ""
        ).parser.yy;

        const result = await axios.post(
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
        setLog(result?.data);
    };

    const onHandleSubmit = async (data: IFormInput) => {
        onSubmit(data);
    };

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
                    >
                        Send
                    </Button>
                    <Button
                        onClick={() => {
                            resetCode();
                        }}
                        variant="text"
                        data-cy="reset_Button"
                        sx={{ ml: "10px" }}
                        disabled={watch("code") === defaultValues.code}
                    >
                        Reset
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};
export default InputForm;

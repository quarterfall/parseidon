import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormInput } from "../interfaces/IFormInput";
import { TextFieldController } from "./TextFieldController";

export interface InputFormProps {
    commonCardVisible: boolean;
    onSubmit: SubmitHandler<IFormInput>;
    code: string;
    changeCardVisible(): void;
}
const InputForm = ({
    commonCardVisible,
    onSubmit,
    code,
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

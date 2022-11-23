import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Control } from "react-hook-form";
import { IFormInput } from "../interfaces/IFormInput";
import { TextFieldController } from "./TextFieldController";

export interface InputFormProps {
    control: Control<IFormInput, any>;
    commonCardVisible: boolean;
    changeCardVisible(): void;
}
const InputForm = ({
    control,
    commonCardVisible,
    changeCardVisible,
}: InputFormProps) => {
    // Move useForm here
    // use the watch("code") to disable send button when the code hasn't changed
    // You can track this with a simple code, setCode useState()
    // disabled={watch("code") === code}




   
    return (
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
                        onClick={
                            changeCardVisible
                        }
                        variant="text"
                        data-cy="reset_Button"
                        sx={{ ml: "10px" }}
                        disabled={commonCardVisible ? false : true}
                    >
                        Reset
                    </Button>
                </CardActions>
            </Card>
    );
};
export default InputForm;

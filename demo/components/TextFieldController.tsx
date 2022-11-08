import { TextField, TextFieldProps } from "@mui/material";
import {
    Control,
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
} from "react-hook-form";

export type UnnamedTextFieldProps = Pick<
    TextFieldProps,
    Exclude<keyof TextFieldProps, "name">
>;
export type TextFieldControllerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = UnnamedTextFieldProps & {
    name: TName;
    control: Control<TFieldValues>;
    controllerProps?: Partial<ControllerProps<TFieldValues, TName>>;
    label?: string;
    variant?: string;
};
export function TextFieldController<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: TextFieldControllerProps<TFieldValues, TName>) {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange, value } }) => (
                <TextField
                    label={props.label}
                    onChange={onChange}
                    variant={props.variant}
                    focused
                    data-cy="input_Textfield"
                    sx={{ width: "500px" }}
                    multiline
                    fullWidth={true}
                    value={value || ""}
                />
            )}
            rules={{ required: "Field required" }}
        />
    );
}

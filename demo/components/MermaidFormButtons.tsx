import { Button } from "@mui/material";
import React from "react";

interface MermaidFormButtonsProps {
    resetCode(): void
}

const MermaidFormButtons = ({resetCode} : MermaidFormButtonsProps) => {
    return (
        <React.Fragment>
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
        >
            Reset
        </Button>
    </React.Fragment>
    )
}

export default MermaidFormButtons;
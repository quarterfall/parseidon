import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import InputForm from "../components/InputForm";
import LogCard, { MermaidParsedClassDiagram } from "../components/LogCard";
import MermaidRenderer from "../components/MermaidRenderer";
import Navbar from "../components/Navbar";

export default function Home() {
    const [output, setOutput] = useState<{
        code?: string;
        log?: MermaidParsedClassDiagram;
    } | null>({
        code: undefined,
        log: undefined,
    });

    return (
        <div>
            <Navbar />
            <Grid container spacing={2} sx={{ padding: 6 }}>
                <Grid item xs={6}>
                    <InputForm setOutput={setOutput} />
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={1}>
                        {output?.code ? (
                            <MermaidRenderer chart={output.code} />
                        ) : (
                            <div />
                        )}
                        {output?.log ? <LogCard log={output.log} /> : <div />}
                    </Stack>
                </Grid>
            </Grid>
        </div>
    );
}

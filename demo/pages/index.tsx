import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import InputForm from "../components/MermaidInputForm";
import LogCard, { MermaidParsedClassDiagram } from "../components/ParseidonLogCard";
import MermaidRenderer from "../components/RenderDiagramCard";
import Navbar from "../components/Navbar";
import React from "react";



export default function Home() {

    const [data, setData] = useState<{
        code?: string;
        log?: MermaidParsedClassDiagram;
    } | null>({
        code: undefined,
        log: undefined
    })

    const input = {
        data: data,
        setData: setData
    }

    return (
        <React.Fragment>
            <Navbar />
            <Grid container spacing={2} sx={{ padding: 6 }}>
                <Grid item xs={6}>
                    <InputForm
                       input={input}
                    />
                </Grid>
                <Grid item xs={6}>
                        <Stack spacing={1}>
                            {data?.code && (
                                <MermaidRenderer chart={data.code} />
                            )}
                            {data?.log && (
                                <LogCard log={data.log} />
                            )}
                        </Stack>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

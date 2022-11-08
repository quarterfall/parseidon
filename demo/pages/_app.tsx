import { grey } from "@mui/material/colors";
import blue from "@mui/material/colors/blue";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

export const theme = createTheme({
    palette: {
        primary: blue,
        background: {
            default: grey[200],
        },
    },
});

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <title>MermaidJS Interpreter</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </React.Fragment>
    );
}

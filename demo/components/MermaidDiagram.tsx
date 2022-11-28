import mermaid from "mermaid";
import { useEffect } from "react";
export interface MermaidViewerProps {
    chart: string;
}

export default function MermaidViewer(props: MermaidViewerProps) {
    useEffect(() => mermaid.contentLoaded(), []);
    mermaid.initialize({
        startOnLoad: true,
    });



    return <div className="mermaid">{props.chart}</div>;
}

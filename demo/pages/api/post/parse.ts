import { NextApiRequest, NextApiResponse } from "next";
import { parseidon } from "@quarterfall/parseidon";

export default async function parseHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const input = req.body;

    if (!input) {
        return res.status(404).json({ message: "No input found" });
    }
    let parsedChart = null;
    try {
        parsedChart = await parseidon(input);
    } catch (e) {
        return res.status(400).json({e});
    }

    return res.status(200).json(parsedChart)
        
}

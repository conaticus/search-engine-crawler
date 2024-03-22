import fs from "fs";
import readline from "readline";

export default async function loadTopSites(cb: (url: string) => void) {
    const fileStream = fs.createReadStream("input.txt");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let lineNumber = 1;
    for await (const line of rl) {
        if (++lineNumber > 10) break;
        await cb("https://" + line);
    }
}

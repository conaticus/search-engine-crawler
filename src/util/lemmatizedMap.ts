import fs from "fs/promises";

let lemmatizedMap: Record<string, string> | undefined;

async function loadLemmatizedMap() {
    if (!lemmatizedMap) {
        const mapRaw = await fs.readFile("./lemmatizedMap.json", "utf8");
        lemmatizedMap = JSON.parse(mapRaw);
    }

    return lemmatizedMap;
}

export default async function loadLemmatizedWord(word: string): Promise<string> {
    if (!lemmatizedMap) await loadLemmatizedMap();
    return (lemmatizedMap as any)[word];
}

loadLemmatizedMap();

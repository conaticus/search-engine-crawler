import puppeteer, { Browser, Page } from "puppeteer";
import { WordIndicies } from "./types";
import QueryBuilder from "./db/QueryBuilder";
import { v4 as uuidv4 } from "uuid";
import pool from "./db/pool";

export default class Crawler {
    browser: Browser;
    page: Page;
    documentCount: number;

    public static async create(documentCount: number): Promise<Crawler> {
        const crawler = new Crawler();
        crawler.documentCount = documentCount;
        // crawler.browser = await puppeteer.connect({
        //     browserWSEndpoint: `wss://${process.env.USER}:${process.env.PASSWORD}@brd.superproxy.io:9222`,
        // });
        crawler.browser = await puppeteer.launch();
        crawler.page = await crawler.browser.newPage();
        await crawler.page.setRequestInterception(true);

        crawler.page.on("request", (request) => {
            if (request.isInterceptResolutionHandled()) return;

            switch (request.resourceType()) {
                case "image":
                case "media":
                case "stylesheet":
                case "font":
                case "script":
                    request.abort();
                    break;
                default:
                    request.continue();
            }
        });

        return crawler;
    }

    public async crawl(url: string) {
        await this.page.goto(url);

        // TODO: Insert more data such as attributes etc.
        const words: string[] = await this.page.$eval("*", (el: any) =>
            el.innerText
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                .trim()
                .split(/[\n\r\s]+/g)
        );

        const wordIndicies: WordIndicies = {};
        const keywordIds: { [key: string]: string } = {};
        const wordPositions: number[] = [];
        const wordIds: string[] = [];

        let wordPos = 0;
        let keywordIdsLength = 0;

        words.forEach((word) => {
            if (wordIndicies[word]) wordIndicies[word]++;
            else wordIndicies[word] = 1;

            if (!keywordIds[word]) {
                keywordIds[word] = uuidv4();
                keywordIdsLength++;
            }

            wordIds.push(keywordIds[word]);
            wordPositions.push(++wordPos);
        });

        const websiteId = uuidv4();
        // Not really neccesary and quite unoptimised, but is fine for now. TODO: Fix this
        const websiteIdsBatch = words.map(() => websiteId);

        const wordIndiciesBatch = words.map((word) => wordIndicies[word]);

        await QueryBuilder.insert("websites", ["id", "url"], [websiteId, url]);

        await QueryBuilder.insertManyOrUpdate(
            "keywords",
            ["id", "word", "documents_containing_word"],
            [
                Object.values(keywordIds),
                Object.keys(keywordIds),
                new Array<number>(keywordIdsLength).fill(1), // Ew
            ],
            ["UUID", "VARCHAR(45)", "BIGINT"],
            ["word"],
            "documents_containing_word = EXCLUDED.documents_containing_word + 1"
        );

        await QueryBuilder.insertMany(
            "website_keywords",
            ["keyword_id", "website_id", "occurrences", "position"],
            [wordIds, websiteIdsBatch, wordIndiciesBatch, wordPositions],
            ["UUID", "UUID", "INT", "INT"]
        );
    }
}

import puppeteer, { Browser, Page } from "puppeteer";
import { WordIndicies } from "./types";

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
        words.forEach((word) => {
            if (wordIndicies[word]) wordIndicies[word]++;
            else wordIndicies[word] = 1;
        });

        // Do SQL inserts or updates
    }
}

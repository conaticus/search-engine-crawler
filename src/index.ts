import dotenv from "dotenv";
dotenv.config();

import { Page } from "puppeteer";
import Crawler from "./crawler";

const SAMPLE_SITES = [
    "https://asus.com",
    // "https://ebay.com",
    // "https://www.bbc.co.uk/news",
    // "https://www.rust-lang.org/",
    // "https://en.wikipedia.org/wiki/Car",
];

async function scrapeSite(url: string, page: Page) {}

async function scrapeWeb() {
    const crawler = await Crawler.create(SAMPLE_SITES.length);

    for (const url of SAMPLE_SITES) {
        await crawler.crawl(url);
    }
}

scrapeWeb();

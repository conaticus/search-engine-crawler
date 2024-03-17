import dotenv from "dotenv";
dotenv.config();

import Crawler from "./crawler";

const SAMPLE_SITES = [
    "https://asus.com",
    "https://ebay.com",
    "https://www.bbc.co.uk/news",
    "https://www.rust-lang.org/",
    "https://www.vodafone.co.uk",
    "https://www.amazon.co.uk/",
];

async function scrapeWeb() {
    const crawler = await Crawler.create(SAMPLE_SITES.length);

    const tasks = [];
    for (const url of SAMPLE_SITES) {
        tasks.push(crawler.crawl(url));
    }

    await Promise.all(tasks);
    console.log("Websites scraped.");
}

scrapeWeb();

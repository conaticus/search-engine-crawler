import dotenv from "dotenv";
dotenv.config();

import Crawler from "./crawler";
import isRootForbidden from "./util/RobotsParser";
import puppeteer from "puppeteer";
import loadTopSites from "./util/loadTopSites";

const SAMPLE_SITES = [
    // Ecommerce
    "https://www.amazon.co.uk/",
    "https://www.ebay.co.uk/",
    "https://www.walmart.com/",
    "https://www.ikea.com/gb/en/",
    "https://www.shopify.com/",
];

async function scrapeWeb() {
    const crawler = await Crawler.create(SAMPLE_SITES.length);
    await loadTopSites(crawler.crawl);
    console.log("Websites scraped.");
}

scrapeWeb();

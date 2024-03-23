import dotenv from "dotenv";
dotenv.config();

import loadTopSites from "./util/loadTopSites";

async function scrapeWeb() {
    // Allow us to attatch listeners for each website
    require("events").EventEmitter.prototype._maxListeners = 0;

    await loadTopSites();
    console.log("Websites scraped.");
}

scrapeWeb();

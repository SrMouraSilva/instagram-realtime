"use strict";

const Fetcher = require("./Fetcher");

class GeographyFetcher extends Fetcher {
    constructor(mediaFetcher) {
        super(mediaFetcher);
    }

    isForThis(type) {
        return type === 'geography';
    }

    call(id) {
        this.mediaFetcher.requestBy("geographies", id);
    }
}

module.exports = GeographyFetcher;

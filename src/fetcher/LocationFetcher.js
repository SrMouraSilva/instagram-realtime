"use strict";

const Fetcher = require("./Fetcher");

class LocationFetcher extends Fetcher {
    constructor(mediaFetcher) {
        super(mediaFetcher);
    }

    isForThis(type) {
        return type === 'location';
    }

    call(id) {
        this.mediaFetcher.requestBy("locations", id);
    }
}

module.exports = LocationFetcher;

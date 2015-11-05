"use strict";

class Fetcher {
    constructor(mediaFetcher) {
        this.mediaFetcher = mediaFetcher;
    }

    isForThis(sub_type) {
        return false;
    }

    call(id) {}
}

module.exports = Fetcher;

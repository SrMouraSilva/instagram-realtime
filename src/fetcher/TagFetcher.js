"use strict";

const Fetcher = require("./Fetcher");

class TagFetcher extends Fetcher {
    constructor(mediaFetcher) {
        super(mediaFetcher);
    }

    isForThis(type) {
        return type === 'tag';
    }

    call(tag) {
        this.mediaFetcher.requestBy("tags", tag);
    }
}

module.exports = TagFetcher;

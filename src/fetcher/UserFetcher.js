"use strict";

const Fetcher = require("./Fetcher");

class UserFetcher extends Fetcher {
    constructor(mediaFetcher) {
        super(mediaFetcher);
    }

    isForThis(type) {
        return type === 'user';
    }

    call(id) {
        console.log('NOTE: UserFetcher is *not* implemented');
        this.mediaFetcher.requestBy("users", id);
    }
}

module.exports = UserFetcher;

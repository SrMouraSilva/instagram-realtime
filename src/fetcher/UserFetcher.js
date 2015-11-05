"use strict";

const Fetcher = require("./Fetcher");

class UserFetcher extends Fetcher {
    constructor(mediaFetcher) {
        super(mediaFetcher);
    }

    isForThis(type) {
        console.log('routing user-media traffic');
        console.log('NOTE: this is *not* implemented');
        return type === 'user';
    }

    call(id) {
        this.mediaFetcher.requestBy("users", id);
    }
}

module.exports = UserFetcher;

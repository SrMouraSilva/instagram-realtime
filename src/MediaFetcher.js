"use strict";

const UserFetcher      = require("./fetcher/UserFetcher");
const TagFetcher       = require("./fetcher/TagFetcher");
const LocationFetcher  = require("./fetcher/LocationFetcher");
const GeographyFetcher = require("./fetcher/GeographyFetcher");

class MediaFetcher {

    constructor(instagramStream, auth) {
        this.instagramStream = instagramStream
        this.auth = auth;

        this.request = require('request');
        this.fetchers = [
            new UserFetcher(this),
            new TagFetcher(this),
            new LocationFetcher(this),
            new GeographyFetcher(this)
        ];
    }

    fetch(type, id) {
        for (let fetcher of this.fetchers)
            if (fetcher.isForThis(type)) {
                fetcher.call(id);
                return;
            }

        console.log('bad media update');
    }

    requestBy(dataType, value) {
        const url = `https://api.instagram.com/v1/${dataType}/${value}/media/recent?client_id=${this.auth.client_id}`;

        console.log(url);
        this.request.get(url, (error, resp, body) => this.callback(error, resp, body));
    }

    //@private
    callback(error, resp, body) {
        if (resp.statusCode === 200)
            this.instagramStream.emit('new', resp, body);
        else
            this.instagramStream.emit('new/error', resp, body);
    }
}

module.exports = MediaFetcher;

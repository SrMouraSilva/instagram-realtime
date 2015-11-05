"use strict";

// External dependencies
const express = require('express');
const bodyParser = require('body-parser');
const EventEmitter = require('events').EventEmitter;

// Internal dependencies
const SubscriptionManager = require('./SubscriptionManager.js');
const MediaFetcher        = require('./MediaFetcher.js');

/**
 * InstagramStream Object
 * Creates an InstagramStream usable with triggers
 * @param {!Server} server  a Node HTTP server or Express App()
 * @param {object}  opts    options object
 */
class InstagramStream extends EventEmitter {
    constructor(server, opts) {
        super();

        if (!OptionsManager.validate(server, opts))
            throw new Error("Invalid params!");

        this.auth = OptionsManager.prepare(opts);

        this.subscription = new SubscriptionManager(this, this.auth);
        this.fetcher = new MediaFetcher(this, this.auth);

        this.trafic = new Trafic(server, this);
        this.trafic.initializate();
    }

    subscribe(term) {
        this.subscription.subscribe(term);
    }

    unsubscribe(id) {
        id = id || 'all';
        this.subscription.unsubscribe(id);
    }
}

class OptionsManager {
    /**
     * @return {boolean} hasValid
     */
    static validate(server, opts) {
        opts = opts || {};

        let error = false;
        error = !OptionsManager.isParamValid("client_id", opts)     || error;
        error = !OptionsManager.isParamValid("client_secret", opts) || error;
        error = !OptionsManager.isParamValid("url", opts)           || error;
        error = !OptionsManager.isParamValid("callback_path", opts) || error;

        return !error;
    }

    static isParamValid(param, opts) {
        if (!opts[param]) {
            console.log(`Invalid "${param}"`);
            return false;
        }

        return true;
    }

    static prepare(opts) {
        opts.callback_path = opts.callback_path ? opts.callback_path : 'callback';

        const auth = {
            client_id     : opts.client_id,
            client_secret : opts.client_secret,
            url           : opts.url,
            callback_path : opts.callback_path,
            callback_url  : opts.url + '/' + opts.callback_path
        };

        return auth;
    }
}

class Trafic {
    constructor(server, instagramStream) {
        this.stream = instagramStream;
        this.app = this.initializate(server);
    }

    initializate(server) {
        const app = express();

        app.use(bodyParser.json());

        app.get('/callback',  (req, res) => res.send(req.query['hub.challenge']));
        app.post('/callback', (req, res) => this.routeTraffic(req.body));

        app.listen(server);

        return app;
    }

    /**
     * Request a Media Search from Instagram Based on an HTTP-Request
     * ~~~
     * @param {!Request Body} body an HTTP-request from the InstagramAPI containing
     * object-id and subscription-id information. This can determine which type of
     * subscription was sent, and what its purpose was.
     */
    routeTraffic(body) {
        for (let message of body)
            this.routeMediaResponse(message);
    }

    //@private
    routeMediaResponse(message) {
        const type = message.object;
        const idSubject = message.subscription_id;
        const idObject = message.object_id;

        if (!(idSubject && idObject)) {
            console.log('bad result... this seems like an Instagram API problem');
            console.log('sub_id = ' + idSubject);
            console.log('obj_id = ' + idObject);
        }

        const id = idObject !== undefined ? idObject : idSubject;
        this.stream.fetcher(type, id);
    }
}

// Exports
module.exports = InstagramStream;

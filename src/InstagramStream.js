"use strict";

// External dependencies
const express = require('express');
const bodyParser = require('body-parser');

// Internal dependencies
const SubscriptionManager = require('./SubscriptionManager.js');
const MediaFetcher        = require('./MediaFetcher.js');

/**
 * InstagramStream Object
 * Creates an InstagramStream usable with triggers
 * @param {!Server} server  a Node HTTP server or Express App()
 * @param {object}  opts    options object
 */
class InstagramStream {
    constructor(server, opts) {
        // Shift over parameters, if there is no server in the first slot
        if (typeof server === 'object' && typeof server.listen !== 'function') {
            server  = null;
            opts    = server;
        }

        opts = validadeOpts(opts);
        this.auth = prepareAuth(opts);

        this.subscription = new SubscriptionManager(this, this.auth);
        this.fetcher = new MediaFetcher(this, this.auth);

        ~function() {
            var app = express();

            app.use(bodyParser.json());

            app.get('/callback', function(req, res) {
                res.send(req.query['hub.challenge']);
            });

            app.post('/callback', function(req, res) {
                console.log(req.body);
                route_traffic(req.body);
            });

            app.listen(server);

        }.bind(this)();
    }

    subscribe(term) {
        this.subscription.subscribe(term);
    }

    unsubscribe(id) {
        id = id || 'all';
        this.subscription.unsubscribe(id);
    }

    emit(data) {
        console.log("Data emmited");
    }

    on(event, callback) {
        console.log("evento inscrito");
    }
}

//@private
function validadeOpts(opts) {
    opts = opts || {};

    if (!opts.client_id)
      console.log('Invalid "client_id"'.yellow);

    if (!opts.client_secret)
      console.log('Invalid "client_secret"'.yellow);

    if (!opts.url)
      console.log('Invalid "url"'.yellow);

    if (!opts.callback_path)
      console.log('Invalid "callback_path"'.yellow);

    return opts;
}

function prepareAuth(opts) {
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

/**
 * Request a Media Search from Instagram Based on an HTTP-Request
 * ~~~
 * @param {!Request Body} body an HTTP-request from the InstagramAPI containing
 * object-id and subscription-id information. This can determine which type of
 * subscription was sent, and what its purpose was.
 */
function route_traffic(body) {
    console.log(body); // FIXME : Bodt wrong
    for (let message of body)
      route_individual_media_response(message);
}

function route_individual_media_response(result) {
    const type = result.object;
    const idSubject = result.subscription_id;
    const idObject = result.object_id;

    if (!(idSubject && idObject)) {
        console.log('bad result... this seems like an Instagram API problem');
        console.log('sub_id = ' + idSubject);
        console.log('obj_id = ' + idObject);
    }

    const id = idObject !== undefined ? idObject : idSubject;
    _fetch.fetch(type, id);
}


// Exports
module.exports = InstagramStream;

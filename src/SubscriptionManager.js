"use strict";

let request = require('request');
let connect = require('connect');
let url = require('url');

let TagSubscription = require('./subscription/TagSubscription');
let UserSubscription = require('./subscription/UserSubscription');
let LocationSubscription = require('./subscription/UserSubscription');
let GeographySubscription = require('./subscription/GeographySubscription');

/**
 * SubscriptionManager
 * Helps with Instagram Subscriptions
 */
class SubscriptionManager {
    constructor(params) {
        this.parent = params.parent;
        this.server = params.server;

        this.client = {
            'id'     : params.client_id,
            'secret' : params.client_secret,
            'callback_url' : params.callback_url,
        };

        this.subscribers = [
            UserSubscription,
            TagSubscription,
            GeographySubscription,
            LocationSubscription
        ];
    }

    /**
     * Delete Subscriptions
     * Sends a DELETE HTTP-Request with client information to Instagram API. This
     * cancels a specific media subscription, if "id" is an identifier.
     * If "id" is "all or undefined, all subscriptions are cancelled.
     * @param {number or string} id a number of string representing the subscription
     * to cancel
     */
    unsubscribe(id) {
        id = typeof id !== 'undefined' ? id : 'all';
        var url = 'https://api.instagram.com/v1/subscriptions';
        url += '?client_secret='  + this.client.secret;
        url += '&client_id='      + this.client.id;
        url += '&object='         + id;

        request.del(url, this.unsubscribe_handler.bind(this));
    };

    //@private
    unsubscribe_handler(error, resp, body) {
        if (resp.statusCode === 200)
            this.parent.emit('unsubscribe', resp, body);
        else
            this.parent.emit('unsubscribe/error', error, resp, body);
    }

    subscribe(term) {
        for (let subscriber of this.subscribers)
            if (subscriber.isForThis(term)) {
                this._subscribe(subscriber.create(term));
                break;
            }
    }

    _subscribe(subscription) {
        let data = subscription.data;

        data.client_id     = this.client.id;
        data.client_secret = this.client.secret;
        data.callback_url  = this.client.callback_url;

        request.post(subscription.url, { form : data }, this.subscribe_handler.bind(this));
    }

    //@private
    subscribe_handler(error, resp, body) {
        if (resp.statusCode === 200)
            this.parent.emit('subscribe', resp, body);
        else
            this.parent.emit('subscribe/error', error, resp, body);
    }
}



module.exports = SubscriptionManager;

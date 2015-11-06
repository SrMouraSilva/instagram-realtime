"use strict";

const request = require('request');

const TagSubscription = require('./subscription/TagSubscription');
const UserSubscription = require('./subscription/UserSubscription');
const LocationSubscription = require('./subscription/UserSubscription');
const GeographySubscription = require('./subscription/GeographySubscription');

/**
 * SubscriptionManager
 * Helps with Instagram Subscriptions
 */
class SubscriptionManager {
    constructor(instagramStream, auth) {
        this.instagramStream = instagramStream;

        this.client = {
            'id'     : auth.client_id,
            'secret' : auth.client_secret,
            'callback_url' : auth.callback_url,
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
        let url = 'https://api.instagram.com/v1/subscriptions';
        url += '?client_secret='  + this.client.secret;
        url += '&client_id='      + this.client.id;
        url += '&object='         + id;

        request.del(url, this.unsubscribeHandler.bind(this));
    };

    //@private
    unsubscribeHandler(error, resp, body) {
        if (resp.statusCode === 200)
            this.instagramStream.emit('unsubscribe', resp, body);
        else
            this.instagramStream.emit('unsubscribe/error', error, resp, body);
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

        request.post(subscription.url, { form : data }, this.subscribeHandler.bind(this));
    }

    //@private
    subscribeHandler(error, resp, body) {
        if (resp.statusCode === 200)
            this.instagramStream.emit('subscribe', resp, body);
        else
            this.instagramStream.emit('subscribe/error', error, resp, body);
    }
}



module.exports = SubscriptionManager;

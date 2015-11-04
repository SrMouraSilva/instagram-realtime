"use strict";

let Subscription = require('./Subscription');

/**
 * Subscribe to Users
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to the full set of authenticated to the app.
 * @return {undefined} undefined
 */
class UserSubscription extends Subscription {
    constructor() {
        super();

        this.data.object = 'user';
        this.data.aspect = 'media';
    }

    static isForThis(term) {
        return typeof term.user !== 'undefined' && term.user;
    }

    static create(term) {
        return new UserSubscription();
    }
}

module.exports = UserSubscription;

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
}

module.exports = UserSubscription;

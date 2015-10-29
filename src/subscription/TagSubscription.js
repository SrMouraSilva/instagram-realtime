"use strict";

let Subscription = require('./Subscription');

/**
 * Subscription to a Hashtag
 * By an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to a specific hashtag.
 */
class TagSubscription extends Subscription {

    /**
     * @param {object} {
     *     object_id: {string} hastag
     * }
     */
    constructor(data) {
        super();

        this.data.object = 'tag';
        this.data.aspect = 'media';
        this.data.object_id = data.object_id;
    }
}

module.exports = TagSubscription;

"use strict";

let Subscription = require('./Subscription');

/**
 * Subscribe to Location by ID
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to a specific, location via ID.
 */
class LocationSubscription extends Subscription {
    /**
     * @param {object} data {
     *     {string} id an identification string for a particular location
     * }
     */
    constructor(data) {
        super();

        this.data.object = 'location';
        this.data.aspect = 'media';
        this.data.object_id = data.id;
    }

    static isForThis(term) {
        return (typeof term.location === 'number' || typeof term.location === 'string') && term.location !== '';
    }

    static create(term) {
        return new LocationSubscription({'id':term.location});
    }
}

module.exports = LocationSubscription;

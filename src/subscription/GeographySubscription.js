"use strict";

let Subscription = require('./Subscription');

/**
 * Subscribe to a Longitude-Latitude Coordinate
 * Send an HTTP POST-request to the Instagram API, requesting a realtime
 * subscription to a specific, longitude-latitude coordinate with a radius.
 */
class GeographySubscription extends Subscription {
    /**
     * @param {object} data {
     *     {string} lat latitude coordinate
     *     {string} lng longitude coordinate
     *     {string} rad the radius
     * }
     */
    constructor(data) {
        super();

        let lng = typeof data.lng === 'number' ? data.lng : 10;
        let lat = typeof data.lat === 'number' ? data.lat : 10;
        let rad = typeof data.rad === 'number' && data.rad >= 0 ? data.rad : 1000;

        this.data.object = 'geography';
        this.data.aspect = 'media';

        this.data.lng = lng;
        this.data.lat = lat;
        this.data.rad = rad;
    }


    static isForThis(term) {
        return typeof term.lat === 'number' && typeof term.lng === 'number' && typeof term.radius === 'number';
    }

    static create(term) {
        return new GeographySubscription({'lat':term.lat, 'lng': term.lng, 'rad': term.rad});
    }

}

module.exports = GeographySubscription;

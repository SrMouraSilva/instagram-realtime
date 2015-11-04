"use strict";

class Subscription {
    constructor() {
        this.url = 'https://api.instagram.com/v1/subscriptions/';
        this.data = {}
    }

    static isForThis(term) {
        return false;
    }

    static create(term) {
        return null;
    }
}

module.exports = Subscription;

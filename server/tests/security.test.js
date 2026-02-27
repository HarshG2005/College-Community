import assert from 'node:assert';
import { test } from 'node:test';
import { securityMiddleware } from '../middleware/security.js';

test('Security Middleware: NoSQL Injection', async (t) => {
    const req = {
        body: {
            username: 'test',
            password: { $ne: 'something' } // Malicious NoSQL operator
        },
        query: {},
        params: {}
    };
    const res = {};
    const next = () => {};

    securityMiddleware(req, res, next);

    assert.strictEqual(req.body.username, 'test');
    assert.deepStrictEqual(req.body.password, {}, '$ne should be removed');
});

test('Security Middleware: Prototype Pollution', async (t) => {
    const req = {
        body: {
            normal: 'value',
            __proto__: { isAdmin: true },
            constructor: 'something',
            prototype: 'bad'
        },
        query: {},
        params: {}
    };
    const res = {};
    const next = () => {};

    securityMiddleware(req, res, next);

    assert.strictEqual(req.body.normal, 'value');
    // The keys should not be present in the sanitized object
    assert.strictEqual(Object.prototype.hasOwnProperty.call(req.body, '__proto__'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(req.body, 'constructor'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(req.body, 'prototype'), false);
});

test('Security Middleware: Nested Objects', async (t) => {
    const req = {
        body: {
            user: {
                name: 'Alice',
                settings: {
                    $where: 'sleep(1000)'
                }
            }
        },
        query: {},
        params: {}
    };
    const res = {};
    const next = () => {};

    securityMiddleware(req, res, next);

    assert.strictEqual(req.body.user.name, 'Alice');
    assert.deepStrictEqual(req.body.user.settings, {}, '$where should be removed');
});

test('Security Middleware: Arrays', async (t) => {
    const req = {
        body: {
            items: [
                { id: 1 },
                { $gt: 5 }
            ]
        },
        query: {},
        params: {}
    };
    const res = {};
    const next = () => {};

    securityMiddleware(req, res, next);

    assert.strictEqual(req.body.items[0].id, 1);
    assert.deepStrictEqual(req.body.items[1], {}, '$gt should be removed');
});

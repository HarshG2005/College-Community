import { test } from 'node:test';
import assert from 'node:assert';
import { securityMiddleware } from './middleware/security.js';

test('Vulnerability Check: Non-string input causes TypeError (DoS via unhandled exception)', () => {
    const input = { $ne: null };
    try {
        input.toLowerCase();
        assert.fail('Should have thrown TypeError');
    } catch (e) {
        assert.ok(e instanceof TypeError, 'Confirmed TypeError on object.toLowerCase()');
    }
});

test('Security Middleware: Sanitizes NoSQL Injection in Body', () => {
    const req = {
        body: {
            email: { "$ne": null },
            valid: "data",
            nested: { "$gt": 5 }
        },
        query: {},
        params: {}
    };
    const next = () => {};

    securityMiddleware(req, {}, next);

    assert.deepStrictEqual(req.body.email, {}, 'Removes $ne key');
    assert.strictEqual(req.body.valid, 'data', 'Preserves valid data');
    assert.deepStrictEqual(req.body.nested, {}, 'Removes nested $gt key');
});

test('Security Middleware: Sanitizes NoSQL Injection in Query', () => {
    const req = {
        body: {},
        query: {
            category: { "$ne": null },
            safe: "ok"
        },
        params: {}
    };
    const next = () => {};

    securityMiddleware(req, {}, next);

    // $ne is removed -> category is {} -> normalized to "[object Object]"
    assert.strictEqual(req.query.category, '[object Object]', 'Converts sanitized object to string');
    assert.strictEqual(req.query.safe, 'ok', 'Preserves string value');
});

test('Security Middleware: Prevents Type Error DoS in Query', () => {
    const req = {
        body: {},
        query: {
            category: { "foo": "bar" } // Valid object structure but potentially malicious if expecting string
        },
        params: {}
    };
    const next = () => {};

    securityMiddleware(req, {}, next);

    // Should be converted to string
    assert.strictEqual(req.query.category, '[object Object]', 'Converts object to string to prevent method calls');

    // Verify .toLowerCase() is safe
    try {
        req.query.category.toLowerCase();
        assert.ok(true, 'Stringified object supports .toLowerCase()');
    } catch (e) {
        assert.fail('Should not throw TypeError');
    }
});

test('Security Middleware: Handles Arrays in Query', () => {
    const req = {
        body: {},
        query: {
            tags: ["a", "b", { "$ne": null }]
        },
        params: {}
    };
    const next = () => {};

    securityMiddleware(req, {}, next);

    // Array should be preserved but elements sanitized
    assert.ok(Array.isArray(req.query.tags));
    assert.strictEqual(req.query.tags[0], 'a');
    assert.strictEqual(req.query.tags[1], 'b');

    // The malicious element { $ne: null } -> sanitized to {} -> normalized to "[object Object]"
    assert.strictEqual(req.query.tags[2], '[object Object]');
});

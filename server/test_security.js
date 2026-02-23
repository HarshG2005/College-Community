import { securityMiddleware } from './middleware/security.js';
import assert from 'assert';

console.log('🧪 Testing Security Middleware...');

// Mock Request and Response
const createMockReq = (body = {}, query = {}, params = {}) => ({
    body,
    query,
    params,
    headers: {}
});

const createMockRes = () => {
    const headers = {};
    return {
        setHeader: (key, val) => { headers[key] = val; },
        removeHeader: (key) => { delete headers[key]; },
        getHeaders: () => headers
    };
};

const next = () => {};

// Test 1: NoSQL Injection Sanitization
console.log('Test 1: NoSQL Injection Sanitization');
const req1 = createMockReq(
    { email: { $ne: null }, password: '123' }, // body
    { category: { $gt: '' } }, // query
    { id: { $where: 'sleep(1000)' } } // params
);
const res1 = createMockRes();

securityMiddleware(req1, res1, next);

try {
    assert.deepStrictEqual(req1.body, { password: '123', email: {} });
    // Note: sanitizing removes keys starting with $.
    // { email: { $ne: null } } -> email points to object. sanitize(req.body.email) -> deletes $ne.
    // So req.body.email becomes {}. This is correct.

    assert.deepStrictEqual(req1.query, { category: '[object Object]' });
    // Wait, my logic for DoS prevention converts object to string.
    // { category: { $gt: '' } } is an object.
    // sanitize removes $gt -> { category: {} }.
    // DoS logic converts {} to "[object Object]".
    // This assumes DoS logic runs AFTER or BEFORE sanitize?
    // If BEFORE: { category: { $gt: '' } } -> converted to "[object Object]".
    // If AFTER: { category: {} } -> converted to "[object Object]".
    // Both are safe.

    assert.deepStrictEqual(req1.params, { id: {} });
    console.log('✅ NoSQL Sanitization passed');
} catch (e) {
    console.error('❌ NoSQL Sanitization failed:', e);
    process.exit(1);
}

// Test 2: DoS Prevention (Object Injection)
console.log('Test 2: DoS Prevention (Object Injection in Query)');
const req2 = createMockReq({}, { category: { some: 'obj' } }); // valid object but risky if code expects string
const res2 = createMockRes();

securityMiddleware(req2, res2, next);

try {
    assert.strictEqual(typeof req2.query.category, 'string');
    assert.strictEqual(req2.query.category, '[object Object]');
    console.log('✅ DoS Prevention passed');
} catch (e) {
    console.error('❌ DoS Prevention failed:', e);
    console.log('Received:', req2.query);
    process.exit(1);
}

// Test 3: Security Headers
console.log('Test 3: Security Headers');
const req3 = createMockReq();
const res3 = createMockRes();

securityMiddleware(req3, res3, next);

const headers = res3.getHeaders();
try {
    assert.strictEqual(headers['X-Content-Type-Options'], 'nosniff');
    assert.strictEqual(headers['X-Frame-Options'], 'DENY');
    assert.strictEqual(headers['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
    console.log('✅ Security Headers passed');
} catch (e) {
    console.error('❌ Security Headers failed:', e);
    process.exit(1);
}

console.log('🎉 All tests passed!');

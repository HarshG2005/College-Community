import test from 'node:test';
import assert from 'node:assert';
import { sanitizeData } from '../middleware/security.js';

test('Security Middleware', async (t) => {
    await t.test('Should remove keys starting with $', () => {
        const input = {
            name: 'John',
            $where: 'this.password.length > 0',
            query: { $gt: 5 }
        };
        const expected = {
            name: 'John',
            query: {}
        };
        const output = sanitizeData(input);
        assert.deepStrictEqual(output, expected);
    });

    await t.test('Should handle arrays correctly', () => {
        const input = [
            { id: 1, $ne: null },
            { id: 2, value: { $gte: 10 } }
        ];
        const expected = [
            { id: 1 },
            { id: 2, value: {} }
        ];
        const output = sanitizeData(input);
        assert.deepStrictEqual(output, expected);
    });

    await t.test('Should prevent prototype pollution', () => {
        const input = {
            __proto__: { isAdmin: true },
            constructor: { name: 'Function' },
            prototype: { foo: 'bar' },
            safe: 'value'
        };
        const expected = {
            safe: 'value'
        };
        const output = sanitizeData(input);
        assert.deepStrictEqual(output, expected);
    });

    await t.test('Should handle null and undefined', () => {
        assert.strictEqual(sanitizeData(null), null);
        assert.strictEqual(sanitizeData(undefined), undefined);
    });

    await t.test('Should return primitives as is', () => {
        assert.strictEqual(sanitizeData(123), 123);
        assert.strictEqual(sanitizeData('test'), 'test');
        assert.strictEqual(sanitizeData(true), true);
    });

    await t.test('Should handle deep nesting', () => {
        const input = {
            a: {
                b: {
                    c: {
                        $bad: 1,
                        good: 2
                    }
                }
            }
        };
        const expected = {
            a: {
                b: {
                    c: {
                        good: 2
                    }
                }
            }
        };
        const output = sanitizeData(input);
        assert.deepStrictEqual(output, expected);
    });
});

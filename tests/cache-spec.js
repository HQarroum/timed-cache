var expect = require('expect');
var Cache = require('../cache.js');

/**
 * Configuration test plan.
 */
describe('Cache storage', function () {
    var cache;

    /**
     * On each test, we create a new cache storage.
     */
    beforeEach(function () {
      cache = new Cache();
    });

    /**
     * Insertion test.
     */
    it('should be able to insert and retrieve new key/value pair', function () {
        cache.put('foo', 'bar');
        cache.put('foo', 'baz');
        cache.put('foo', { foo: 'bar' });
        cache.put('bar', 'baz');
        cache.put('bar', { bar: 'baz' });

        expect(cache.get('foo')).toEqual({ foo: 'bar' });
        expect(cache.get('bar')).toEqual({ bar: 'baz' });
    });

    /**
     * Object key insertion.
     */
    it('should be able to insert and retrieve key objects', function () {
        cache.put({ foo: 'bar' }, { foo: 'baz'});
        cache.put({ bar: 'baz' }, { bar: 'foo' });

        expect(cache.get({ foo: 'bar' })).toEqual({ foo: 'baz' });
        expect(cache.get({ bar: 'baz' })).toEqual({ bar: 'foo' });
    });

    /**
     * Cache entry removal.
     */
    it('should be able to remove cache entries by key', function () {
        cache.put('hello', 'world');
        cache.put({ key: 'hello' }, 'world');

        // Removing entries
        cache.remove('hello');
        cache.remove({ key: 'hello' });

        expect(cache.get('hello')).toBe(undefined);
        expect(cache.get({ key: 'hello' })).toBe(undefined);
    });

    /**
     * Iterables as keys.
     */
    it('should be able to insert iterables as keys', function () {
        var object = { foo: 'bar', bar: 'baz' };
        var array  = [1, 'a', 3, 4];

        // Inserting values.
        cache.put({ foo: 'bar', bar: 'baz' }, 'foo');
        cache.put([1, 'a', 3, 4], 'bar');
        cache.put('foo', 'bar');
        cache.put(1, 'bar');

        // Testing presence of iterable keys.
        expect(cache.get({ foo: 'bar', bar: 'baz' })).toEqual('foo');
        expect(cache.get(object)).toEqual('foo');
        expect(cache.get([1, 'a', 3, 4])).toEqual('bar');
        expect(cache.get([1, 'a', 4, 3])).not.toEqual('bar');
        expect(cache.get(array)).toEqual('bar');
        expect(cache.get('foo')).toEqual('bar');
        expect(cache.get(1)).toEqual('bar');
    });

    /**
     * Cache entry removal notification.
     */
    it('should be able to get notified when an entry has been removed', function () {
        cache.put('hello', 'world', {
          callback: function (k, v) {
            expect(k).toBe('hello');
            expect(v).toBe('world');
            expect(cache.get('hello')).toBe(undefined);
          }
        });
        cache.remove('hello');
    });

    /**
     * Cache clearance.
     */
    it('should be able to be cleared', function () {
        // Inserting 1000 elements.
        for (var i = 0; i < 1000; ++i) {
          cache.put('foo' + i, 'bar');
        }
        // Clearing the cache.
        cache.clear();
        // Testing the final size.
        expect(cache.size()).toBe(0);
    });
});

describe('Time-based cache', function () {
    var cache;

    /**
     * On each test, we create a new cache storage.
     */
    beforeEach(function () {
      cache = new Cache();
    });

    /**
     * The elements time-to-live.
     */
    var ttl = 1 * 1000;

    /**
     * Cache insertion using a TTL.
     */
    it('should be able to set a ttl on a cached object', function (done) {
        cache.put('foo', 'bar', { ttl: ttl });

        // Awaiting for the element to be evicted.
        setTimeout(function () {
            expect(cache.get('foo')).toBe(undefined);
            done();
        }, ttl + 1);
    });

    /**
     * Cache insertion using the default TTL.
     */
    it('should be able to use the default ttl on a cached object', function (done) {
        var originalTtl = cache.defaultTtl;

        // Updating the default ttl.
        cache.defaultTtl = ttl;

        // Inserting an element.
        cache.put('foobar', 'baz');

        // Awaiting for the element to be evicted.
        setTimeout(function () {
            expect(cache.get('foobar')).toBe(undefined);
            // Restoring the default cached elements ttl.
            cache.defaultTtl = originalTtl;
            done();
        }, cache.defaultTtl + 1);
    });

    /**
     * Callback upon element eviction.
     */
    it('should be able to call back a function upon element eviction', function (done) {
        // We use the second as a unit of measure for
        // the elasped time to avoid delays caused by the
        // Javascript event loop.
        var time = function () { return Math.floor(Date.now() / 1000); };
        var start = time();

        cache.put('foobar', 'baz', {
            ttl: ttl,
            callback: function () {
                expect(time()).toBe(start + (ttl / 1000));
                done();
            }
        });
    });
});

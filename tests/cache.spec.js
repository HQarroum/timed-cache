import Cache from '../cache.js';

/**
 * Configuration test plan.
 */
describe('Cache storage', () => {
    let cache = null;

    /**
     * On each test, we create a new cache storage.
     */
    beforeEach(() => (cache = new Cache()));

    /**
     * After each test, we clear the cache storage.
     */
    afterEach(() => (cache.clear()));

    /**
     * Insertion test.
     */
    it('should be able to insert and retrieve new key/value pair', () => {
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
    it('should be able to insert and retrieve key objects', () => {
      cache.put({ foo: 'bar' }, { foo: 'baz'});
      cache.put({ bar: 'baz' }, { bar: 'foo' });

      expect(cache.get({ foo: 'bar' })).toEqual({ foo: 'baz' });
      expect(cache.get({ bar: 'baz' })).toEqual({ bar: 'foo' });
    });

    /**
     * Cache entry removal.
     */
    it('should be able to remove cache entries by key', () => {
      cache.put('hello', 'world');
      cache.put({ key: 'hello' }, 'world');

      // Removing entries
      cache.remove('hello');
      cache.remove({ key: 'hello' });

      expect(cache.get('hello')).toBeUndefined();
      expect(cache.get({ key: 'hello' })).toBeUndefined();
    });

    /**
     * Iterables as keys.
     */
    it('should be able to insert iterables as keys', () => {
      const object = { foo: 'bar', bar: 'baz' };
      const array  = [1, 'a', 3, 4];

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
    it('should be able to get notified when an entry has been removed', () => {
      cache.put('hello', 'world', {
        callback: (k, v) => {
          expect(k).toBe('hello');
          expect(v).toBe('world');
          expect(cache.get('hello')).toBeUndefined();
        }
      });
      cache.remove('hello');
    });

    /**
     * Cache clearance.
     */
    it('should be able to be cleared', () => {
      // Inserting 1000 elements.
      for (let i = 0; i < 1000; ++i) {
        cache.put(`foo${i}`, 'bar');
      }
      // Clearing the cache.
      cache.clear();
      // Testing the final size.
      expect(cache.size()).toBe(0);
    });
});

describe('Time-based cache', () => {
  let cache = null;

  /**
   * On each test, we create a new cache storage.
   */
  beforeEach(() => (cache = new Cache()));

  /**
   * After each test, we clear the cache storage.
   */
  afterEach(() => (cache.clear()));

  /**
   * The elements time-to-live.
   */
  const ttl = 1 * 1000;

  /**
   * Cache insertion using a TTL.
   */
  it('should be able to set a ttl on a cached object', (done) => {
    cache.put('foo', 'bar', { ttl });

    // Awaiting for the element to be evicted.
    setTimeout(() => {
      expect(cache.get('foo')).toBeUndefined();
      done();
    }, ttl + 1);
  });

  /**
   * Cache insertion using the default TTL.
   */
  it('should be able to use the default ttl on a cached object', (done) => {
    const originalTtl = cache.defaultTtl;

    // Updating the default ttl.
    cache.defaultTtl = ttl;

    // Inserting an element.
    cache.put('foobar', 'baz');

    // Awaiting for the element to be evicted.
    setTimeout(() => {
      expect(cache.get('foobar')).toBeUndefined();
      // Restoring the default cached elements ttl.
      cache.defaultTtl = originalTtl;
      done();
    }, cache.defaultTtl + 1);
  });

  /**
   * Callback upon element eviction.
   */
  it('should be able to call back a function upon element eviction', (done) => {
    // We use the second as a unit of measure for
    // the elasped time to avoid delays caused by the
    // Javascript event loop.
    const time = () => Math.floor(Date.now() / 1000);
    const start = time();

    cache.put('foobar', 'baz', {
      ttl,
      callback: () => {
        expect(time()).toBe(start + (ttl / 1000));
        done();
      }
    });
  });
});

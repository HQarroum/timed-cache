define(['cache'], function (Cache) {

    var cache = new Cache();

    /**
     * Configuration test plan.
     */
    describe('Cache storage', function () {

        /**
         * Insert test.
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
         * Object key insertion.
         */
        it('should be able to be cleared', function () {
            cache.put('foo', 'bar');
            cache.clear();

            expect(cache.size()).toBe(0);
        });
    
    });

    describe('Time-based cache', function () {

        /**
         * The elements time-to-live.
         */
        var ttl = 2 * 1000;

        /**
         * Cache insertion using a TTL.
         */
        it('should be able to set a ttl on a cached object', function (done) {
            cache.put('foo', 'bar', { ttl: ttl });

            // Awaiting for the element to be erased.
            setTimeout(function () {
                expect(cache.get('foo')).toBeUndefined();
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

            // Awaiting for the element to be erased.
            setTimeout(function () {
                expect(cache.get('foobar')).toBeUndefined();
                // Restoring the default cached elements ttl.
                cache.defaultTtl = originalTtl;
                done();
            }, cache.defaultTtl + 1);
        });

        /**
         * Cache insertion using the default TTL.
         */
        it('should be able to call back a function upon element removal', function (done) {
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

});
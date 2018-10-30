/**
 * ///////////////////////////////////////
 * //////////// Cache module /////////////
 * ///////////////////////////////////////
 *
 * This module offers object caching mechanisms for
 * third-party modules. It allows to manage the lifecycle
 * of cached objects by associating them with a time-to-live.
 */

 /**
  * Exporting the `Cache` module appropriately given
  * the environment (AMD, Node.js and the browser).
  */
 (function (name, definition) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
      // Defining the module in an AMD fashion.
      define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
      // Exporting the module for Node.js/io.js.
      module.exports = definition();
    } else {
      var gl       = this;
      var instance = definition();
      var old      = gl[name];

      /**
       * Allowing to scope the module
       * avoiding global namespace pollution.
       */
      instance.noConflict = function () {
        gl[name] = old;
        return instance;
      };
      // Exporting the module in the global
      // namespace in a browser context.
      gl[name] = instance;
    }
 })('Cache', function () {

  /**
   * We use an object literal ads the
   * internal storage.
   */
  var cache = {};

  /**
   * Shortcut function for checking if an object has
   * a given property directly on itself
   * (in other words, not on a prototype).
   */
  var has = function (obj, key) {
    return (obj !== null && Object.prototype.hasOwnProperty.call(obj, key));
  };

  /**
   * Cache constructor.
   * @param {*} options the `options` object
   * holder used by the cache implementation. 
   */
  var Cache = function (options) {
    // The default cached objects expiration
    // delay is expressed in milliseconds and
    // is defined by an internal default value
    // or a user value if it is passed to the
    // constructor.
    this.defaultTtl = (options && options.defaultTtl) ?
        options.defaultTtl : 60 * 1000;
    // A prefix used to forbid access to internal properties
    // of the object storage.
    this.prefix = '__cache__';
  };

  /**
   * If the key is an object, we serialize it, so it
   * can be cached transparently.
   */
  var serialize = function (key) {
    if (typeof key !== 'string') {
      return (this.prefix + JSON.stringify(key));
    }
    return (this.prefix + key);
  };

  /**
   * Puts a key/value pair into the cache storage.
   */
  Cache.prototype.put = function (key, value, options) {
    var ttl = (options ? options.ttl : undefined) || this.defaultTtl;
    var callback = (options ? options.callback : undefined) || function () {};
    var key_ = serialize(key);
    var self = this;

    // Checking whether the given key already
    // has a value.
    var v = cache[key_];

    if (v) {
      // We clear the timeout associated with
      // the existing value.
      clearTimeout(v.handle);
    }

    // We then create a new timeout function for
    // the new value.
    var handle = setTimeout(function () {
      self.remove(key);
    }, ttl);

    // And we save the value into the cache storage
    // with the handle.
    cache[key_] = { handle: handle, data: value, callback: callback };
  };

  /**
   * Returns a cached value associated with the
   * given key if it exists, returns an undefined
   * value otherwise.
   */
  Cache.prototype.get = function (key) {
    var value = cache[serialize(key)];
    return (value && value.data);
  };

  /**
   * Clears the cache entry associated
   * with the given `key`.
   */
  Cache.prototype.remove = function (key) {
    var key_  = serialize(key);
    var value = cache[key_];

    if (value) {
      clearTimeout(value.handle);
      delete cache[key_];
      value.callback(key, value.data);
    }
  };

  /**
   * Clears the internal cache.
   */
  Cache.prototype.clear = function () {
    for (var entry in cache) {
      if (has(cache, entry)) {
        clearTimeout(cache[entry].handle);
      }
    }
    cache = {};
  };

  /**
   * Returns the size of the cache object in
   * terms of referenced elements.
   */
  Cache.prototype.size = function () {
    return Object.keys(cache).length;
  };

  return (Cache);
});

![Logo](https://cdn4.iconfinder.com/data/icons/database/PNG/256/Database_4.png)

## Cache storage [![Build Status](https://travis-ci.org/HQarroum/Cache.svg?branch=master)](https://travis-ci.org/HQarroum/Cache)

A minimalist time-based caching system.

This storage module evicts cached key/value pairs based on their time-to-live.

Current version: **1.0.1**

Lead Maintainer: [Halim Qarroum](mailto:hqm.post@gmail.com)

### Building

This project uses `Grunt` as its build system and `Bower` amd `NPM` as dependency management systems.

Grunt uses the `Gruntfile.js` file to actually build the project, and will as a *default* task copy the produced binaries in the `dist/` folder.

Grunt relies on `Node.js` to execute the tasks required to build the project, so you will need to ensure that it is available on your build machine.

To install Grunt, its modules, and fetch the Bower dependencies of the project you will need to run the following command :

```bash
# This will install Grunt tasks and fetch the
# required Bower module as a postinstall task.
npm install
```

To run a build using the default task, simply run the following :

```bash
grunt
```

### Deployment

If you want to version the produced binaries, you can use Grunt to deploy this project in two ways :

 - Pushing the built binaries to the `release` branch associated with the Git repository of this project
 - Push the binaries to the `release` branch, and additionally, tag the binaries with the project's `package.json` version
 
To deploy the project in a continuous integration system, or simply using your development machine, you can use one, or both of the following commands :

```bash
# This will build the project and push the binaries to
# the `release` branch.
grunt release

# This will do the same as the previous command, but will
# also tag the binaries on the remote Git origin.
grunt tag
```

## Usage

You will first have to require the `cache` module in your application in order to use it.

The `cache` module can be required in an AMD manner, using node's `require` or using the `Cache` variable exported in the global namespace in the context of a browser.

Basic operations you can perform on an instance of a `Cache` are insertion, retrieval and removal of key/value pairs.

To do so, you will need to create a new instance of the cache, by calling its constructor :

```javascript
var cache = new Cache();
```
Note that by default, a key/value pair will be held by the cache storage for `60` seconds before being evicted.

It is however possible to specify what default value you would like the TTL to have when creating the storage :

```javascript
// The TTL is always expressed in milliseconds.
// In this case it will be equal to `5` minutes.
var cache = new Cache({ defaultTtl: 300 * 1000 });
```

You will then be able to interact with the storage by retrieving and inserting data.

### Basic insertions

You insert a key/value pair into the storage by using the `.put` primitive and retrieve a value given its key identifier using the `.get` primitive.

Here is an example of inserting values associated with a string key :

```javascript
cache.put('bar', 'baz');
cache.put('foo', { foo: 'bar' });
cache.put('qux', 42);
```

It is then possible to retrieve the cached values using their associated keys :

```javascript
cache.get('bar'); // Returns 'baz'
cache.get('foo'); // Returns the object { foo: 'bar' }
```

It is also possible to use an object as a key as long as it is serializable using `JSON.stringify` :

```javascript
cache.put({ foo: 'bar' }, { bar: 'baz' });
cache.get({ foo: 'bar' }); // Returns the object { bar: 'baz' }
```

Note that inserting a value already associated with the inserted key will cause the previous value to be overwritten, and the TTL to be reset.

### Customizing elements TTL

You can customize the time-to-live value of a key/value pair at insertion time using the third optional argument to `.put` :

```javascript
// Example of an insertion using a TTL expressed in milliseconds.
cache.put('foo', 'bar', { ttl: 5 * 1000 });
```

It is also possible to define a callback for each inserted key/value pair to be informed when it is actually evicted from the storage :

```javascript
cache.put('baz', 'bar', {
  ttl: 5 * 1000,
  callback: function (key, value) {
    console.log(key, value, 'evicted !');
  }
});
```

## Tests

Tests are available in the `tests/` directory.

You can either trigger them using `Jasmine JS` and its HTML presenter by opening `tests/index.html` in a browser, or trigger the
following commands :

```bash
# Using grunt
grunt test

# Using NPM
npm test
```

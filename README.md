# NanoBuffer

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Travis CI Build][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Deps][david-image]][david-url]
[![Dev Deps][david-dev-image]][david-dev-url]

A lightweight, fixed-size value buffer.

Essentially it's an array that will only store up to N-number of values. Any
additional values added overwrite the oldest values. You can iterate over the
buffer to pull all of the values back out.

## Installation

	npm install nanobuffer

## Example

```javascript
import NanoBuffer from 'nanobuffer';

const buffer = new NanoBuffer(20);

for (let i = 0; i < 5; i++) {
	buffer.push(`Value ${i}`);
}

console.log(buffer.size); // 5

for (let i = 5; i < 100; i++) {
	buffer.push(`Value ${i}`);
}

console.log(buffer.size); // 20

for (const value of buffer) {
	console.log(value); // Value XX
}
```

## API

### Constructor

#### `new NanoBuffer(maxSize=10)`

Creates a new `NanoBuffer` instance with the specified max size. Default max
size is `10`.

### Properties

#### `maxSize` Number

Gets or sets a maximum number of values that can be stored in the buffer. If you
shrink the size, only the last N values will be preserved.

The value must be an integer and greater than or equal to zero. A value of zero
will not buffer anything.

```javascript
const buffer = new NanoBuffer;

console.log(buffer.maxSize); // 10

buffer.maxSize = 20;

console.log(buffer.maxSize); // 20
```

#### `size` Number

Gets the number of values in the buffer. This will never exceed the `maxSize`.

```javascript
const buffer = new NanoBuffer;

console.log(buffer.size); // 0

buffer.push('hi');
buffer.push('there');

console.log(buffer.size); // 2
```

### Methods

#### `push(value)`

Adds a value to the buffer. If the buffer is full, then the oldest value is
overwritten with this new value.

Values being stored can be any data type.

Returns the `NanoBuffer` instance.

```javascript
const buffer = new NanoBuffer;
buffer
	.push('hello')
	.push(123)
	.push({ foo: 'bar' });
```

#### `clear()`

Removes all values in the buffer.

Returns the `NanoBuffer` instance.

```javascript
const buffer = new NanoBuffer;

buffer.push('hi');
console.log(buffer.size); // 1

buffer.clear();
console.log(buffer.size); // 0
```

#### `[Symbol.iterator]()`

Returns an iterator that can be used in a for-of loop.

```javascript
const buffer = new NanoBuffer;

buffer.push('hi');
buffer.push('there');

for (const value of buffer) {
	console.log(value);
}

const it = buffer[Symbol.iterator]();
let r = it.next();
while (!r.done) {
	console.log(r.value);
	r = it.next();
}
```

## License

(The MIT License)

Copyright (c) 2017 Chris Barber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/nanobuffer.svg
[npm-url]: https://npmjs.org/package/nanobuffer
[downloads-image]: https://img.shields.io/npm/dm/nanobuffer.svg
[downloads-url]: https://npmjs.org/package/nanobuffer
[travis-image]: https://img.shields.io/travis/cb1kenobi/nanobuffer.svg
[travis-url]: https://travis-ci.org/cb1kenobi/nanobuffer
[coveralls-image]: https://img.shields.io/coveralls/cb1kenobi/nanobuffer/master.svg
[coveralls-url]: https://coveralls.io/r/cb1kenobi/nanobuffer
[codeclimate-image]: https://img.shields.io/codeclimate/github/cb1kenobi/nanobuffer.svg
[codeclimate-url]: https://codeclimate.com/github/cb1kenobi/nanobuffer
[david-image]: https://img.shields.io/david/cb1kenobi/nanobuffer.svg
[david-url]: https://david-dm.org/cb1kenobi/nanobuffer
[david-dev-image]: https://img.shields.io/david/dev/cb1kenobi/nanobuffer.svg
[david-dev-url]: https://david-dm.org/cb1kenobi/nanobuffer#info=devDependencies

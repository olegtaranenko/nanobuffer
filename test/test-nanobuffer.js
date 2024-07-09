import { expect } from 'chai';
import NanoBuffer from '../src/index.js';

describe('NanoBuffer', () => {
	it('should throw error if invalid max size', () => {
		expect(() => {
			new NanoBuffer('hi');
		}).to.throw(TypeError, 'Expected maxSize to be a number');
	});

	it('should throw error if max size is not a number', () => {
		expect(() => {
			new NanoBuffer(NaN);
		}).to.throw(RangeError, 'Expected maxSize to be zero or greater');
	});

	it('should throw error if max size is negative', () => {
		expect(() => {
			new NanoBuffer(-123);
		}).to.throw(RangeError, 'Expected maxSize to be zero or greater');
	});

	it('should throw error if invalid top() argument', () => {
		expect(() => {
			const b = new NanoBuffer();
			b.top('hi');
		}).to.throw(TypeError, 'Expected index to be a number');
	});

	it('should throw error if invalid bottom() argument', () => {
		expect(() => {
			const b = new NanoBuffer();
			b.bottom('hi');
		}).to.throw(TypeError, 'Expected index to be a number');
	});

	it('should throw error if top() argument is not a number', () => {
		expect(() => {
			const b = new NanoBuffer();
			b.top(NaN);
		}).to.throw(RangeError, 'Expected index to be zero or greater');
	});

	it('should throw error if bottom() argument is not a number', () => {
		expect(() => {
			const b = new NanoBuffer();
			b.bottom(NaN);
		}).to.throw(RangeError, 'Expected index to be zero or greater');
	});

	it('should NOT throw error if top() argument is negative', () => {
		expect(() => {
			const b = new NanoBuffer();
			b.top(-123);
		}).to.not.throw(RangeError, 'Expected index to be zero or greater');
	});

	it('should NOT throw error if bottom() argument is negative', () => {
		expect(() => {
			const b = new NanoBuffer();
			b.bottom(-123);
		}).to.not.throw(RangeError, 'Expected index to be zero or greater');
	});

	it('should get undefined if top() argument is negative', () => {
		const b = new NanoBuffer;
		expect(b.top(-1)).to.be.undefined;
	});

	it('should get undefined if bottom() argument is negative', () => {
		const b = new NanoBuffer;
		expect(b.bottom(-1)).to.be.undefined;
	});

	it('should get the max size', () => {
		expect(new NanoBuffer(20).maxSize).to.equal(20);
	});

	it('should get the default max size', () => {
		expect(NanoBuffer.defaultMaxSize()).to.equal(10);
	});

	it('should throw error if given two wrong arguments', () => {
		expect(() => {
			new NanoBuffer(20, 10);
		}).to.throw(TypeError, 'Second argument should not be given, if the first argument is a number');
	});

	it('should be default initialized', () => {
		const b = new NanoBuffer();
		expect(b.maxSize).to.equal(10);
		expect(b.size).to.equal(0);
		expect(b.head).to.equal(0);
	});

	it('should be initialized as an empty array with a predefined max size', () => {
		const b = new NanoBuffer(20);
		expect(b.maxSize).to.equal(20);
		expect(b.size).to.equal(0);
		expect(b.head).to.equal(0);
	});

	it('should be initialized with a predefined array', () => {
		const p = [ 'foo0', 'foo1', 'foo2', 'foo3', 'foo4', 'foo5' ];
		const b = new NanoBuffer(p);
		expect(b.maxSize).to.equal(6);
		expect(b.size).to.equal(6);
		expect(b.head).to.equal(5);
	});

	it('should be initialized without predefined array but with given size', () => {
		const b = new NanoBuffer(undefined, 20);
		expect(b.maxSize).to.equal(20);
		expect(b.size).to.equal(0);
		expect(b.head).to.equal(0);
	});

	it('should be initialized with a predefined array and a max size', () => {
		const p = [ 'foo0', 'foo1', 'foo2', 'foo3', 'foo4', 'foo5' ];
		const b = new NanoBuffer(p, 4);
		expect(b.maxSize).to.equal(4);
		expect(b.size).to.equal(4);
		expect(b.head).to.equal(3);
	});

	it('should get the default max size', () => {
		expect(NanoBuffer.defaultMaxSize()).to.equal(10);
	});

	it('should add an object', () => {
		const b = new NanoBuffer;
		expect(b.head).to.equal(0);
		expect(b.size).to.equal(0);
		b.push('foo');
		expect(b.size).to.equal(1);
		expect(b.head).to.equal(0);
		b.push('bar');
		expect(b.size).to.equal(2);
		expect(b.head).to.equal(1);
	});

	it('should remove the object by push undefined', () => {
		const b = new NanoBuffer;
		b._buffer[0] = 'foo';
		b.push(undefined);
		const test = b._buffer[0];
		expect(test).to.be.undefined;
	});

	it('should remove the object by pop', () => {
		const b = new NanoBuffer;
		b.push('foo');
		const value = b.pop();
		expect(value).to.equal('foo');
		const test = b._buffer[0];
		expect(test).to.be.undefined;
	});

	it('should pop an object', () => {
		const b = new NanoBuffer();
		b.push('foo');
		b.push('bar');
		expect(b.size).to.equal(2);
		const bar = b.pop();
		expect(b.size).to.equal(1);
		expect(bar).to.equal('bar');
		let foo = b.pop();
		expect(b.size).to.equal(0);
		expect(foo).to.equal('foo');
	});

	it('should fill the buffer and wrap', () => {
		const b = new NanoBuffer(10);

		expect(b.size).to.equal(0);

		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		expect(b.size).to.equal(10);
		expect(b.head).to.equal(2);

		for (let i = 0; i < 7; i++) {
			b.push(`bar${i}`);
		}

		expect(b.size).to.equal(10);
		expect(b.head).to.equal(9);
	});

	it('should pop the object from filled buffer and back wrap', () => {
		const b = new NanoBuffer(10);

		expect(b.size).to.equal(0);

		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		expect(b.size).to.equal(10);
		expect(b.head).to.equal(2);

		let foo;
		for (let i = 0; i < 7; i++) {
			foo = b.pop(`bar${i}`);
		}
		expect(foo).to.equal('foo6');
		expect(b.size).to.equal(3);
		expect(b.head).to.equal(5);
	});

	it('should exhaust the buffer', () => {
		const b = new NanoBuffer(10);

		expect(b.size).to.equal(0);

		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		expect(b.size).to.equal(10);
		expect(b.head).to.equal(2);

		let foo;
		for (let i = 0; i < 11; i++) {
			foo = b.pop(`bar${i}`);
		}
		expect(foo).to.be.undefined;
		expect(b.size).to.equal(0);
		expect(b.head).to.equal(2);
	});

	it('should not buffer anything if max size is zero', () => {
		const b = new NanoBuffer(0);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}
		expect(b.maxSize).to.equal(0);
		expect(b.size).to.equal(0);
		expect(b.head).to.equal(0);
	});

	it('should clear the buffer', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		expect(b.size).to.equal(5);
		expect(b.head).to.equal(4);

		b.clear();

		expect(b.size).to.equal(0);
		expect(b.head).to.equal(0);

		for (let i = 0; i < 13; i++) {
			b.push(`bar${i}`);
		}

		expect(b.size).to.equal(10);
		expect(b.head).to.equal(2);

		b.clear();

		expect(b.size).to.equal(0);
		expect(b.head).to.equal(0);
	});

	it('should throw error if invalid new max size', () => {
		expect(() => {
			new NanoBuffer().maxSize = 'hi';
		}).to.throw(TypeError, 'Expected new max size to be a number');
	});

	it('should throw error if new max size is not a number', () => {
		expect(() => {
			new NanoBuffer().maxSize = NaN;
		}).to.throw(RangeError, 'Expected new max size to be zero or greater');
	});

	it('should throw error if new max size is negative', () => {
		expect(() => {
			new NanoBuffer().maxSize = -123;
		}).to.throw(RangeError, 'Expected new max size to be zero or greater');
	});

	it('should do nothing if max size is not changed', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 10; i++) {
			b.push(`foo${i}`);
		}

		expect(b.maxSize).to.equal(10);
		expect(b.size).to.equal(10);

		b.maxSize = 10;

		expect(b.maxSize).to.equal(10);
		expect(b.size).to.equal(10);
	});

	it('should return proper full flag', () => {
		const a = new NanoBuffer(0);
		expect(a.full).to.equal(true);

		const b = new NanoBuffer(10);
		expect(b.full).to.equal(false);

		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}
		expect(b.full).to.equal(false);

		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}
		expect(b.full).to.equal(true);

		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}
		expect(b.full).to.equal(true);

	});

	it('should increase the buffer max size', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i < 15; i++) {
			b.push(`foo${i}`);
		}
		expect(b.maxSize).to.equal(10);
		expect(b.size).to.equal(10);

		b.maxSize = 20;
		expect(b.maxSize).to.equal(20);
		expect(b.size).to.equal(10);

		for (let i = 15; i < 30; i++) {
			b.push(`foo${i}`);
		}

		expect(b.maxSize).to.equal(20);
		expect(b.size).to.equal(20);
	});

	it('should shrink the buffer max size', () => {
		const b = new NanoBuffer(18);

		for (let i = 0; i < 25; i++) {
			b.push(`foo${i}`);
		}

		expect(b.maxSize).to.equal(18);
		expect(b.size).to.equal(18);

		b.maxSize = 6;

		expect(b.maxSize).to.equal(6);
		expect(b.size).to.equal(6);

		let i = 25 - 6;
		for (const it of b) {
			expect(it).to.equal(`foo${i++}`);
		}
	});

	it('should iterate over buffer few objects', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		let i = 0;
		for (const it of b) {
			expect(it).to.equal(`foo${i++}`);
		}
	});

	it('should initialize the predefined buffer, which is smaller than max size', () => {}, () => {
		const p = [ 'foo0', 'foo1', 'foo2', 'foo3', 'foo4' ];

		const b = new NanoBuffer(10, p);

		let i = 0;
		for (const it of b) {
			expect(it).to.equal(`foo${i++}`);
		}
	});

	it('should initialize the predefined buffer, which length equals to max size', () => {
		const p = [ 'foo0', 'foo1', 'foo2', 'foo3', 'foo4', 'foo5', 'foo6', 'foo7', 'foo8', 'foo9' ];
		const b = new NanoBuffer(p, 10);

		let i = 0;
		for (const it of b) {
			expect(it).to.equal(`foo${i++}`);
		}
	});

	it('should initialize the predefined buffer, which is larger than max size', () => {
		const p = [ 'foo0', 'foo1', 'foo2', 'foo3', 'foo4', 'foo5', 'foo6', 'foo7', 'foo8', 'foo9', 'foo10', 'foo11', 'foo12' ];

		const b = new NanoBuffer(p, 10);

		let i = 3;
		for (const it of b) {
			expect(it).to.equal(`foo${i++}`);
		}
	});

	it('should iterate over buffer many objects', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i <= 17; i++) {
			b.push(`foo${i}`);
		}

		let i = 8;
		for (const it of b) {
			expect(it).to.equal(`foo${i++}`);
		}
	});

	it('should get undefined top of empty buffer', () => {
		const b = new NanoBuffer();
		const top = b.top();
		expect(top).to.be.undefined;
	});

	it('should get undefined bottom of empty buffer', () => {
		const b = new NanoBuffer();
		const bottom = b.bottom();
		expect(bottom).to.be.undefined;
	});

	it('should top() get undefined by empty buffer and specified index', () => {
		const b = new NanoBuffer();
		const top = b.top(1);
		expect(top).to.be.undefined;
	});

	it('should bottom() get undefined by empty buffer and specified index', () => {
		const b = new NanoBuffer();
		const bottom = b.bottom(1);
		expect(bottom).to.be.undefined;
	});

	it('should top() get undefined by non-wrapped buffer and specified index, equal to buffer size', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(b.size);
		expect(top).to.be.undefined;
	});

	it('should bottom() get undefined by non-wrapped buffer and specified index, equal to buffer size', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(b.size);
		expect(bottom).to.be.undefined;
	});

	it('should top() get undefined by non-wrapped buffer and specified index, greater than buffer size', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(b.size + 1);
		expect(top).to.be.undefined;
	});

	it('should bottom() get undefined by non-wrapped buffer and specified index, greater than buffer size', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(b.size + 1);
		expect(bottom).to.be.undefined;
	});

	it('should top() get undefined by non-wrapped buffer and specified index, greater than double buffer size', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(b.size * 2 + 1);
		expect(top).to.be.undefined;
	});

	it('should top() get undefined by wrapped buffer and specified index, equal to buffer size', () => {
		const b = new NanoBuffer(3);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(b.size);
		expect(top).to.be.undefined;
	});

	it('should bottom() get undefined by wrapped buffer and specified index, equal to buffer size', () => {
		const b = new NanoBuffer(3);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(b.size);
		expect(bottom).to.be.undefined;
	});

	it('should top() get undefined by wrapped buffer and specified index, greater than buffer size', () => {
		const b = new NanoBuffer(3);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(b.size + 1);
		expect(top).to.be.undefined;
	});

	it('should bottom() get undefined by wrapped buffer and specified index, greater than buffer size', () => {
		const b = new NanoBuffer(3);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(b.size + 1);
		expect(bottom).to.be.undefined;
	});

	it('should top() get undefined by wrapped buffer and specified index, greater than double buffer size', () => {
		const b = new NanoBuffer(3);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(b.size * 2 + 1);
		expect(top).to.be.undefined;
	});

	it('should bottom() get undefined by wrapped buffer and specified index, greater than double buffer size', () => {
		const b = new NanoBuffer(3);
		for (let i = 0; i < 5; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(b.size * 2 + 1);
		expect(bottom).to.be.undefined;
	});

	it('should get array\'s first element (the stack top), simple', () => {
		const b = new NanoBuffer();

		b.push('hi');
		b.push('world');

		const top = b.top();
		expect(top).to.equal('world');
	});

	it('should get array\'s first element (the stack bottom), simple', () => {
		const b = new NanoBuffer();

		b.push('hi');
		b.push('world');

		const bottom = b.bottom();
		expect(bottom).to.equal('hi');
	});

	it('should get array\'s last element (top stack) for wrapped buffer', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top();
		expect(top).to.equal('foo12');
	});

	it('should get array\'s first element (the stack bottom for wrapped buffer', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom();
		expect(bottom).to.equal('foo3');
	});

	it('should get n-th last element (n-th below the top) for wrapped buffer', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		const top = b.top(5);
		expect(top).to.equal('foo7');
	});

	it('should get array\' n-th element (n-th from the bottom)', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(5);
		expect(bottom).to.equal('foo8');
	});

	it('should get array\' n-th element (n-th from the bottom) non-wrapped index pointer', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(9);
		expect(bottom).to.equal('foo12');
	});

	it('should get corrected cyclic dependencies for non-wrapped buffer', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 7; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom();
		const top = b.top();
		const cycleIndex = b.size - 1;
		expect(bottom).to.equal(b.top(cycleIndex));
		expect(top).to.equal(b.bottom(cycleIndex));
	});

	it('should bottom() get object for wrapped buffer and wrapped index', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 18; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom(5);
		expect(bottom).to.equal('foo13');
	});

	it('should get corrected cyclic dependencies for wrapped buffer', () => {
		const b = new NanoBuffer(10);
		for (let i = 0; i < 13; i++) {
			b.push(`foo${i}`);
		}

		const bottom = b.bottom();
		const top = b.top();
		const cycleIndex = b.size - 1;
		expect(bottom).to.equal(b.top(cycleIndex));
		expect(top).to.equal(b.bottom(cycleIndex));
	});

	it('should get corrected quick brown fox', () => {
		const b = new NanoBuffer(6);
		const fox = 'The quick brown fox jumps over the lazy dog';
		fox.split(' ').forEach((word) => {
			b.push(word);
		});

		expect(b.bottom()).to.equal('fox');
		expect(b.bottom(1)).to.equal('jumps');
		expect(b.top()).to.equal('dog');
	});

	it('should handle of poke method', () => {
		const fox = 'The quick brown fox jumps over the lazy dog';
		const b = new NanoBuffer(10);
		fox.split(' ').forEach((word) => {
			b.push(word);
		});

		b.poke('cat', 8);
		expect(b.top()).to.equal('cat');

		b.poke(undefined);
		expect(b.bottom()).to.be.undefined;
	});

	it('should handle of poke method of wrapped buffer', () => {
		const fox = 'The quick brown fox jumps over the lazy dog';
		const b = new NanoBuffer(5);
		fox.split(' ').forEach((word) => {
			b.push(word);
		});

		b.poke('cat', 8);
		expect(b.bottom()).to.equal('jumps');
		expect(b.top()).to.equal('dog');

		b.poke(undefined, 0);
		expect(b.bottom()).to.be.undefined;
	});

	it('should be manually iterable', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i <= 17; i++) {
			b.push(`foo${i}`);
		}

		const it = b[Symbol.iterator]();
		let i = 8;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i++}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

	it('should exists iterator method', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i <= 17; i++) {
			b.push(`foo${i}`);
		}

		const it = b.iterator();
		let i = 8;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i++}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

	it('should iterate over buffer with offset', () => {
		const b = new NanoBuffer(10);

		let bufferSize = 13;
		for (let i = 0; i <= bufferSize; i++) {
			b.push(`foo${i}`);
		}

		const startFrom = 4;
		const it = b.iterator(false, startFrom);
		let r = it.next();
		let i = bufferSize - startFrom - 1;
		let counter = 0;
		while (!r.done) {
			expect(r.value).to.equal(`foo${i++}`);
			r = it.next();
			counter++;
		}
		expect(counter).equals(b.size - startFrom);
		expect(r.value).to.be.undefined;
	});

	it('should not iterate over buffer with offset, exceeds buffer size', () => {
		const b = new NanoBuffer(10);

		let bufferSize = 5;
		for (let i = 0; i <= bufferSize; i++) {
			b.push(`foo${i}`);
		}

		const it = b.iterator(false, bufferSize + 1);
		let r = it.next();
		expect(r.value).be.undefined;
	});

	it('should iterate over buffer with negative offset', () => {
		const b = new NanoBuffer(10);

		let bufferSize = 13;
		for (let i = 0; i <= bufferSize; i++) {
			b.push(`foo${i}`);
		}

		const startFrom = -6;
		const it = b.iterator(false, startFrom);
		let r = it.next();
		let i = bufferSize + startFrom + 1;
		let counter = 0;
		while (!r.done) {
			expect(r.value).to.equal(`foo${i++}`);
			r = it.next();
			counter++;
		}
		expect(counter).equals(-startFrom);
		expect(r.value).to.be.undefined;
	});

	it('should empty buffer not return anything by manually iterating', () => {
		const b = new NanoBuffer(10);

		const it = b[Symbol.iterator]();
		let i = 0;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i++}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

	it('should be back iterable', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i <= 17; i++) {
			b.push(`foo${i}`);
		}

		const it = b[Symbol.iterator](true);
		let i = b.head + b.size;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i--}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

	it('should partially filled buffer be back iterable', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i <= 5; i++) {
			b.push(`foo${i}`);
		}

		const it = b[Symbol.iterator](true);
		let i = b.head;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i--}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

	it('should iterator method be reversed', () => {
		const b = new NanoBuffer(10);

		for (let i = 0; i <= 5; i++) {
			b.push(`foo${i}`);
		}

		const it = b.iterator(true);
		let i = b.head;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i--}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

	it('should iterator method be reversed with offset', () => {
		const b = new NanoBuffer(10);

		let bufferSize = 15;
		for (let i = 0; i <= bufferSize; i++) {
			b.push(`foo${i}`);
		}

		const startFrom = 3;
		const it = b.iterator(true, startFrom);
		let r = it.next();
		let i = bufferSize - startFrom;
		let counter = 0;
		while (!r.done) {
			expect(r.value).to.equal(`foo${i--}`);
			r = it.next();
			counter++;
		}
		expect(counter).equals(b.size - startFrom);
		expect(r.value).to.be.undefined;
	});

	it('should not iterate reversed over buffer with offset, exceeds buffer size', () => {
		const b = new NanoBuffer(10);

		let bufferSize = 5;
		for (let i = 0; i <= bufferSize; i++) {
			b.push(`foo${i}`);
		}

		const it = b.iterator(true, bufferSize + 1);
		let r = it.next();
		expect(r.value).be.undefined;
	});

	it('should empty buffer not return anything by back iterating', () => {
		const b = new NanoBuffer(10);

		const it = b[Symbol.iterator](true);
		let i = 0;
		let r = it.next();

		while (!r.done) {
			expect(r.value).to.equal(`foo${i++}`);
			r = it.next();
		}

		expect(r.value).to.be.undefined;
	});

});

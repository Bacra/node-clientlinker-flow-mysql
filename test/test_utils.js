'use strict';

var expect	= require('expect.js');
var utils	= require('../')._test;


describe('#utils', function()
{
	it('#translateValues', function()
	{
		expect(utils.translateValues({id: 1, val: 2}, ['id', 'val']))
			.to.eql([1, 2]);
		expect(utils.translateValues({id: 1, list: {v: 2}}, ['id', 'list'], {list: ['v']}))
			.to.eql([ 1, [2] ]);
		expect(utils.translateValues({id: 1, list: [{v: 2}]}, ['id', 'list'], {list: ['v']}))
			.to.eql([1, [ [2] ]]);
	});
});

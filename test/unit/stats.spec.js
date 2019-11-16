/**
 * @file        stats.spec.js
 * @author      Jacob Kearns
 * @description A file for unit testing the stats page.
 */

let stats = require('../../js/stats');

let chai = require('chai');
let expect = chai.expect;
let assert = require('assert');

describe('Unit Test, function postOps.addTwo()', function() {
    it('7 + 7 = 14', function() {
        expect( stats.addTwo( 7, 7 )).to.equal( 14 );
        console.log( 'adding result:', stats.addTwo( 7, 7 ) );
    });
});

var InItsRightPlace = require('../lib');
var Lab = require('lab');
var Path = require('path');
var Chai = require('chai');
Chai.should();

// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

describe('in-its-right-place', function () {

    it('should move files already in the src folder to the dst folder', function (done) {
    	var rightPlace = new InItsRightPlace("files/case1/source", "files/case1/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve("files/case1/source/new.girl-star234.mp3"));
        	what.dst.should.eql(Path.resolve("files/case1/destination/New Girl/new.girl-star234.mp3"));
        });
    });
});
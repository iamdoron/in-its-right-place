var InItsRightPlace = require('../lib');
var Lab = require('lab');
var Path = require('path');
var Fs = require('fs');
var Chai = require('chai');
Chai.should();

// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

describe('in-its-right-place', function () {
	before(function(done){
		Fs.writeFileSync("test/files/case1/source/new.girl-star234.mp3", "new girl");
		if (Fs.existsSync("test/files/case1/destination/New Girl/new.girl-star234.mp3")) {
			Fs.unlinkSync("test/files/case1/destination/New Girl/new.girl-star234.mp3");
		}
		Fs.writeFileSync("test/files/case2/source/elementary.0230.stop-star234.mp4", "elementary");
		if (Fs.existsSync("test/files/case2/destination/elemntary/elementary.0230.stop-star234.mp4")) {
			Fs.unlinkSync("test/files/case2/destination/elemntary/elementary.0230.stop-star234.mp4");
		}
		done();
	});

    it('should new.girl file already in the src folder to the correct dst folder', function (done) {
    	var rightPlace = new InItsRightPlace("test/files/case1/source", "test/files/case1/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve(Path.resolve("test/files/case1/source/new.girl-star234.mp3")));
        	what.dst.should.eql(Path.resolve(Path.resolve("test/files/case1/destination/New Girl/new.girl-star234.mp3")));
        	done();
        });
    });

    it('should elementary file already in the src folder to the correct dst folder', function (done) {
    	var rightPlace = new InItsRightPlace("test/files/case2/source", "test/files/case2/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve(Path.resolve("test/files/case2/source/elementary.0230.stop-star234.mp4")));
        	what.dst.should.eql(Path.resolve(Path.resolve("test/files/case2/destination/elementary/elementary.0230.stop-star234.mp4")));
        	done();
        });
    });
});
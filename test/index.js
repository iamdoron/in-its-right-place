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
		buildCase1();
		buildCase2();
		done();
	});

    it('should put new.girl in the correct dst folder (when file was already there)', function (done) {
    	var rightPlace = new InItsRightPlace("test/files/case1/source", "test/files/case1/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve(Path.resolve("test/files/case1/source/new.girl-star234.mp3")));
        	what.dst.should.eql(Path.resolve(Path.resolve("test/files/case1/destination/New Girl/new.girl-star234.mp3")));
        	Fs.readFileSync("test/files/case1/destination/New Girl/new.girl-star234.mp3").toString().should.eql("new girl");
        	done();
        });
    });

    it('should put elementary in the correct dst folder (when file was already there)', function (done) {
    	var rightPlace = new InItsRightPlace("test/files/case2/source", "test/files/case2/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve(Path.resolve("test/files/case2/source/elementary.0230.stop-star234.mp4")));
        	what.dst.should.eql(Path.resolve(Path.resolve("test/files/case2/destination/elementary/elementary.0230.stop-star234.mp4")));
        	Fs.readFileSync("test/files/case2/destination/elementary/elementary.0230.stop-star234.mp4").toString().should.eql("elementary");
        	done();
        });
    });

    function buildCase1(){
		Fs.writeFileSync("test/files/case1/source/new.girl-star234.mp3", "new girl");
		if (Fs.existsSync("test/files/case1/destination/New Girl/new.girl-star234.mp3")) {
			Fs.unlinkSync("test/files/case1/destination/New Girl/new.girl-star234.mp3");
		}
	}
	function buildCase2(){
		Fs.writeFileSync("test/files/case2/source/elementary.0230.stop-star234.mp4", "elementary");
		if (Fs.existsSync("test/files/case2/destination/elemntary/elementary.0230.stop-star234.mp4")) {
			Fs.unlinkSync("test/files/case2/destination/elemntary/elementary.0230.stop-star234.mp4");
		}
	}
});
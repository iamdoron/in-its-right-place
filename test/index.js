var InItsRightPlace = require('../lib');
var Lab = require('lab');
var Path = require('path');
var Fs = require('fs');
var Rimraf = require('rimraf');
var Proxyquire = require('proxyquire');
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
        cleanFiles();
		buildCase1();
        buildCase2();
		buildCase3();
		done();
	});

    it('should put new.girl in the correct dst folder (when file was already there)', function (done) {
    	var rightPlace = new InItsRightPlace("test/files/case1/source", "test/files/case1/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve(Path.resolve("test/files/case1/source/new.girl-star234.mp3")));
        	what.dst.should.eql(Path.resolve(Path.resolve("test/files/case1/destination/New Girl/new.girl-star234.mp3")));
        	Fs.readFileSync("test/files/case1/destination/New Girl/new.girl-star234.mp3").toString().should.eql("new girl");
            Fs.existsSync("test/files/case1/source/new.girl-star234.mp3").should.be.false;
        	done();
        });
    });

    it('should put elementary in the correct dst folder (when file was already there)', function (done) {
    	var rightPlace = new InItsRightPlace("test/files/case2/source", "test/files/case2/destination");
        rightPlace.on('rightPlace', function(what){
        	what.src.should.eql(Path.resolve(Path.resolve("test/files/case2/source/elementary.0230.stop-star234.mp4")));
        	what.dst.should.eql(Path.resolve(Path.resolve("test/files/case2/destination/elementary/elementary.0230.stop-star234.mp4")));
        	Fs.readFileSync("test/files/case2/destination/elementary/elementary.0230.stop-star234.mp4").toString().should.eql("elementary");
            Fs.existsSync("test/files/case1/source/elementary.0230.stop-star234.mp4").should.be.false;
        	done();
        });
    });

    it('should put elementary & and new girl in the correct dst folder (when file apears after the listener started)', function (done) {
        var rightPlace = new InItsRightPlace("test/files/case3/source", "test/files/case3/destination");
        setTimeout(function(){
            Fs.writeFileSync("test/files/case3/source/elementary.0230.stop-star234.mp4", "elementary");

        }, 100);
        rightPlace.once('rightPlace', function(what){
            what.src.should.eql(Path.resolve(Path.resolve("test/files/case3/source/elementary.0230.stop-star234.mp4")));
            what.dst.should.eql(Path.resolve(Path.resolve("test/files/case3/destination/elementary/elementary.0230.stop-star234.mp4")));
            Fs.readFileSync("test/files/case3/destination/elementary/elementary.0230.stop-star234.mp4").toString().should.eql("elementary");
            rightPlace.once('rightPlace', function(what){
                what.src.should.eql(Path.resolve(Path.resolve("test/files/case3/source/new.girl-star234.mp3")));
                what.dst.should.eql(Path.resolve(Path.resolve("test/files/case3/destination/New Girl/new.girl-star234.mp3")));
                Fs.readFileSync("test/files/case3/destination/New Girl/new.girl-star234.mp3").toString().should.eql("new girl");
                done();
            });

            setTimeout(function(){
                Fs.writeFileSync("test/files/case3/source/new.girl-star234.mp3", "new girl");
            }, 100);
        });
    });

    it('should put elementary to the correct dst folder after there was no destination folder the time of the arival', function (done) {
        Fs.mkdirSync("test/files/case4");
        Fs.mkdirSync("test/files/case4/source");
        Fs.mkdirSync("test/files/case4/destination");

        var rightPlace = new InItsRightPlace("test/files/case4/source", "test/files/case4/destination");
        setTimeout(function(){
            Fs.writeFileSync("test/files/case4/source/elementary.0230.stop-star234.mp4", "elementary");
            setTimeout(function(){
                Fs.mkdirSync("test/files/case4/destination/elementary");
            }, 100);
        }, 100);
        rightPlace.once('rightPlace', function(what){
            what.src.should.eql(Path.resolve(Path.resolve("test/files/case4/source/elementary.0230.stop-star234.mp4")));
            what.dst.should.eql(Path.resolve(Path.resolve("test/files/case4/destination/elementary/elementary.0230.stop-star234.mp4")));
            Fs.readFileSync("test/files/case4/destination/elementary/elementary.0230.stop-star234.mp4").toString().should.eql("elementary");
            done()
        });
    });

    it('should emit only once, even if there were two events of the same file name', function (done) {
        Fs.mkdirSync("test/files/case5");
        Fs.mkdirSync("test/files/case5/source");
        Fs.mkdirSync("test/files/case5/destination");
        Fs.mkdirSync("test/files/case5/destination/elementary");

        var fsStub = {exists: Fs.exists, readdir: Fs.readdir, watch: function(src, onFile){
            if (src === "test/files/case5/source"){
                setTimeout(function(){
                    onFile("rename", "elementary.0230.stop-star234.mp4", "1");            
                    onFile("rename", "elementary.0230.stop-star234.mp4", "2");          
                }, 200);  
            }
        }};
        var InItsRightPlace = Proxyquire('../lib', {fs: fsStub});

        var rightPlace = new InItsRightPlace("test/files/case5/source", "test/files/case5/destination");
        setTimeout(function(){
            Fs.writeFileSync("test/files/case5/source/elementary.0230.stop-star234.mp4", "elementary");
        }, 150);
        rightPlace.on('rightPlace', function(what){
            what.src.should.eql(Path.resolve(Path.resolve("test/files/case5/source/elementary.0230.stop-star234.mp4")));
            what.dst.should.eql(Path.resolve(Path.resolve("test/files/case5/destination/elementary/elementary.0230.stop-star234.mp4")));
            Fs.readFileSync("test/files/case5/destination/elementary/elementary.0230.stop-star234.mp4").toString().should.eql("elementary");
            done()
        });
    });
    
    it('should emit only once, even if there were two events of the same file name, and in both events time, the file was indeed there', function (done) {
        Fs.mkdirSync("test/files/case6");
        Fs.mkdirSync("test/files/case6/source");
        Fs.mkdirSync("test/files/case6/destination");
        Fs.mkdirSync("test/files/case6/destination/elementary");
        var onWatchSrcFunction;
        var renameCounter = 0;
        var fsStub = {
            stat: function(path, callback){callback(undefined, {isDirectory: function(){return true;}})},
            exists: function(path,callback){callback(true)}, 
            readdir: function(path, callback){
                if (path === "test/files/case6/source") {
                    callback(undefined, []);
                }
                else{
                    callback(undefined, ["elementary"]);
                }
            }, 
            rename: function(from, to, callback){
                ++renameCounter;
                if (renameCounter == 1)
                {
                    Fs.rename(from, to, callback);
                }
                else {
                    callback(new Error());
                }

            }, 
            watch: function(src, onFile){
                if (src === "test/files/case6/source"){
                    onWatchSrcFunction = onFile;
                    setTimeout(function(){
                        onFile("rename", "elementary.0230.stop-star234.mp4", "1");         
                    }, 100);  
                }
        }};
        
        var InItsRightPlace = Proxyquire('../lib', {fs: fsStub});

        var rightPlace = new InItsRightPlace("test/files/case6/source", "test/files/case6/destination");
        setTimeout(function(){
            Fs.writeFileSync("test/files/case6/source/elementary.0230.stop-star234.mp4", "elementary");
        }, 50);
        var numberOfTimesRightPlacedWasEmitted = 0;
        rightPlace.on('rightPlace', function(what){
            ++numberOfTimesRightPlacedWasEmitted;
            numberOfTimesRightPlacedWasEmitted.should.eql(1);
            onWatchSrcFunction("rename", "elementary.0230.stop-star234.mp4", "2");          

            what.src.should.eql(Path.resolve(Path.resolve("test/files/case6/source/elementary.0230.stop-star234.mp4")));
            what.dst.should.eql(Path.resolve(Path.resolve("test/files/case6/destination/elementary/elementary.0230.stop-star234.mp4")));
            Fs.readFileSync("test/files/case6/destination/elementary/elementary.0230.stop-star234.mp4").toString().should.eql("elementary");
            done()
        });
    });

    after(function(done){
        cleanFiles();
        done();
    });
    function cleanFiles(){
        Rimraf.sync('test/files/case4');
        Rimraf.sync('test/files/case5');
        Rimraf.sync('test/files/case6');
    }
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

    function buildCase3(){
        if (Fs.existsSync("test/files/case3/destination/elemntary/elementary.0230.stop-star234.mp4")) {
            Fs.unlinkSync("test/files/case3/destination/elemntary/elementary.0230.stop-star234.mp4");
        }
        if (Fs.existsSync("test/files/case3/destination/New Girl/new.girl-star234.mp3")) {
            Fs.unlinkSync("test/files/case3/destination/New Girl/new.girl-star234.mp3");
        }
        if (Fs.existsSync("test/files/case3/source/new.girl-star234.mp3")) {
            Fs.unlinkSync("test/files/case3/source/new.girl-star234.mp3");
        }
        if (Fs.existsSync("test/files/case3/source/elementary.0230.stop-star234.mp4")) {
            Fs.unlinkSync("test/files/case3/source/elementary.0230.stop-star234.mp4");
        }
    }
});
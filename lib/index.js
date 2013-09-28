var Util = require('util');
var Events = require('events');
var Path = require('path');
var Fs = require('fs');
var Wizard = require("./wizard.js");
var Async = require('async');

(function(){
	module.exports = InItsRightPlace;

	function InItsRightPlace(src, dst){
		var srcWatcher = watchSource(src, moveToRightPlace);
		rightPlaceFilesAlreadyThere(src, moveToRightPlace);

		var dstWatcher = watchDestination(dst, function(){
			rightPlaceFilesAlreadyThere(src, moveToRightPlace);
		});

		var me = this;
		var workInProgress = Object.create(null);

		function watchDestination(dst, onChange){
			return Fs.watch(dst, onChange);
		}
		function watchSource(src, onNewFile){
			Fs.watch(src, function(event, filename){
				if( (event === "change" || event === "rename" && !workInProgress[filename])){
					var filePath = Path.join(src,filename);
					workInProgress[filename] = true;
					Fs.exists(filePath, function(fileIsThere){
						if (fileIsThere){
							onNewFile(Path.resolve(Path.join(src,filename)));
						}
					});
				}
			});
		}

		function rightPlaceFilesAlreadyThere(src, onNewFile){
			Fs.readdir(src, function(err, files){
				files.forEach(function(file) {
					workInProgress[file] = true;
					onNewFile(Path.resolve(Path.join(src, file)));
				});
			});
		}

		function moveToRightPlace(filePath){
			var fileName = Path.basename(filePath);
			if (fileName.indexOf(".") === 0) {
				return;
			}
			listDirectories(dst, function(err, directories){
				var destination = Wizard.findBestMatch(fileName, directories);
				if (destination){
				 	destination = Path.resolve(Path.join(dst, destination, fileName));
					Fs.rename(filePath, destination, function(){
						delete workInProgress[fileName];
						me.emit('rightPlace', {src: filePath, dst: destination});
					});	
				}
				else {
					delete workInProgress[fileName];
				}
			});
		}
		function listDirectories(dir, callback){
			Fs.readdir(dst, function(err, files){ 
				Async.filter(files, function(file, callback){
					Fs.stat(Path.join(dir,file), function(err, stat){
						callback(stat.isDirectory());
					});

				}, function(directories){
					callback(undefined, directories);
				});
			});
		}
	} 
	Util.inherits(InItsRightPlace, Events.EventEmitter);

})()
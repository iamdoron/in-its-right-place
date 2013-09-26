var Chokidar = require('chokidar');
var Util = require('util');
var Events = require('events');
var Path = require('path');
var Fs = require('fs');
var Wizard = require("./wizard.js");

(function(){
	module.exports = InItsRightPlace;

	function InItsRightPlace(src, dst){
		var watcher = watchForFiles(src, moveToRightPlace);

		var me = this;
		function watchForFiles(src, onFile){
			var fsWatcher = Chokidar.watch(Path.resolve(src), {persistent: true});
			fsWatcher.on('add', onFile);
		}

		function moveToRightPlace(filePath){
			var fileName = Path.basename(filePath);
			if (fileName.indexOf(".") === 0) {
				return;
			}
			Fs.readdir(dst, function(err, directories){
				var destination = Wizard.findBestMatch(fileName, directories);
				if (destination){
				 	destination = Path.resolve(Path.join(dst, destination, fileName));
					Fs.rename(filePath, destination, function(){
						me.emit('rightPlace', {src: filePath, dst: destination});
					});	
				}
				
			});
			
		}
	} 
	Util.inherits(InItsRightPlace, Events.EventEmitter);

})()
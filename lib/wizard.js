(function(){
	module.exports.findBestMatch = function(fileName, directories){
		var upperCasedDirs = upper(directories);
		var words = fileName.split(/[\._-]/);
		for (var wordIndex = words.length - 1; words.length > 0; words.pop()) {
			var candidate = words.join(" ").toUpperCase();
			var dirIndex = upperCasedDirs.indexOf(candidate);
			if ( dirIndex !== -1 ){
				return directories[dirIndex];
			}
		};
	}
	function upper(arr){
		return arr.map(function(value){
			return value.toUpperCase();
		});
	}
})()
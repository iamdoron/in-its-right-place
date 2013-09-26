(function(){
	module.exports.findBestMatch = function(fileName, directories){
		var upperCasedDirs = upper(directories);
		var result;

		someCandidate(fileName, function(candidate) {
			var dirIndex = upperCasedDirs.indexOf(candidate);
			if ( dirIndex !== -1 ){
				return result = directories[dirIndex];
			}
		});

		return result;
	}
	function someCandidate(fileName, each){
		var words = fileName.split(/[\._-]/);
		for (var wordIndex = words.length - 1; words.length > 0; words.pop()) {
			var candidate = words.join(" ").toUpperCase();
			if (each(candidate)){
				return;
			}
		};
	}
	function upper(arr){
		return arr.map(function(value){
			return value.toUpperCase();
		});
	}
})()
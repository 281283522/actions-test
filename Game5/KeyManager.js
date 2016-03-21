function KeyManager() {
	var keys = this.keys = {}
	$(document).keydown(function(e){
		keys[e.keyCode] = true;
	}).keyup(function(e){
		delete(keys[e.keyCode]);
	});
}

KeyManager.prototype = {
	isKeyDown : function( keyCode ) {
		return keyCode in this.keys;
	},
	anyKeyDown : function() {
		for( var i=0; i<arguments.length; i++ ) {
			if( this.isKeyDown(arguments[i]) ) {
				return true;
			}
		}
	}
	,
	isUp : function() {
		return this.anyKeyDown(87,38);
	}
	,
	isDown : function() {
		return this.anyKeyDown(83,40);
	}
	,
	isLeft : function() {
		return this.anyKeyDown(37,65);
	}
	,
	isRight : function() {
		return this.anyKeyDown(39,68);
	}
	,
	isFire : function() {
		return this.anyKeyDown(74,32);
	}
}

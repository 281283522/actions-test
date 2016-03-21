function Stage( parent ) {
	parent = parent || document.body;
	
	this.timer = false;
	this.speed = 30;
	this.renders = [];
	this.updates = [];
	
	var canvas = this.canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	parent.appendChild(canvas);
	
	this.c2d = canvas.getContext("2d");
}

Stage.prototype = {
	start : function(){
		if( this.timer ) {
			throw new Error('已经开始过了!');
		}
		var me = this;
		
		this.timer = setInterval(function(){
			me.render();
		},this.speed);
		
	},
	stop : function() {
		clearInterval(this.timer);
		this.timer = false;
	}
	,
	render : function() {
		this.renders.sort(function(o1,o2){
			return o1.zIndex-o2.zIndex;
		});
		for( var i=0,r; r=this.updates[i++]; ) {
			r.update();
		}
		for( var i=0,r; r=this.renders[i++]; ) {
			r.render(this.c2d);
		}
	}
	,
	addObject : function( o ){
		if( Stage.isFunction(o.update) ) {
			this.updates.push(o);
		}
		if( Stage.isFunction(o.render) ) {
			o.zIndex = o.zIndex || 0;
			this.renders.push(o);
		}
	},
	removeObject : function( o ) {
		var index = this.updates.indexOf(o);
		if( index!=-1 ) {
			this.updates.splice(index,1);
		}
		index = this.renders.indexOf(o);
		if( index!=-1 ) {
			this.renders.splice(index,1);
		}
	}
};

Stage.isFunction = function( o ) {
	return ( typeof(o)=='function' ) || o instanceof Function;
}

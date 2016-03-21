function Bang(stage,x,y) {
	this.x = x || 350;
	this.y = y || 450;
	this.stage = stage;
}

(function(){
	var img = new Image();
	img.src = "img/bang.png";

	Bang.prototype = {
		speed : 5,
		xState : 0,
		state : 0,
		render : function(c2d) {
			c2d.drawImage(img,this.xState*120,0,120,90,this.x,this.y,120,90);
			if (this.state++ % 2 == 0) {
				this.xState++;
				if (this.xStage >= 21) {
					this.stage.removeObject(this);
				}
			}
		}
	}
})();

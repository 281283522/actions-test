function Foe(x,y) {
	this.x = x || 350;
	this.y = y || 450;
}

(function(){
	var img = new Image();
	img.src = "img/Foe.png";

	Foe.prototype = {
		speed : 5,
		render : function(c2d) {
			c2d.drawImage(img,this.x,this.y);
		},
		update : function() {
			this.y += this.speed;
		}
	}
})();

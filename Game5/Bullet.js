function Bullet(x,y) {
	this.x = x || 350;
	this.y = y || 450;
}

(function(){
	var img = new Image();
	img.src = "img/Bullet.png";

	Bullet.prototype = {
		speed : 10,
		render : function(c2d) {
			c2d.drawImage(img,this.x,this.y);
		},
		update : function() {
			this.y -= this.speed;
		}
	}
})();

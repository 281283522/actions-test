function Hero(km,x,y) {
	this.x = x || 350;
	this.y = y || 450;
	this.km = km;
}

(function(){
	var img = new Image();
	img.src = "img/Hero.png";

	Hero.prototype = {
		zIndex : 100,
		speed : 5,
		render : function(c2d) {
			c2d.drawImage(img,this.x,this.y);
		},
		update : function() {
			if( this.km.isUp() ) {
				this.y -= this.speed;
			} else if( this.km.isDown() ) {
				this.y += this.speed;
			}
			if( this.km.isLeft() ) {
				this.x -= this.speed;
			} else if( this.km.isRight() ) {
				this.x += this.speed;
			}
		}
	}
})();

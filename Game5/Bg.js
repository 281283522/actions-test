function Bg() {
	this.y = 0;
}

(function(){
	var img = new Image();
	img.src = "img/bg.jpg";

	Bg.prototype = {
		zIndex : -3000,
		render : function(c2d) {
			c2d.drawImage(img,0,this.y-img.height);
			c2d.drawImage(img,0,this.y);
			this.y++;
			if( this.y==img.height ) {
				this.y=0;
			}
		}
	}
})();

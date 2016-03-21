$(function(){
	var stage = new Stage();
	var keyMgr = new KeyManager();
	var hero = new Hero(keyMgr);
	var bg = new Bg();
	
	var bullets = [];
	var foes = [];
	
	stage.addObject(hero);
	stage.addObject(bg);
	
	stage.addObject({
		zIndex : 3000,
		render : function(c2d) {
			c2d.save();
			c2d.fillStyle = "red";
			c2d.fillText("stage:"+stage.renders.length+",bullets:"+bullets.length,50,50);
			c2d.restore();
		}
	});
	
	stage.addObject({
		zIndex : 0,
		bulletSpeed : 10,
		bulletState : 0,
		update : function() {
			if( keyMgr.isFire() && this.bulletState++%this.bulletSpeed==0 ) {
				var bullet = new Bullet(hero.x+45,hero.y);
				bullets.push(bullet);
				stage.addObject(bullet);
			}
			if( foes.length<1 || parseInt(Math.random()*100)==0 ) {
				var x = Math.random()*700;
				var y = -100 - Math.random()*300;
				var foe = new Foe(x,y);
				foes.push(foe);
				stage.addObject(foe);
			}
		}
	});
	
	stage.addObject({
		zIndex : -999,
		update : function() {
			for( var i=0,b; b=bullets[i]; i++ ) {
				if( b.y<-100 ) {
					stage.removeObject(b);
					bullets.splice(i,1);
				}
			}
			for( var i=0,f; f=foes[i]; i++ ) {
				if( f.y>600 ) {
					stage.removeObject(f);
					foes.splice(i,1);
				}
			}
			for (var i = 0, b; b = bullets[i]; i++) {
				for (var j = 0, f; f = foes[j]; j++) {
					if(b.y+20>f.y && b.x+10>f.x &&f.y+100>b.y && f.x+100>b.x) {
						stage.removeObject(b);
						stage.removeObject(f);
						bullets.splice(i,1);
						foes.splice(j,1);
						stage.addObject(new Bang(stage,f.x,f.y));
						break;
					}
				}
			}
		}
	});
	
	stage.start();
	
});

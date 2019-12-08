//this'll generate monsters randomly once its updated to be a bit like the dragon_generate function
// I threw together based off funfunfunction's generators tutorial...
// there's so much to clean up or fix, nice to be able to work out of order and do fun things
// but there'll be a refactoring reckoning eventually LOL... 
// const generateMonster = function(x,y){
// 	this._x = x;
// 	this_y = y;

// 	this._hp = 
// 	this._hitDice = 
// 	this._symbol = 
// 	return { _x, _y, _hp, _hitDice, _symbol, _sound, _draw }
// }

var Monster = function(x, y) {
	this._x = x;
	this._y = y;
	this._draw();
	this._hp = 20;
	this._hitDice = 6;
	switch(globalvars.level){
	case 1:
	this._symbol = "P";
	this._hitDice = 12;
	break;
	case 2:
	this._symbol = "!";
	this._hitDice = 20;
	this._hp = 25;
	break;
	case 3:
	this._symbol="~";
	this._hitDice = 100;
	this._hp = 30;
	break;
	case 4:
	this._symbol="(";
	this._hitDice = 120;
	this._hp = 45;
	break;
	case 5:
	this._symbol=")";
	this._hitDice = 150;
	this._hp = 100;
	break;
	default:
	this._symbol="%";
	this._hitDice = 200;
	this._hp = 200;
	break;
	}
	this._sound = new Audio("sfx/punch.wav");
}

Monster.prototype.getSpeed = function() { return 100; }
Monster.prototype.getHit=function(amt){
	this._hp = this._hp - amt;
	if (this._hp <= 0) 
	{
		globalvars.print("You have slain the monster! You get 10 points!");
		Game.player._score = Game.player._score + 10;
		this._die();
	}
}

Monster.prototype._die=function(){
	thisColor = cheapLighting(this._x,this._y);
	if (thisColor == "black"){
		Game.display.draw(this._x,this._y, "$");
	}else {
		Game.display.draw(this._x, this._y, ".");
	}
	x = this._x;
	y = this._y;
	this._symbol = "#";
	Game.scheduler.remove(this);
	var deathKnell = new Audio("sfx/monster.wav");
	if (globalvars.BACKGROUNDSOUNDS) deathKnell.play();
	globalvars.print("The monster you were fighting has died!!");
	Game.this = null;
}

Monster.prototype.makeHit= function(){
return Math.floor(ROT.RNG.getUniform()*this._hitDice)+1;
}

Monster.prototype.act = function() {
	var x = Game.player.getX();
	var y = Game.player.getY();
	var passableCallback = function(x, y) {
		return (x+","+y in Game.map);
	}
	var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
	var path = [];
	var pathCallback = function(x, y) {
		path.push([x, y]);
	}
	astar.compute(this._x, this._y, pathCallback);
	path.shift();
	if (path.length <= 2) {
		globalvars.print("The monster attacks!");
		if (globalvars.BACKGROUNDSOUNDS)this._sound.play();
		hitAmt = Game.monster.makeHit();
		globalvars.print("The monster does "+hitAmt+" damage!");
		Game.player.getHit();
		amt = Game.player.makeHit();
		globalvars.print("You counter! You strike the monster for "+amt+" damage!");
		if (globalvars.BACKGROUNDSOUNDS) Game.player.getSound().play();
		this.getHit(amt);
	} else {
		x = path[0][0];
		y = path[0][1];
		/*fix the square just behind the monster so it is empty again:
		*/
		thisColor = cheapLighting(this._x,this._y);
		if (thisColor == "black"){
			Game.display.draw(this._x,this._y, "$");
		}else {
			Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
		}
		this._x = x;
		this._y = y;
		this._draw();
	}
}

Monster.prototype._draw = function() {
	thisColor = cheapLightingWithParam(this._x,this._y,"P");
	if (thisColor == "black")
	{
		Game.display.draw(this._x, this._y, "$");
	}else{
		Game.display.draw(this._x, this._y, this._symbol);
	}
}    

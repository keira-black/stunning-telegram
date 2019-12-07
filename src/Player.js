var Player = function(x, y) {
	this._x = x;
	this._y = y;
	this._draw();
	this._hp = 150;
	this._hitDice = 6;
	this._score = 0;
	this._symbol = '@';
	this._sound = new Audio("sfx/punch.wav");
	this._achievements="none";
	this._swords = 0;
}

Player.prototype.getSpeed = function() { return 100; }
Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }
Player.prototype.getSound = function(){return this._sound;}
Player.prototype.getSwords = function(){return this._swords;}
Player.prototype.getHP = function() {return this._hp;}
Player.prototype.act = function() {
	Game.engine.lock();
	Game._drawWholeMap();
	if (Game.monster){
		Game.monster._draw();
	}
	if (Game.monster2){
		Game.monster2._draw();
	}
	if (Game.monster3){
		Game.monster3._draw();
	}	
	Game.player._draw();
	$("#HP").text("H.P.: "+Game.player.getHP());
	$("#SCORE").text("Score: "+Game.player.getScore());
	window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;
	if (code == 13 || code == 32) {
		this._checkGrass();
		return;
	}

	var keyMap = {};
	keyMap[38] = 0;
	keyMap[33] = 1;
	keyMap[39] = 2;
	keyMap[34] = 3;
	keyMap[40] = 4;
	keyMap[35] = 5;
	keyMap[37] = 6;
	keyMap[36] = 7;
	keyMap[100] = 6;
	keyMap[102] = 2;
	keyMap[104] = 0;
	keyMap[98] = 4;
	keyMap[105] =1;	
	keyMap[103] = 7;
	keyMap[97] = 5;
	keyMap[99] = 3;
	if (!(code in keyMap)) { return; }
	switch(keyMap[code]){
	case 0:
		Game.player._symbol = "^";
		break;
	case 1:
		Game.player._symbol = "^";
		break;
	case 2:
		Game.player._symbol = ">";
		break;
	case 3:
		Game.player._symbol = "@";
		break;
	case 4:
		Game.player._symbol = "@";
		break;
	case 5:
		Game.player._symbol = "@";
		break;
	case 6:
		Game.player._symbol = "<";
		break;
	case 7:
		Game.player._symbol ="^";
		break;	
	}
	var dir = ROT.DIRS[8][keyMap[code]];
	var newX = this._x + dir[0];
	var newY = this._y + dir[1];
	var newKey = newX + "," + newY;
	if (!(newKey in Game.map)) { return; }
	thisColor = cheapLighting(this._x,this._y);
	if (thisColor == "black") {
		Game.display.draw(this._x,this._y, "$");
	} else
	{
		Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
	}
	this._x = newX;
	this._y = newY;
	this._draw();
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Player.prototype.makeHit=function(){
	return Math.floor(ROT.RNG.getUniform()*this._hitDice)+1;
}

Player.prototype._draw = function() {
	Game.display.draw(this._x, this._y, this._symbol);
}
Player.prototype.getHit=function(amount){
	this._hp = this._hp - 5;
	if (this._hp <= 0) fail();
}

Player.prototype.getScore = function(){
	return this._score;
}
Player.prototype.getAchievements = function(){
	return this._achievements;
}
Player.prototype.addAchievement = function(achieved){
	if (this._achievements == "none"){
		this._achievements = achieved;
	}
	else {
		this._achievements = this._achievements+"+"+achieved;
	}
	toastr.success("Achievement: "+achieved);
}

Player.prototype._checkGrass = function() {
	var key = this._x + "," + this._y;
	if (Game.map[key] == ".") {
		globalvars.print("There is nothing here!");
	}
	else if (Game.map[key]=="O" || Game.map[key]=="_" ){
		win();
	} else if (key == Game.portalSwitch) {
		globalvars.print("Hooray! You found the switch! Opening gate to next level...");
		Game.portalOpened = true;
		this.addAchievement("Portal opened.");
		if (globalvars.level < 6){
		Game.map[Game.portalLocation] = "O";
		}
		else {
		Game.map[Game.portalLocation] = "_";
		}
		Game.map[key] = ".";
	} else {
	if (Math.floor(ROT.RNG.getUniform()*10) == 1){
	switch(Math.floor(ROT.RNG.getUniform()*3)){
	case 1:
		switch (Game.player.getSwords()){
		case 1:
		globalvars.print("You found a rusty fork! HD + 2");
		this.addAchievement("Found rusty fork. It was okay.");
		this._hitDice += 2;
		this._score+=2;
		this._sound = "sfx/sword.wav";
		break;
		case 2:
		globalvars.print("You found a can lid taped to a butterknife! HD + 2");
		this.addAchievement("Found a crazy can knife");
		this._hitDice += 2;
		this._score+=2;
		break;
		case 3:
		globalvars.print("You found a butcher knife! HD + 3");
		this.addAchievement("Found a butcher knife.");
		this._hitDice += 3;
		this._score+=2;
		break;
		case 4:
		globalvars.print("You found a hobo knife! Extra nastiness damage! HD + 3");
		this.addAchievement("Found a hobo knife.");
		this._hitDice += 3;
		this._score+=2;
		break;
		case 5:
		globalvars.print("You found a rusty sword! HD + 3");
		this.addAchievement("Found a rusty sword.");
		this._hitDice += 3;
		this._score+=2;
		break;
		case 6:
		globalvars.print("You found a non-rusty sword! HD + 3");
		this.addAchievement("Found a normal sword.");
		this._hitDice += 3;
		this._score+=2;
		break;
		case 7:
		globalvars.print("You found a great sword! HD + 3");
		this.addAchievement("Hey, this sword is great!");
		this._hitDice += 3;
		this._score+=2;
		break;
		default:
		globalvars.print("You found a slightly more impressive weapon of some kind.");
		this.addAchievement("Oh wow, another weapon. Good job.");
		this._hitDice += 3;
		this._score+=2;
		break;
		}
	break;
	case 2:
		globalvars.print("You found a health potion!");
		this.addAchievement("Found a health potion!");
		this._hp += 20;
		this._score+=2;
		break;
	case 3:
	globalvars.print("You found a score potion!");
	this.addAchievement("Found a score potion!");
		this._score += 50;
		this._score+=2;
		break;
	}
	}
else{	
	globalvars.print("This grass is empty.");
	}
		Game.map[key] = ".";
	}
}
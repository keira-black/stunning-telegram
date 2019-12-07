var GLOBAL = function(){
this.MUSICPLAYING = false;
this.BACKGROUNDSOUNDS = false;
this.level = 1;
this.playerBackup = null;
this.target = null;
this.attachPrint = function(el){
	this.target = el;
}
this.print = function(textToPrint){
		
		this.target.innerHTML += ("<div class='infoLine'>"+textToPrint+"</div>");
	    this.target.scrollTop = this.target.scrollHeight;
	}
}
var globalvars = new GLOBAL();
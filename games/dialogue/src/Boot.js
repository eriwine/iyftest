var Game = {}
Game.Params = {
	baseWidth: 1080,
	baseHeight: 1080
};

Game.Boot = function (game) { };

Game.Boot.prototype =  {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    preload: function () {
    },
    create: function () {
        console.log("boot complete");
        this.state.start("Loading");
    }	
};

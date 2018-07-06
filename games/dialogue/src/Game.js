var game;
window.onload = function () {
	game = new Phaser.Game(Game.Params.baseWidth, Game.Params.baseHeight, Phaser.AUTO, 'canvasholder');	
	game.state.add("Boot", Game.Boot);
	game.state.add("Loading", Game.Preloader);
	game.state.add("Main", Game.MainState);
	game.state.start("Boot");
}


lerp = function(a,b,t){
    return Phaser.Math.linearInterpolation([a,b],t);
}
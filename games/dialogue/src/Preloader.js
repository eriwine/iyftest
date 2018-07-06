Game.Preloader = function (game) {
};

Game.Preloader.prototype = {
    init: function () {
    },
    preload: function () {
        game.plugins.add(PhaserNineSlice.Plugin);
        game.load.image('boy',"img/Character_YoungBoy_sad.png");
        game.load.spritesheet('grandpa',"img/Character_Grandfather_happy.png",750,1000);
        game.load.image('bg',"img/Background_Office.png");
        game.load.image('arrow',"img/Arrow.png");
        game.load.image('man',"img/Character_AdultMan_happy.png");
        game.load.nineSlice('speechBubble',"img/Popup.png",78,78,78,78);
        game.load.nineSlice('speechBubbleDark',"img/SpeechBubble_Dark.png",48,48,48,48);
        game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js');
        game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js');
    },
    create: function () {
        let style = { font: "56px Arial", fill: "#dddddd", align: "center" };
        let text = game.add.text(game.world.width * 0.5, game.world.height * 0.5,"Loading web fonts...", style);
        text.anchor.set(0.5);

        //this.initGame();
        game.time.events.add(Phaser.Timer.SECOND, this.initGame, this);
    },
    initGame: function(){
        this.state.start("Main");
    }
};

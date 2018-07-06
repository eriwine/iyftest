
Game.MainState = function (game) {
    
};

Game.MainState.prototype = {
    create: function () 
    {    
        let text = [ "How's it going? I'm your mentor and my job is publishing magazines.",
        "Team listening is really important, and it's what makes all our jobs possible.",
        "Behind me you can see Coworker A and Coworker B. They're working on a project.",
        "Critique how these two coworkers are listening to eachother!"
        ];      

        let nextPrompt = "Press Next to continue";
        let personTexture = 'man';

        game.stage.backgroundColor = "#000000";
        
        //Create play space
        this.playSpace = game.add.group();
        this.playSpace.x = game.width * 0.02;
        this.playSpace.y = game.height * 0.02;

        let playSpaceWidth = game.width - this.playSpace.x * 2;
        let playSpaceHeight = playSpaceWidth;

        //Graphics rect to use as mask
        let g = game.add.graphics(0,0);
        this.playSpace.addChild(g);       
        g.beginFill(0xddecff);
        g.drawRect(g.x,g.y,playSpaceWidth,playSpaceWidth);
        g.endFill();

        //Background
        this.bg = game.add.image(0,0,'bg');
        this.bg.width = playSpaceWidth;
        this.bg.height = playSpaceHeight;
        this.playSpace.addChild(this.bg);

        //Add blur effect to background
        let blurX = game.add.filter('BlurX');
        let blurY = game.add.filter('BlurY');
        blurX.blur = 0;
        blurY.blur = 0;
        this.bg.filters = [blurX, blurY];
        this.game.add.tween(this.bg.filters[0]).to({blur: 6},400,Phaser.Easing.Linear.None,true,50);
        this.game.add.tween(this.bg.filters[1]).to({blur: 6},400,Phaser.Easing.Linear.None,true,50);

        //Character
        this.personA =  new Character(game,playSpaceWidth * 0.4,playSpaceHeight * 1.2, personTexture);
        this.personA.anchor.setTo(0.5,1);
        this.playSpace.addChild(this.personA);
        this.personA.mask = g;
        this.personA.enter();

        this.speechBubble = new SpeechBubble(game,playSpaceWidth * 0.05, playSpaceHeight * 0.75, playSpaceWidth * 0.9, playSpaceHeight * 0.2, 'speechBubbleDark', '48px OpenSans', "");
        this.playSpace.addChild(this.speechBubble);
        
        this.dialogue = new Dialogue(game,this.speechBubble.text,this.speechBubble.arrow,this.personA, text);

        //What to do when dialogue is over
        this.dialogue.dialogueEnd.add(
            function(e){
                //close speechbubble
                this.speechBubble.close();              
                this.speechBubble.onClose.add(function(){

                    //Continue prompt
                    var style = { font: '128px OpenSans', fill: "#ffffff", align: "center", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.game.width * 0.8};
                    let text = game.add.text(0,0, nextPrompt, style);
                    text.setShadow(5,5,'rgba(0,0,0,0.5)',0);
                    text.addColor("#33aaff",5);
                    text.addColor("#ffffff",10)
                    this.playSpace.addChild(text);
                    text.setTextBounds(0,playSpaceHeight * 0.65,playSpaceWidth,playSpaceHeight * 0.3);
                    this.game.add.tween(text).from({alpha: 0 }, 400, Phaser.Easing.Quadratic.Out,true,300);
                    this.game.add.tween(text).from({x: text.x - 50 }, 800, Phaser.Easing.Quadratic.Out,true,300);

                }, this);
            },
            this
        );

        //Start speech bubble invisible
        this.speechBubble.backBox.scale.setTo(0);
        game.time.events.add(Phaser.Timer.SECOND*1,function(){
            //Open dialogue, start typeout
            this.speechBubble.open();
            this.dialogue.init();
        }
        ,this);
    }
};
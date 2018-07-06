function TypeOut(game, textBox, text, charMS)
{
    this.game = game;
    this.textBox = textBox;
    this.text = text;
    this.index =  0;
    this.timer = null;
    this.charMS = charMS;
    this.isTyping = false;
    this.textColor = "#ffffff";
    this.typeoutStarted = new Phaser.Signal();
    this.typeoutFinished = new Phaser.Signal();
}

TypeOut.prototype.init = function(){
    this.index = 0;
    this.timer = this.game.time.events.loop(this.charMS,this.addChar,this);
    this.textBox.text = this.text;
    this.textBox.addColor("#00000000",this.index);
    this.textBox.autoSizeFont(this.textBox.textBounds.width,this.textBox.textBounds.height);
    this.isTyping = true;
    this.typeoutStarted.dispatch();
}
TypeOut.prototype.addChar = function(){
    this.index++;
    this.textBox.colors = [];
    this.textBox.addColor(this.textColor,0)
    this.textBox.addColor("#8888aa",this.index-1); //current character
    this.textBox.addColor("#00000000",this.index)
    if (this.index >= this.text.length)
    {
        this.finish();
    }       
},
TypeOut.prototype.finish = function(){
    this.textBox.colors = [];
    this.textBox.addColor(this.textColor,0);
    this.game.time.events.remove(this.timer);
    this.isTyping = false;
    this.typeoutFinished.dispatch();
}

function Dialogue(game, textBox, arrow, person, dialogue)
{
    this.game = game;
    this.dialogue = dialogue;
    this.textBox = textBox;
    this.dIndex = 0;
    this.dialogueEnd = new Phaser.Signal();
    this.active = false;
    this.arrow = arrow;
    this.arrowIdleTween = null; 
    this.person = person;  
}
Dialogue.prototype.init = function(){
    this.active = true;
    this.typeout = new TypeOut(this.game,this.textBox,this.dialogue[0],Phaser.Timer.SECOND * 0.03);
    this.typeout.init();     
    this.game.input.onDown.add(this.advanceText,this);
    this.typeout.typeoutStarted.add(function(){this.toggleArrow(false);},this);
    this.typeout.typeoutFinished.add(function(){this.toggleArrow(true);},this);
    this.arrow.scale.setTo(0);
}
Dialogue.prototype.advanceText = function(){
    if (this.active && this.typeout!==undefined && this.typeout!==null)
    {
        if (this.typeout.isTyping)
        {
            this.typeout.finish();
        }
        else
        {
            this.dIndex++;
            if (this.dIndex < this.dialogue.length)
            {
                var t = this.dialogue[this.dIndex];
                       
                this.typeout.text = this.parseLine(t);
                this.typeout.init();
            }
            else
            {
                this.active = false;
                this.toggleArrow(false);
                this.dialogueEnd.dispatch();
            }
        }
    }
}
Dialogue.prototype.toggleArrow = function(visible)
{
    if (this.arrowIdleTween!=null)
    {
        this.arrowIdleTween.stop();
    }
    if (visible)
    {
        this.arrow.scale.setTo(0,1.25);
        let scaleTween = this.game.add.tween(this.arrow.scale).to({
            x: 1, y: 1.25
        }, 500, Phaser.Easing.Quadratic.Out, true, 15);
        scaleTween.onComplete.add(function(){
            let idleTween = this.game.add.tween(this.arrow.scale).to({
                x: 0, y: 1.25
            }, 500, Phaser.Easing.Quadratic.InOut, true, 15,-1);
            idleTween.yoyo(true,0);
            this.arrowIdleTween = idleTween;
        },this);
    }
    else
    {
        this.arrow.scale.setTo(0);
    }
}
Dialogue.prototype.parseLine = function(t)
{
    // var split = t.split('{{');
    var myRe = /<<[^>>]+>>/g;
    var array;// = myRe.exec(t);
    while((array = myRe.exec(t))!=null)
    {
        let command = array[0].replace(/[^\w\s\|]/gi, '')
        let splitCommand = command.split('|');
        this.parseCommand(splitCommand);
    }

    var strippedText = t.replace(myRe, '');       
    return strippedText;
}

Dialogue.prototype.parseCommand = function(splitCommand)
{
    if (splitCommand.length == 2)
    {
        switch(splitCommand[0])
        {
            case "setFrame":
                this.person.frame = parseInt(splitCommand[1]);
                break;
            case "anim":
                switch(splitCommand[1])
                {
                    case "shake":
                        this.person.shake();
                        break;
                }
        }
    }
}

function Character(game,x,y,texName)
{
    Phaser.Sprite.call(this,game,x,y,texName);
    this.game = game;
    this.posTween = null;
    this.anchorY = y;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;
 
Character.prototype.enter = function()
{
    this.alpha = 0;
    let alphaTween = this.game.add.tween(this).to({
        alpha: 1
    }, 800, Phaser.Easing.Quadratic.Out, true, 15);
    let posTween = this.game.add.tween(this).from({
        x: this.x - 100
    }, 800, Phaser.Easing.Quadratic.Out, true, 15);
    posTween.onComplete.add(this.startIdle, this);
}
Character.prototype.exit = function()
{
    this.stopIdle();
    let alphaTween = this.game.add.tween(this).to({
        alpha: 0
    }, 800, Phaser.Easing.Quadratic.Out, true, 0);
    let posTween = this.game.add.tween(this).to({
        x: this.x + 100
    }, 800, Phaser.Easing.Quadratic.Out, true, 0);
}
Character.prototype.startIdle = function()
{
    this.y = this.anchorY;
    this.posTween = this.game.add.tween(this).to({
        y: this.y + 8
    }, 2000, Phaser.Easing.Quadratic.InOut, true, 15,-1);
    this.posTween.yoyo(true,0);
}
Character.prototype.stopIdle = function()
{
    this.posTween.stop();
}
Character.prototype.shake = function()
{
    this.stopIdle();
    this.y = this.anchorY;
    this.posTween = this.game.add.tween(this).from({
        y: this.y - 16
    }, 600, Phaser.Easing.Elastic.Out, true, 0);
    
    this.game.add.tween(this).from({
        angle: this.angle - 2
    }, 600, Phaser.Easing.Elastic.Out, true, 0);

    this.posTween.onComplete.add(this.startIdle,this);

}

function SpeechBubble(game,x,y,width,height,backTex,font,text)
{
    Phaser.Group.call(this,game);
    this.x = x;
    this.y = y;
    this.backBox = null;
    this.text = null;
    this.arrow = null;

    let box = new PhaserNineSlice.NineSlice(game,width * 0.5,height * 0.5, backTex, null,width, height);
    box.anchor.setTo(0.5);
    this.addChild(box);
    this.backBox = box;

    console.log(font);
    var style = { font: font, fill: "#ffffff", align: "topLeft", wordWrap: true, wordWrapWidth: this.backBox.width * 0.8};
    this.text = game.add.text(-this.backBox.width /2 + this.backBox.width * 0.1,-this.backBox.height /2 + this.backBox.height * 0.1,text, style);
    this.backBox.addChild(this.text);
    this.text.setTextBounds(0,0,this.backBox.width * 0.8, this.backBox.height * 0.85);

    this.arrow = game.add.sprite(this.backBox.width * 0.5 - 48, this.backBox.height * 0.5 - 24,'arrow');
    this.arrow.anchor.setTo(0.5,1);
    this.backBox.addChild(this.arrow);

    this.onClose = new Phaser.Signal();
}

SpeechBubble.prototype = Object.create(Phaser.Group.prototype);
SpeechBubble.prototype.constructor = SpeechBubble;

SpeechBubble.prototype.open = function(){   
        this.backBox.scale.setTo(0,0.7);
        //Open speech bubble
        let scaleTween = this.game.add.tween(this.backBox.scale).to({
            x: 1, y: 1
        }, 300, Phaser.Easing.Back.Out, true, 15);
}

SpeechBubble.prototype.close = function(){
    this.backBox.scale.setTo(1);
    let scaleTween = this.game.add.tween(this.backBox.scale).to({
        x: 0, y: 0.7
    }, 300, Phaser.Easing.Back.In, true, 15);
    scaleTween.onComplete.add(function(){this.onClose.dispatch()},this);
}

import {ScenesManager} from "/js/ngine/scenes.js";
//#############################################################
//#############################################################
//## les Sprites
//#############################################################
//#############################################################
export class Unicorn{
    constructor(scale){
        if (!scale) scale = 1;
        var textures = [];
        this.dir = 1;   // Look at gauche...
        this.scale = scale;
        this.velX = 0;
        this.velY = 0;
        this.maxVel = 5;
        this.vit = .2;
        this.friction = .97;

        // Texture pour la licorne qui se déplace
        for (var i = 0; i < 3; i++) textures.push(PIXI.Texture.fromFrame('licorne' + i + '.png'));
        // Texture pour la licorne à l'arret..
        //TODO: A faire

        this.sprite = new PIXI.extras.AnimatedSprite(textures);
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();

        this.sprite.anchor.set(0.5);  

        this.sprite.scale.set(this.scale);

        this.addKeys();
    }

    gotoXY(x,y){
        this.sprite.x = x;
        this.sprite.y = y;      
    }

    move(wx,wy){
        if (this.pkeys[40]) { //up key
            this.velY+=this.vit;
            if (this.velY > this.maxVel) this.velY = this.maxVel
        } else if (this.pkeys[38]) { //down key
            this.velY-=this.vit;
            if (this.velY < -this.maxVel) this.velY = -this.maxVel
        }
        
        if (this.pkeys[39]) { //right key
            this.velX+=this.vit;
            if (this.velX > this.maxVel) this.velX = this.maxVel
            if (this.dir == 1) this.sprite.scale.x = -this.scale;
            this.dir = 0;
        } else if (this.pkeys[37]) { //left key
            this.velX-=this.vit;
            if (this.velX < -this.maxVel) this.velX = -this.maxVel
            if (this.dir == 0) this.sprite.scale.x = +this.scale;
            this.dir = 1;
        }
        // On freine...
        this.velX *= this.friction;
        this.velY *= this.friction;
        wx *= this.friction;
        wy *= this.friction;

        this.sprite.position.x +=this.velX + wx;
        this.sprite.position.y +=this.velY + wy;
    }

    addKeys(){
        this.pkeys=[];
        window.onkeydown = e => {
            var code = e.keyCode ? e.keyCode : e.which;
            this.pkeys[code]=true;
        }
        window.onkeyup = e => {
            var code = e.keyCode ? e.keyCode : e.which;
            this.pkeys[code]=false;
        };             
    }

    removeKeys(){
        window.onkeydown = null;
        window.onkeyup = null;        
    }
}
//#############################################################
export class Popcorn{
    constructor(scale){
        if (!scale) scale = 1;
        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["popcorn"]);
        this.sprite.anchor.set(.5);
        this.sprite.scale.set(scale);
        
        this.spawn();
    }

    spawn(){
        this.sprite.x = Math.floor(Math.random() * (ScenesManager.width - 0 + 1));
        this.sprite.y = Math.floor(Math.random() * (ScenesManager.height - 0 + 1));        
    }
}
//#############################################################
export class JaugeProut {
    constructor(full,scale){
        if (!scale) scale = 1;
        this.full = full;  
        this.cpt = 0;      
        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["prout"]);
        this.container = new PIXI.Container();   
        this.container.x = ScenesManager.width / 2 -this.sprite.width/2;
        this.container.y = 10;
        this.container.scale.set(scale);
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.sprite);
        this.container.addChild(this.graphics);
        // this.draw();
    }

    addProut(amount){
        if(!amount) amount = 1;
        this.cpt += amount;
        this.draw();
    }

    draw(){
        if (this.cpt > this.full) this.cpt = this.full;
        this.graphics.beginFill(0xDE3249);
        this.graphics.drawRect(49, 7, (146/this.full)*this.cpt, 36);
        this.graphics.endFill();     
    }

    // get sprite(){
    //     return this.container;
    // }
}

//#############################################################

export class SensDuVent{
    // Ajouter la determinationdu vent
    // Pendant un temps certain
    // puis animation de rotation... et hop le vent...
    constructor(){
        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["fleche"]);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.sprite.width/2;
        this.sprite.y = this.sprite.height/2;
        this.container = new PIXI.Container();   
        this.container.x = ScenesManager.width / 2 -this.sprite.width/2;
        this.container.y = ScenesManager.height - this.sprite.height - 10;
        this.container.addChild(this.sprite);
    }

    animate(){
        this.sprite.rotation += 0.01;
    }

    // get sprite(){
    //     return this.container;
    // }
}

//#############################################################
//#############################################################
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
        this.scale = scale;
        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["popcorn"]);
        this.sprite.anchor.set(.5);
        this.sprite.scale.set(this.scale);
        
        this.spawn();
    }

    spawn(){
        const MARGE = 10;
        this.sprite.x = MARGE + Math.floor(Math.random() * (ScenesManager.width - MARGE*2));
        this.sprite.y = MARGE + Math.floor(Math.random() * (ScenesManager.height - MARGE*2));      
    }

    animate(){
        this.sprite.rotation -= 0.05;
        this.sprite.scale.set(this.scale + Math.sin(this.sprite.rotation * this.scale));
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
        this.container.alpha = .5;
        // this.draw();
    }

    addProut(amount){
        if(!amount) amount = 1;
        this.cpt += amount;
        this.draw();
    }

    clear(){
        this.cpt = 0;
        this.draw();
    }

    draw(){
        if (this.cpt > this.full) this.cpt = this.full;
        this.graphics.clear();
        this.graphics.beginFill(0xDE3249);
        this.graphics.drawRect(49, 7, (146/this.full)*this.cpt, 36);
        this.graphics.endFill();     
    }
}

//#############################################################

export class SensDuVent{
    static vx = 0;
    static vy = 0;
    // Ajouter la determinationdu vent
    // Pendant un temps certain
    // puis animation de rotation... et hop le vent...
    constructor(){
        // 0 - en recherche
        // 1 - trouvé...
        this.state = 0;
        this.force = 1;
        this.tmsp = Date.now();
        this.now = this.tmsp;

        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["fleche"]);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.sprite.width/2;
        this.sprite.y = this.sprite.height/2;
        this.container = new PIXI.Container();   
        this.container.x = ScenesManager.width / 2 -this.sprite.width/2;
        this.container.y = ScenesManager.height - this.sprite.height - 10;
        this.container.addChild(this.sprite);

        this.basicText = new PIXI.Text('5');
        this.basicText.anchor.set(0.5);
        this.basicText.x = this.sprite.width/2;
        this.basicText.y = this.sprite.height/2;
        this.container.addChild(this.basicText);
    }

    animate(){
        if (this.state == 0) {
            this.sprite.rotation += Math.random()*.3; 
            this.force = Math.floor(Math.random()*3) + 1; 
            this.basicText.text= this.force;
            if ((Date.now() - this.tmsp) > 2000) {  // On s'arre^te au bout de 2 secondes de recherche..
                SensDuVent.vx = Math.cos(this.sprite.rotation - Math.PI/2) * this.force;    // TODO: C'est en degré, PIXI doit pas faire du degré mais du radian....
                SensDuVent.vy = Math.sin(this.sprite.rotation - Math.PI/2) * this.force; // pourquoi moin (-) ??
                this.state = 1;
                this.tmsp = Date.now();
            }
        } else {
            if ((Date.now() - this.tmsp) > 5000) {  // On chage de sens..
                this.state = 0;
                this.tmsp = Date.now();
            }
        }
    }
}

//#############################################################
/**
 * Recherche si le sprite en entrée est dans la zone de jeux ou pas, l'indique par une fleche le as échéant
 * @export
 * @class WhereAreYou
 */
export class WhereAreYou{
    constructor(toFollow){
        this.visible = false;
        // Objet à suivre
        this.toFollow = toFollow;
        this.now = 0;
        // Le temps à vivre hors écran...
        this.maxTime = 3;

        this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["fleche"]);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.sprite.width/2;
        this.sprite.y = this.sprite.height/2;

        this.container = new PIXI.Container();
        this.container.alpha = 0;
        this.container.x = ScenesManager.width / 2 -this.sprite.width/2;
        this.container.y = ScenesManager.height/2 - this.sprite.height/2;        

        this.text = new PIXI.Text('');
        this.text.anchor.set(0.5);
        this.text.x = this.sprite.width/2;
        this.text.y = this.sprite.height/2;

        this.container.addChild(this.sprite);
        this.container.addChild(this.text);
    }

    dansEcran(){
        // On test si le sprite est dans l'écran
        if (this.toFollow.x < 0 || this.toFollow.x > ScenesManager.width || this.toFollow.y < 0 || this.toFollow.y > ScenesManager.height) {
            // Calcul du sens de la fleche
            const vx = this.toFollow.x - this.container.x;
            const vy = this.toFollow.y - this.container.y;
            const angle = Math.atan2(vx,-vy);
            this.sprite.rotation = angle;
            if (this.now == 0) this.now =Date.now(); 
            const timeToLive = Math.floor((Date.now() - this.now) / 1000);  // Le temps passé hors de l'écran en seconde...
            this.text.text = this.maxTime - timeToLive;
            if (!this.visible){
                this.container.alpha = 1;
                this.now = Date.now();
                this.visible = true;
            }
            if (timeToLive >= this.maxTime) {
                console.log("t'es mort!");
                this.now = 0;
                return false;
            }
        } else {    // Sinon on le rends invisible si visible
            if (this.visible) {
                this.visible = false;
                this.container.alpha = 0;
                this.now= 0;
            }
        }
        return true;
    }
}

//#############################################################
//#############################################################

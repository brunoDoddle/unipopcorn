import {ScenesManager} from "/public/js/ngine/scenes.js";
/**
 * Envois des objets dans l'écran :-)
 * @export
 * @class FlyingObject
 */
export class FlyingObject{
    static min = 3;
    static max = 5;
    constructor(scale){
        this.now = 0;
        this.timeToObject = this.timeTo();
        this.container = new PIXI.Container();
        this.scale = scale;
    }

    /**
     * Rends un temps aléatoire à l'appelant (fixé entre 2 bornes)
     * @returns un temps aléatoire
     * @memberof FlyingObject
     */
    timeTo(){
        return (FlyingObject.min + Math.floor(Math.random() * FlyingObject.max)) * 1000;
    }

    distribute(){
        if (this.now==0) this.now = Date.now();
        // Quand lance t'on un objet ?
        if ((Date.now() - this.now) > this.timeToObject) {
            // C'est partie... Comment on fait ?
            this.now = Date.now();
            this.timeToObject = this.timeTo();  // Random sur le temps l'apparition de l'objet
            this.container.addChild(new SmallObject(this.scale));
            this.container.addChild(new MediumObject(this.scale));
        }
    }

    animate(spriteToCollide){
        this.container.children.forEach(
            object=>{
                object.animate(spriteToCollide);
            }
        );
    }

    reset(){
        this.now = 0;
        for (var i = this.container.children.length - 1; i >= 0; i--) this.container.children[i].destroy();
    }

}

/**
 * Base pour les sprite, foure tout commun des sprites....
 * @class Sprite
 * @extends {PIXI.Sprite}
 */
class Sprite extends PIXI.Sprite{
    constructor(){
        super();
        this.now = Date.now();
        this.canBeDestroy = false;
    }

    animate(){
        // Les objets peuvent sortir de l'écran 2 secondes après leurs créations... Enfin en être dertuit..
        if (!this.canBeDestroy) {
            if ((Date.now()-this.now) > 2000) this.canBeDestroy = true;
        } else if ((this.x+this.width) < 0 || (this.x-this.width) > ScenesManager.width || (this.y+this.height) < 0 || (this.y-this.height) > ScenesManager.height) {
            console.log("detroyed!");
            this.destroy();
        }
    }

    collide(other){
        const touch = ScenesManager.bump.hitTestRectangle(this, other.sprite);
        if (touch) console.log("Collision!!");
        const vx = (other.sprite.x-this.x )/2;
        const vy = (other.sprite.y-this.y)/2;
        var lng = Math.sqrt(vx*vx+vy*vy);
        return ({colision:touch,vx:vx/lng,vy:vy/lng});
    }
}

/**
 * Objets moyens qui suivent leur direction..
 * @class MediumObject
 * @extends {Sprite}
 */
class MediumObject extends Sprite{
    constructor(scale){
        super();
        const textures = [PIXI.utils.TextureCache["avion1"],PIXI.utils.TextureCache["avion2"],PIXI.utils.TextureCache["missile"],PIXI.utils.TextureCache["meteor"]]
        const dirs = [1,-1]
        this.anchor.set(.5);
        this.type = Math.floor(Math.random()*(textures.length));
        this.dir = dirs[Math.floor(Math.random()*(dirs.length))];
        this.texture = textures[this.type];

        switch(this.type){
            case 0: // Avions
            case 1:
                this.scale.x = this.dir * scale;
                this.scale.y = scale;
                if (this.dir==1)    this.x = 0 - this.width/2;
                else                this.x = ScenesManager.width + this.width/2
                this.y = Math.random() * ScenesManager.height;
                break;
            case 2: // Missiles
            case 3: // Météores
                this.scale.x = scale;
                this.scale.y = -this.dir * scale;
                if (this.dir==1)    this.y = 0 - this.height/2;
                else                this.y = ScenesManager.height + this.height/2
                this.x = Math.random() * ScenesManager.width;
                break;
        }
        this.vel = 0;
    }

    animate(objectToCollide){
        const vit=10;
        const acc=1;
        switch(this.type){
            case 0: // à Hélice
                if (this.dir==1)    this.x += vit;
                else                this.x -= vit;
                break;
            case 1: // A raction
                if (this.dir==1)    this.x += vit*2;
                else                this.x -= vit*2;
                break;
            case 2:
                this.vel+= acc;
                if (this.dir==1)    this.y += this.vel;
                else                this.y -= this.vel;
                break;
            case 3:
                if (this.dir==1)    this.y += vit;
                else                this.y -= vit;
                this.rotation+=.1;
                break;
        }
        const test = this.collide(objectToCollide);
        if (test.colision){
            switch(this.type){
                case 0:
                case 1:
                case 3:
                    objectToCollide.velX = test.vx*vit*2;
                    objectToCollide.velY = test.vy*vit*2;
                    break;
                case 2:
                    objectToCollide.velX = test.vx * this.vel/2;
                    objectToCollide.velY = test.vy * this.vel/2;
                    break;
            };
        }
        super.animate();
    }
}

/**
 * Petits objets qui suivent le sens du vent
 * @class SmallObject
 * @extends {Sprite}
 */
class SmallObject extends Sprite{
    constructor(scale){
        super();
        const textures = [PIXI.utils.TextureCache["chaussure"],PIXI.utils.TextureCache["slip"],PIXI.utils.TextureCache["branche"]]
        const PI = Math.PI;
        this.scale.set(scale);
        this.anchor.set(.5);
        this.texture = textures[Math.floor(Math.random()*(textures.length-1))];
        const angle = Math.atan2(-SensDuVent.vx,SensDuVent.vy);
        const objectAngle = (angle - PI/2) + (Math.random() * PI/2) - PI/4;

        this.x = ScenesManager.width/2 + Math.cos(objectAngle) * (ScenesManager.width + this.width);
        this.y = ScenesManager.height/2 + Math.sin(objectAngle) * (ScenesManager.width + this.height);

        this.now = Date.now();
        this.rotate = Math.random() / 10;
    }

    animate(objectToCollide){
        const vit = 4;
        this.x+=SensDuVent.vx*vit;
        this.y+=SensDuVent.vy*vit;
        this.rotation+=this.rotate;
        const test = this.collide(objectToCollide);
        if (test.colision){
            objectToCollide.velX = test.vx * vit*2;
            objectToCollide.velY = test.vy * vit*2;
        };
        super.animate();
    }
}
/**
 *
 *
 * @export
 * @class Nuages
 */
export class Nuages {
    constructor(max,scale){
        this.nuageLayers = [];

        for (var n = 0; n < max; n++) {
            var nuages = new PIXI.extras.TilingSprite(
                this.doNuage(10),
                ScenesManager.width,
                ScenesManager.height
            );
            nuages.scale.set(scale);
            this.nuageLayers.push(nuages);
        }
        console.log("Nb de nuage:" + this.nuageLayers.length);
    }

    doNuage(maxNuages,sprite) {
        const container = new PIXI.Container();
        const NUAGES = ["pNuage1", "mNuage1", "gNuage1", "gNuage2", "gNuage3"]; //TODO: faire plus jolie..

        if (sprite) {
            sprite.x = 0;
            sprite.y = 0;
            container.addChild(sprite);
        }
        let renderTexture = PIXI.RenderTexture.create(500, 500);

        for (let i = 0; i < maxNuages; i++) {
            var textureNuage = Math.floor(Math.random() * NUAGES.length);
            var nuage = new PIXI.Sprite(PIXI.utils.TextureCache[NUAGES[textureNuage]]);
            nuage.anchor.set(.5); // On se met au milieux du sprite
            nuage.x = (nuage.width / 2) + Math.floor(Math.random() * (renderTexture.width - (nuage.width)));
            nuage.y = (nuage.height / 2) + Math.floor(Math.random() * (renderTexture.height - (nuage.height)));
            container.addChild(nuage);
        }
        ScenesManager.renderer.render(container, renderTexture);

        return renderTexture;
    }
    
    giveMe(numero){
        return this.nuageLayers[numero];
    }
    
    animate(){
        this.nuageLayers.forEach((nuage, n) => {
            nuage.tilePosition.x += SensDuVent.vx * 1 / (this.nuageLayers.length - n);
            nuage.tilePosition.y += SensDuVent.vy * 1 / (this.nuageLayers.length - n);
        });        
    }
}

/**
 *
 * @export
 * @class Unicorn
 */
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

    reset(){
        this.gotoXY(ScenesManager.width / 2, ScenesManager.height / 2);
        this.velX = 0;
        this.velY = 0;
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

/**
 *
 * @export
 * @class Popcorn
 */
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
        const MARGE = 20;
        this.sprite.x = MARGE + Math.floor(Math.random() * (ScenesManager.width - MARGE*2));
        this.sprite.y = MARGE + Math.floor(Math.random() * (ScenesManager.height - MARGE*2));      
    }

    animate(){
        this.sprite.rotation -= 0.05;
        this.sprite.scale.set(this.scale + Math.sin(this.sprite.rotation * this.scale));
    }
}

/**
 *
 * @export
 * @class JaugeProut
 */
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

/**
 *
 * @export
 * @class SensDuVent
 */
export class SensDuVent{
    static vx = 0;
    static vy = 0;
    static rotation = 0;
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
            if ((Date.now() - this.tmsp) > 2000) {  // On s'arrête au bout de 2 secondes de recherche..
                SensDuVent.vx = Math.cos(this.sprite.rotation - Math.PI/2) * this.force;    // TODO: C'est en degré, PIXI doit pas faire du degré mais du radian....
                SensDuVent.vy = Math.sin(this.sprite.rotation - Math.PI/2) * this.force; // pourquoi moin (-) ??
                SensDuVent.rotation = this.sprite.rotation;
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

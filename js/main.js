
import hitTestRectangle from "./hitTestRectangle.js";

var app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
var scale = 2;
document.body.appendChild(app.view);
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;    // Pas de smooth sur les aggrandissements

// cclu du ratio pour le scale...
//if( screen.width >= 1920 && screen.height >= 1080 ){

PIXI.loader
    .add("sun","ressources/png/sun.json")
    .add("popcorn","ressources/png/popcorn.png")
    .add('SSLicorne', 'ressources/png/licorne.json')    
    .add("laser","ressources/mp3/laser.mp3")
    .add("musique","ressources/mp3/musique.mp3")
    .add("ciel_fond","ressources/png/ciel_fond.png")
    .add("ciel_devant","ressources/png/ciel_devant.png")
    .on("progress", loadProgressHandler)  
    .load(setup);

function loadProgressHandler(pourcent) {
    console.log("loading:" + pourcent.progress); 
}

class Guy{
    constructor(resources){
        this.sprite = new PIXI.Sprite(resources.popcorn.texture);
        //this.sprite.anchor.set(4);
        this.sprite.scale.set(scale);
        this.spawn();
    }

    spawn(){
        this.sprite.x = Math.floor(Math.random() * (app.screen.width - 0 + 1));
        this.sprite.y = Math.floor(Math.random() * (app.screen.height - 0 + 1));        
    }

    get giveMe(){
        return this.sprite;
    }
}

function setup(loader,resources){

    var textures = [],textures1 = [], unicornDir = 0;
    var popcorn = new Guy(resources);
    var vit = 2;
    var count = 0;

    for (var i = 0; i < 2; i++) {
        var texture = PIXI.Texture.fromFrame('licorne' + (i+1) + '.png');
        textures.push(texture);
    }

    var unicorn = new PIXI.extras.AnimatedSprite(textures);
    unicorn.animationSpeed = 0.1;
    unicorn.play();


    for (var i = 0; i < 2; i++) {
        var texture = PIXI.Texture.fromFrame('sun' + (i+1) + '.png');
        textures1.push(texture);
    }
    var sun = new PIXI.extras.AnimatedSprite(textures1);
    sun.animationSpeed = 0.1;
    sun.play();

    var tile_fond = new PIXI.extras.TilingSprite(
        resources.ciel_fond.texture,
        app.screen.width,
        app.screen.height
    );
    var tile_devant = new PIXI.extras.TilingSprite(
        resources.ciel_devant.texture,
        app.screen.width,
        app.screen.height
    );

    tile_fond.scale.set(scale);
    tile_devant.scale.set(scale);

    // center the sprite's anchor point
    unicorn.anchor.set(0.5);

    resources.laser.sound.volume = .10;
    resources.musique.sound.play();

    // move the sprite to the center of the screen
    unicorn.x = app.screen.width / 2;
    unicorn.y = app.screen.height / 2;

    sun.x = 30;
    sun.y = 30;

    unicorn.scale.set(scale);
    sun.scale.set(scale);

    app.stage.addChild(tile_fond);
    app.stage.addChild(sun);
    app.stage.addChild(tile_devant);
    app.stage.addChild(unicorn);
    app.stage.addChild(popcorn.sprite);

    // Listen for animate update
    app.ticker.add(function(delta) {
        popcorn.sprite.rotation -= 0.05 * delta;
        popcorn.sprite.anchor.set(Math.sin(count) *4);
        count += 0.005;

        //apply keys
        if (pkeys[38]) { //up key
            // unicorn.position.y-=vit;
            tile_fond.tilePosition.y-=vit/2;
            tile_devant.tilePosition.y-=vit;
        }
        if (pkeys[40]) { //down key
            // unicorn.position.y+=vit;
            tile_fond.tilePosition.y+=vit/2;
            tile_devant.tilePosition.y+=vit;
        }
        if (pkeys[39]) { //up key
            // unicorn.position.x+=vit;
            tile_fond.tilePosition.x-=vit/2;
            tile_devant.tilePosition.x-=vit;
            if (unicornDir == 1) unicorn.scale.x = -scale;
            unicornDir = 0;
        }
        if (pkeys[37]) { //down key
            // unicorn.position.x-=vit;
            tile_fond.tilePosition.x+=vit/2;
            tile_devant.tilePosition.x+=vit;
            if (unicornDir == 0) unicorn.scale.x = scale;
            unicornDir = 1;
        }   

        if (hitTestRectangle(unicorn, popcorn.sprite)) {
            console.log("bam!");
            resources.laser.sound.play();
            popcorn.spawn();
          } else {
            //There's no collision
          }
    });

    var pkeys=[];
    window.onkeydown = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        pkeys[code]=true;
    }
    window.onkeyup = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        pkeys[code]=false;
    };      
}


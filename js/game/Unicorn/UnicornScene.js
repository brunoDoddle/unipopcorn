import {Scene,ScenesManager} from "/js/ngine/scenes.js";
import {Unicorn,Popcorn,JaugeProut,SensDuVent} from "/js/game/Unicorn/sprites.js";

export class UnicornScene extends Scene{
    static SCALE = 3;
    static NUAGES = ["pNuage1","mNuage1","gNuage1"];

    constructor(){
        super();
        // Biblio de collision
        this.B = new Bump(PIXI);

        this.nuageLayers = [];

        // On ajoute une petite licorne
        this.unicorn = new Unicorn(UnicornScene.SCALE);
        this.unicorn.gotoXY(ScenesManager.width/2,ScenesManager.height/2);              

        this.popcorn = new Popcorn(UnicornScene.SCALE);
        this.jaugeProut = new JaugeProut(5);
        this.sensDuVent = new SensDuVent(5);

        var textures = [];

        // Texture pour le soleil
        for (var i = 0; i < 3; i++) textures.push(PIXI.Texture.fromFrame('sun' + i + '.png'));
        this.sun = new PIXI.extras.AnimatedSprite(textures);
        this.sun.animationSpeed = 0.1;
        this.sun.play();

        // Fabrication des fond nuageux... 
        this.doNuageLayer(3);

        ScenesManager.resources.laser.sound.volume = .10;

        this.sun.x = 30;
        this.sun.y = 30;

        this.sun.scale.set(UnicornScene.SCALE);        

        this.addChild(this.sun);
        this.nuageLayers.forEach((nuages,n)=>{
            if (n==2) {
                this.addChild(this.unicorn.sprite);
                this.addChild(this.popcorn.sprite);
            }
            this.addChild(nuages);
        })
        this.addChild(this.jaugeProut.container);
        this.addChild(this.sensDuVent.container);

        // On lance le vent....
        this.windX = (Math.random()-.5)*2;
        this.windY = (Math.random()-.5)*2;        
    }

    doNuageLayer(max){
        for(var n=0;n<=max;n++){
            const nuages = new PIXI.extras.TilingSprite(
                this.doNuage(),
                ScenesManager.width,
                ScenesManager.height
            );
            nuages.scale.set(UnicornScene.SCALE);
            this.nuageLayers.push(nuages)
        }
    }

    doNuage(sprite){
        const MARGE = 30;
        const container = new PIXI.Container();
        
        if (sprite){
            sprite.x=0;
            sprite.y=0;
            container.addChild(sprite);
        }
        let renderTexture = PIXI.RenderTexture.create(500,500);

        for (let i = 0; i < 10; i++) {
            var textureNuage= Math.floor(Math.random() * UnicornScene.NUAGES.length);
            var nuage = new PIXI.Sprite(PIXI.utils.TextureCache[UnicornScene.NUAGES[textureNuage]]);
            nuage.anchor.set(.5);    // On se met au mileux du sprite
            nuage.x = MARGE/2 + Math.floor(Math.random() * (renderTexture.width -MARGE));
            nuage.y = MARGE/2 + Math.floor(Math.random() * (renderTexture.height -MARGE));
            // nuage.x = (i % 5) * 30;
            // nuage.y = Math.floor(i / 5) * 30;
            container.addChild(nuage);
        }
        ScenesManager.renderer.render(container, renderTexture);
        
        return renderTexture;      
    }

    /************************************************************************************/
    /************************************************************************************/
    update() {
        this.unicorn.move(this.windX,this.windY);
        this.popcorn.sprite.rotation -= 0.05;  
        this.popcorn.sprite.scale.set(UnicornScene.SCALE + Math.sin(this.popcorn.sprite.rotation * UnicornScene.SCALE));  
        this.sensDuVent.animate();

        this.nuageLayers.forEach((nuage,n) => {
            nuage.tilePosition.x+= this.windX*1/(this.nuageLayers.length-n);
            nuage.tilePosition.y+= this.windY*1/(this.nuageLayers.length-n);            
        });

        if(this.B.hitTestRectangle(this.unicorn.sprite, this.popcorn.sprite)){
            console.log("bam!");
            ScenesManager.resources.laser.sound.play()
            this.jaugeProut.addProut();
            this.popcorn.spawn();
        } else {
            //There's no collision
        }           
    }
}


import {Scene,ScenesManager} from "/js/ngine/scenes.js";

export class MenuScene extends Scene{
    constructor(){
        super();
        this.cpt = 0;

        const textureTitre = PIXI.Texture.fromFrame("menuTitre");
        this.titre = new PIXI.Sprite(textureTitre);
    
        this.titre.anchor.set(0.5);
        this.titre.x = ScenesManager.width  / 2
        this.titre.y = ScenesManager.height / 3;
        this.addChild(this.titre);    

        const textureButton = PIXI.Texture.fromFrame("playButton");
        this.button = new PIXI.Sprite(textureButton);
        this.button.buttonMode = true;
    
        this.button.anchor.set(0.5);
        this.button.x = ScenesManager.width  / 2
        this.button.y = ScenesManager.height / 3 * 2;
    
        // LE bouton play
        this.button.interactive = true;
        this.button.buttonMode = true;   
        this.button.on('pointerdown', e => {
            ScenesManager.goToScene('game');
        })        
        this.addChild(this.button);    
    }

    update() {
        this.button.scale.set(1 + Math.sin(this.cpt)/20); 
        this.titre.rotation = (Math.sin(this.cpt)/10); 
        this.cpt+=.1;
    }
}


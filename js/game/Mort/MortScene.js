import {Scene,ScenesManager} from "/js/ngine/scenes.js";
export class MortScene extends Scene{
    constructor(){
        super();
        this.cpt = 0;

        const textureTitre = PIXI.Texture.fromFrame("tesMort");
        const titre = new PIXI.Sprite(textureTitre);
    
        titre.anchor.set(0.5);
        titre.x = ScenesManager.width  / 2
        titre.y = ScenesManager.height / 3;
        this.addChild(titre);    

        const textureRePlayButton = PIXI.Texture.fromFrame("rePlayButton");
        this.button = new PIXI.Sprite(textureRePlayButton);
        this.button.buttonMode = true;
    
        this.button.anchor.set(0.5);
        this.button.x = ScenesManager.width  / 2
        this.button.y = ScenesManager.height / 3 * 2 - 50;
    
        // Le bouton replay
        this.button.interactive = true;
        this.button.buttonMode = true;   
        this.button.on('pointerdown', e => {
            ScenesManager.goToScene('game');
        })        
        this.addChild(this.button);    

        const textureMenuButton = PIXI.Texture.fromFrame("menuButton");
        const button = new PIXI.Sprite(textureMenuButton);
        button.buttonMode = true;
    
        button.anchor.set(0.5);
        button.x = ScenesManager.width  / 2
        button.y = ScenesManager.height / 3 * 2 + 50;
    
        // Le bouton menu
        button.interactive = true;
        button.buttonMode = true;   
        button.on('pointerdown', e => {
            ScenesManager.goToScene('menu');
        })        
        this.addChild(button);    
    }

    update() {
        this.button.scale.set(1 + Math.sin(this.cpt+=.1)/20); 
    }
}


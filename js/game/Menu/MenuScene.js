import {Scene,ScenesManager} from "/js/ngine/scenes.js";

export class MenuScene extends Scene{
    constructor(){
        super();
        const textureButton = PIXI.Texture.fromFrame("playButton");
        const button = new PIXI.Sprite(textureButton);
        button.buttonMode = true;
    
        button.anchor.set(0.5);
        button.x = ScenesManager.width  / 2
        button.y = ScenesManager.height / 3 * 2;
    
        // LE bouton play
        button.interactive = true;
        button.buttonMode = true;   
        button.on('pointerdown', e => {
            ScenesManager.goToScene('game');
        })        
        this.addChild(button);    
    }

    update() {
    }
}


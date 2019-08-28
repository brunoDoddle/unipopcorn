import {Scene,ScenesManager} from "/public/js/ngine/scenes.js";
import * as tools from "/public/js/ngine/tools.js";

export class MenuScene extends Scene{
    constructor(){
        super();
        this.cpt = 0;

        this.placer = new tools.Placer([3,2]);
        this.placer.setTop(1);
        this.addChild(this.placer);

        this.titre = new tools.Titre(
            "menuTitre"
        );
        this.placer.setTo(0,this.titre);

        this.play= new tools.Button(
            "playButton",
            e => {ScenesManager.goToScene('game');}
        );
        this.placer.setTo(1,this.play);
    }

    update() {
/*        this.play.tilt(); 
        this.titre.rotation = (Math.sin(this.cpt)/10); 
        this.cpt+=.1;
*/    }
}


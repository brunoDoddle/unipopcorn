import {Scene,ScenesManager} from "/public/js/ngine/scenes.js";
import * as tools from "/public/js/ngine/tools.js";

export class MortScene extends Scene{
    constructor(){
        super();
        this.cpt = 0;

        this.placer = new tools.Placer([2,1,1]);
        this.placer.setTop(2);
        this.addChild(this.placer);

        this.titre = new tools.Titre(
            "tesMort"
        );
        this.placer.setTo(0,this.titre);    

        this.replay= new tools.Button(
            "rePlayButton",
            e => {ScenesManager.goToScene('game');}
        );
        this.placer.setTo(1,this.replay);    

        this.menu= new tools.Button(
            "menuButton",
            e => {ScenesManager.goToScene('menu');}
        );
        this.placer.setTo(2,this.menu);    
    }

    update() {
        this.replay.tilt();
    }
}


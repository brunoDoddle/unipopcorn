import {ScenesManager} from "/js/ngine/scenes.js";

export class Button extends PIXI.Sprite{
    constructor(texture,callBack){
        super();
        this.cpt = 0;
        this.texture = PIXI.Texture.fromFrame(texture);
        this.buttonMode = true;
    
        this.interactive = true;
        this.buttonMode = true;   
        this.on('pointerdown', callBack)   
    }

    /**
     * Fait grossir et rapetissir un bouton
     * @memberof Button
     */
    tilt(){
        this.scale.set(1 + Math.sin(this.cpt)/20);
        this.cpt+=.1;
    }
}

export class Titre extends PIXI.Sprite{
    constructor(texture){
        super();
        this.texture = PIXI.Texture.fromFrame(texture);
    }
}
/**
 * Positionne titre et boutton de facon simple dans un frameset vertical
 * @export
 * @class Placer
 * @extends {PIXI.Container}
 */
export class Placer extends PIXI.Container{
    constructor(list){
        super();
        this.list = [];
        this.total = 0;
        list.forEach(e=>{
            this.list.push({
                "horizontal":"center",
                "vertical":"middle",
                "size":e,
                "position":this.total
            });
            this.total+=e;
        })
    }

    setTop(position){
        this.list[position].vertical = "top";
    }

    setBottom(position){
        this.list[position].vertical = "bottom";
    }

    setMiddle(position){
        this.list[position].vertical = "middle";
    }

    setLeft(position){
        this.list[position].horizontal = "left";
    }

    setRight(position){
        this.list[position].horizontal = "right";
    }

    setCenter(position){
        this.list[position].horizontal = "center";
    }

    setTo(position,object){
        object.anchor.set(0.5);

        if (position > (this.list.length-1)) {
            console.error("position incorrecte!");
            return -1;
        }
        const Y = (ScenesManager.height / this.total);

        switch(this.list[position].horizontal){
            case "right":
                object.x = ScenesManager.width - object.width / 2;
                break;
            case "left":
                object.x = object.width / 2;
                break;
            case "center":
                object.x = ScenesManager.width / 2;
                break;
        }
        switch(this.list[position].vertical){
            case "top":
                object.y = (Y * this.list[position].position) + object.height / 2;
                break;
            case "middle":
                object.y = (Y * this.list[position].position) + ((this.list[position].size /2) * Y);
                break;
            case "bottom":
                object.y = (Y * this.list[position].position) + (this.list[position].size * Y - object.height / 2);
                break;
        }
        this.addChild(object);
    }
}
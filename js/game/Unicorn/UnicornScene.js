import {
    Scene,
    ScenesManager
} from "/js/ngine/scenes.js";

import {
    Unicorn,
    Popcorn,
    JaugeProut,
    SensDuVent,
    WhereAreYou
} from "/js/game/Unicorn/sprites.js";

/**
 * La scene principale, globalement le jeux...
 * @export
 * @class UnicornScene
 * @extends {Scene}
 */
export class UnicornScene extends Scene {
    static SCALE = 3;
    static NUAGES = ["pNuage1", "mNuage1", "gNuage1", "gNuage2", "gNuage3"];

    constructor() {
        super();
/*        const blurFilter1 = new PIXI.filters.BlurFilter();
        const blurFilter2 = new PIXI.filters.BlurFilter();
        const blurFilter3 = new PIXI.filters.BlurFilter();
*/
        // Biblio de collision
        this.B = new Bump(PIXI);

        this.nuageLayers = [];

        // On ajoute une petite licorne
        this.unicorn = new Unicorn(UnicornScene.SCALE);
        this.unicorn.gotoXY(ScenesManager.width / 2, ScenesManager.height / 2);

        this.popcorn = new Popcorn(UnicornScene.SCALE);
        this.jaugeProut = new JaugeProut(5);
        this.sensDuVent = new SensDuVent();
        this.whereAreYou = new WhereAreYou(this.unicorn.sprite);

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
        this.nuageLayers.forEach((nuages, n) => {
            if (n == 1) {
                this.addChild(this.unicorn.sprite);
                this.addChild(this.popcorn.sprite);
            }
            this.addChild(nuages);
        })

        // this.nuageLayers[3].filters = [blurFilter1];
        // this.nuageLayers[2].filters = [blurFilter2];
        // this.nuageLayers[1].filters = [blurFilter3];
        // blurFilter1.blur = 6;
        // blurFilter2.blur = 4;
        // blurFilter3.blur = 2;
        this.addChild(this.jaugeProut.container);
        this.addChild(this.sensDuVent.container);
        this.addChild(this.whereAreYou.container);
    }

    /**
     * Fabique un ciel de nuage en combinant des container
     * @param {*} max   Nombre de container voulu
     * @memberof UnicornScene
     */
    doNuageLayer(max) {
        for (var n = 0; n < max; n++) {
            const nuages = new PIXI.extras.TilingSprite(
                this.doNuage(),
                ScenesManager.width,
                ScenesManager.height
            );
            nuages.scale.set(UnicornScene.SCALE);
            this.nuageLayers.push(nuages)
        }
    }

    /**
     *Fait un container de nuages
    * @param {*} sprite    Sprite à inserer dasn le container pour avoir une base
    * @returns Un texturepour sprite
    * @memberof UnicornScene
    */
    doNuage(sprite) {
        const container = new PIXI.Container();

        if (sprite) {
            sprite.x = 0;
            sprite.y = 0;
            container.addChild(sprite);
        }
        let renderTexture = PIXI.RenderTexture.create(500, 500);

        for (let i = 0; i < 10; i++) {
            var textureNuage = Math.floor(Math.random() * UnicornScene.NUAGES.length);
            var nuage = new PIXI.Sprite(PIXI.utils.TextureCache[UnicornScene.NUAGES[textureNuage]]);
            nuage.anchor.set(.5); // On se met au milieux du sprite
            nuage.x = (nuage.width / 2) + Math.floor(Math.random() * (renderTexture.width - (nuage.width)));
            nuage.y = (nuage.height / 2) + Math.floor(Math.random() * (renderTexture.height - (nuage.height)));
            container.addChild(nuage);
        }
        ScenesManager.renderer.render(container, renderTexture);

        return renderTexture;
    }

    /************************************************************************************/
    /************************************************************************************/
    update() {
        // Gestion du vent et du pocorn
        this.sensDuVent.animate();
        this.popcorn.animate();

        // Gestion de l'unicorn
        this.unicorn.move(SensDuVent.vx, SensDuVent.vy);
        // Gestion de la mort de la licorne
        if (!this.whereAreYou.dansEcran()){
            ScenesManager.goToScene("mort");
            //Tou remettre à 0, mais apres changement de scene...
            this.unicorn.gotoXY(ScenesManager.width / 2, ScenesManager.height / 2);
            this.jaugeProut.clear();
            this.popcorn.spawn();
        }

        this.nuageLayers.forEach((nuage, n) => {
            nuage.tilePosition.x += SensDuVent.vx * 1 / (this.nuageLayers.length - n);
            nuage.tilePosition.y += SensDuVent.vy * 1 / (this.nuageLayers.length - n);
        });

        if (this.B.hitTestRectangle(this.unicorn.sprite, this.popcorn.sprite)) {
            ScenesManager.resources.laser.sound.play()
            this.jaugeProut.addProut();
            this.popcorn.spawn();
            console.log("bam!");
        }
    }
}

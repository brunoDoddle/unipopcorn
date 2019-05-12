import {
    Scene,
    ScenesManager
} from "/js/ngine/scenes.js";

import {
    Unicorn,
    Popcorn,
    JaugeProut,
    SensDuVent,
    WhereAreYou,
    FlyingObject,
    Nuages
} from "/js/game/Unicorn/common.js";


/**
 * La scene principale, globalement le jeux...
 * @export
 * @class UnicornScene
 * @extends {Scene}
 */
export class UnicornScene extends Scene {
    //TODO: Faire de vraie beaux nuages..
    static SCALE = 3;

    constructor() {
        super();
        // On ajoute une petite licorne
        this.unicorn = new Unicorn(UnicornScene.SCALE);
        this.unicorn.gotoXY(ScenesManager.width / 2, ScenesManager.height / 2);

        this.popcorn = new Popcorn(UnicornScene.SCALE);
        this.jaugeProut = new JaugeProut(5);
        this.sensDuVent = new SensDuVent();
        this.whereAreYou = new WhereAreYou(this.unicorn.sprite);
        this.flyingObject = new FlyingObject(UnicornScene.SCALE);
        this.nuages = new Nuages(3,UnicornScene.SCALE);

        var textures = [];

        // Texture pour le soleil
        for (var i = 0; i < 3; i++) textures.push(PIXI.Texture.fromFrame('sun' + i + '.png'));
        this.sun = new PIXI.extras.AnimatedSprite(textures);
        this.sun.animationSpeed = 0.1;
        this.sun.play();

        ScenesManager.resources.laser.sound.volume = .10;

        this.sun.x = 30;
        this.sun.y = 30;

        this.sun.scale.set(UnicornScene.SCALE);

        //******************************************* */
        //******************************************* */
        // ajout des couches sur le renderer
        //******************************************* */
        //******************************************* */
        //Pour faire jolie (todo: à animer;.)
        this.addChild(this.sun);

        // Scenes du jeux
        this.addChild(this.nuages.nuageLayers[0]);
        this.addChild(this.nuages.nuageLayers[1]);
        this.addChild(this.popcorn.sprite);
        this.addChild(this.flyingObject.container);
        this.addChild(this.unicorn.sprite);
        this.addChild(this.nuages.nuageLayers[2]);

        // Indicateurs du jeux..
        this.addChild(this.jaugeProut.container);
        this.addChild(this.sensDuVent.container);
        this.addChild(this.whereAreYou.container);
    }

    /************************************************************************************/
    /************************************************************************************/
    update() {
        // Gestion du vent et du pocorn
        this.sensDuVent.animate();
        this.popcorn.animate();
        this.flyingObject.distribute();
        this.flyingObject.animate(this.unicorn);

        // Gestion de l'unicorn
        this.unicorn.move(SensDuVent.vx, SensDuVent.vy);
        // Gestion de la mort de la licorne
        if (!this.whereAreYou.dansEcran()){
            ScenesManager.goToScene("mort");
            //Tout remettre à 0, mais apres changement de scene...
            this.unicorn.reset();
            this.jaugeProut.clear();
            this.popcorn.spawn();
            this.flyingObject.reset();
        }

        this.nuages.animate();

        // Voir si accessible (le bump)...
        if (ScenesManager.bump.hitTestRectangle(this.unicorn.sprite, this.popcorn.sprite)) {
            ScenesManager.resources.laser.sound.play()
            this.jaugeProut.addProut();
            this.popcorn.spawn();
            console.log("bam!");
        }
    }
}

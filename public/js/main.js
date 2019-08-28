// Gestion de scene de ménage 2
// Utilisation de piskel pour les grafs
//http://ezelia.com/2013/tutorial-gestion-des-scenes-dun-jeu-des-transitions-et-de-la-mise-a-lechelle-avec-pixi-js
import {ScenesManager} from "/public/js/ngine/scenes.js";
import {UnicornScene} from "/public/js/game/Unicorn/UnicornScene.js";
import {MenuScene} from "/public/js/game/Menu/MenuScene.js";
import {MortScene} from "/public/js/game/Mort/MortScene.js";

// Le worker ne semble pas exister ??? Pourtatn on est dans chromium...
//var worker = navigator.serviceWorker.register('/sw-uniPopCorn.js');

// Setting spécifique PIXI
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RESOLUTION = window.devicePixelRatio;

// Le loader...
PIXI.loader
    .add("sun","public/png/sun.json")
    .add('SSLicorne', 'public/png/licorne.json')    
    .add("chaussure","public/png/chaussure.png")
    .add("avion1","public/png/avion1.png")
    .add("avion2","public/png/avion2.png")
    .add("missile","public/png/missile.png")
    .add("meteor","public/png/meteor.png")
    .add("slip","public/png/slip.png")
    .add("branche","public/png/branche.png")
    .add("playButton","public/png/playButton.png")
    .add("rePlayButton","public/png/rePlayButton.png")
    .add("menuButton","public/png/menuButton.png")
    .add("tesMort","public/png/tesMort.png")
    .add("menuTitre","public/png/menuTitre.png")
    .add("popcorn","public/png/popcorn1.png")
    .add("prout","public/png/jaugeProut.png")
    .add("fleche","public/png/fleche.png")
    .add("laser","public/mp3/laser.mp3")
    //.add("musique","public/mp3/musique.mp3")
    .add("pNuage1","public/png/petitNuage1.png")
    .add("mNuage1","public/png/moyenNuage1.png")
    .add("gNuage1","public/png/grandNuage1.png")
    .add("gNuage2","public/png/grandNuage2.png")
    .add("gNuage3","public/png/grandNuage3.png")
    .on("progress", loadProgressHandler)  
    .load(setup);

// //Suivie du progress pour faire jolie....
function loadProgressHandler(pourcent) {
    // A retravailler :-)
    console.log("loading:" + pourcent.progress); 
}

function setup(loader,resources){
    ScenesManager.create(window.innerWidth, window.innerHeight,resources, 0x1099bb);

    // Ajout des différentes scenes du jeux, le menu, le jeux et les highScores...
    const game = ScenesManager.createScene('game',UnicornScene);
    const menu = ScenesManager.createScene('menu',MenuScene);
    const mort = ScenesManager.createScene('mort',MortScene);
    ScenesManager.goToScene('game');
}
// 

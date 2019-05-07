// Gestion de scene
// Utilisation de piskel pour les grafs
//http://ezelia.com/2013/tutorial-gestion-des-scenes-dun-jeu-des-transitions-et-de-la-mise-a-lechelle-avec-pixi-js
import {ScenesManager} from "/js/ngine/scenes.js";
import {UnicornScene} from "/js/game/Unicorn/UnicornScene.js";
import {MenuScene} from "/js/game/Menu/MenuScene.js";
import {MortScene} from "/js/game/Mort/MortScene.js";

var worker = navigator.serviceWorker.register('/sw-uniPopCorn.js');

// // calcul du ratio pour le scale...
// //if( screen.width >= 1920 && screen.height >= 1080 ){
// var _SCALE = 2;

// Setting spécifique PIXI
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RESOLUTION = window.devicePixelRatio;

// Le loader...
// Loader plein de nuages
PIXI.loader
    .add("sun","ressources/png/sun.json")
    .add('SSLicorne', 'ressources/png/licorne.json')    
    .add("playButton","ressources/png/playButton.png")
    .add("rePlayButton","ressources/png/rePlayButton.png")
    .add("menuButton","ressources/png/menuButton.png")
    .add("tesMort","ressources/png/tesMort.png")
    .add("menuTitre","ressources/png/menuTitre.png")
    .add("popcorn","ressources/png/popcorn1.png")
    .add("prout","ressources/png/jaugeProut.png")
    .add("fleche","ressources/png/fleche.png")
    .add("laser","ressources/mp3/laser.mp3")
    //.add("musique","ressources/mp3/musique.mp3")
    .add("pNuage1","ressources/png/petitNuage1.png")
    .add("mNuage1","ressources/png/moyenNuage1.png")
    .add("gNuage1","ressources/png/grandNuage1.png")
    .add("gNuage2","ressources/png/grandNuage2.png")
    .add("gNuage3","ressources/png/grandNuage3.png")
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
    var game = ScenesManager.createScene('game',UnicornScene);
    var menu = ScenesManager.createScene('menu',MenuScene);
    var mort = ScenesManager.createScene('mort',MortScene);
    ScenesManager.goToScene('menu');
}
// 

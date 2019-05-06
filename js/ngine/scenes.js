export class Scene extends PIXI.Container{
    constructor(){
        super();
        this.paused = false;
    }

    update() {
        // Do what tu veux ici...
    }
    
    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    isPaused() {
        return this.paused;
    }    
}

export class ScenesManager {
    static scenes = {}; // should be hashmap but a JS object is fine too :);
    static currentScene;
    static renderer = PIXI.IRenderer;
    static width;
    static height;
    static ressources;

    constructor(){
    }

    static create(width, height,resources, color) {
        if (ScenesManager.renderer) return this;

        ScenesManager.width = width;
        ScenesManager.height = height;
        ScenesManager.resources = resources;

        ScenesManager.renderer = PIXI.autoDetectRenderer(width, height,{backgroundColor : color});
        document.body.appendChild(ScenesManager.renderer.view);
        requestAnimationFrame(ScenesManager.loop);
        return this;
    }

    static loop() {
        requestAnimationFrame(function () { ScenesManager.loop() });

        if (!ScenesManager.currentScene || ScenesManager.currentScene.isPaused()) return;
        ScenesManager.currentScene.update();
        ScenesManager.renderer.render(ScenesManager.currentScene);
    }

    static goToScene(id) {

        if (ScenesManager.scenes[id]) {
            if (ScenesManager.currentScene) ScenesManager.currentScene.pause();
            ScenesManager.currentScene = ScenesManager.scenes[id];
            ScenesManager.currentScene.resume();
            return true;
        }
        return false;
    }

    static createScene(id, sceneObject) {
        if (ScenesManager.scenes[id]) return undefined;

        var scene = new sceneObject(this.width,this.height);
        ScenesManager.scenes[id] = scene;

        return scene;
    }

    static goToScene(id) {

        if (ScenesManager.scenes[id]) {
            if (ScenesManager.currentScene) ScenesManager.currentScene.pause();
            ScenesManager.currentScene = ScenesManager.scenes[id];
            ScenesManager.currentScene.resume();
            return true;
        }
        return false;
    }    
 }

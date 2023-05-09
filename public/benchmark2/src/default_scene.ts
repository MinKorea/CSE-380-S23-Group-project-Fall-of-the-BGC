/* #################### IMPORTS #################### */
// Import from Wolfie2D or your own files here
import Vec2 from "./Wolfie2D/DataTypes/Vec2";
import Input from "./Wolfie2D/Input/Input";
import Graphic from "./Wolfie2D/Nodes/Graphic";
import { GraphicType } from "./Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "./Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "./Wolfie2D/Scene/Scene";
import Color from "./Wolfie2D/Utils/Color";


/* #################### CLASS DEFINITION #################### */

// Welcome to Wolfie2D!
// This is a simple sample scene so something displays when you run the game.
export default class default_scene extends Scene {
    /* ########## MEMBER DEFINITIONS ##########*/

    /* ########## BUILT-IN FUNCTIONS ########## */
    // The following are built-in abstract Scene functions you are meant to extend.
    // They represent the lifecycle of a Scene, and thus allow you to load and start your scene

    // loadScene() is where you should load initial assets needed for your scene.
    // it is called strictly before startScene, so you are assured all assets will be loaded before
    // the scene begins
    loadScene(): void {
        this.load.tilemap("map", "demo_assets/tilemaps/test2.json");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        this.add.tilemap("map");
        
    }

    // updateScene() is where you can handle any frame by frame updates to your scene.
    // For the most part, GameNode logic can be abstracted to AI, but there may be
    // things you want to control for the whole scene, like player score.
    // The argument to updateScene is the time step of the update frame
    updateScene(deltaT: number): void {
        let map = this.getTilemap("Tile Layer 1");
        
        if (Input.isMouseJustPressed(0)) {
            let pos = Input.getMousePressPosition();
            let mapPos = map.getTilemapPosition(pos.x, pos.y);
        }
    }
}
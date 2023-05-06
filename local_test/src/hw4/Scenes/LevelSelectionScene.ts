import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainHW4Scene from "./MainHW4Scene";
import MainMenu from "./MainMenu";


export const LevelSelectionSceneLayers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI"
} as const;

export default class LevelSelectionScene extends Scene {
    public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw4_assets/sprites/Levels-Selection-Screen.png"

    private bg1: Sprite;

    public loadScene(){
        this.load.image(LevelSelectionScene.BACKGROUND_KEY, LevelSelectionScene.BACKGROUND_PATH);
    }

    public startScene(){
        const center = this.viewport.getCenter();


        this.addLayer(LevelSelectionSceneLayers.BACKGROUND, 0);
		this.initBackground();

        this.addLayer(LevelSelectionSceneLayers.PRIMARY, 5);

        // this.helpMenu = this.addUILayer("helpMenu");


        // const header = <Label>this.add.uiElement(UIElementType.LABEL, "helpMenu", {position: new Vec2(center.x, center.y - 250), text: "Help Screen"});
        // header.textColor = Color.WHITE;
        // "Back Story:  The Bad Guys Corporation(BGC) has done lots of very very\nbad things whatever you imagine. And the boss overworks \n his employees every day. The Smith bros and employees\noverworked every day got suddenly kicked out from the \nBGC. So, the family requests the Good Guys Corporation\n(GGC) to get their money back. The Player, whose name is \nGood Guy Lukas, has been given a mission by the GGC to \ntake down the BGC."
        // const backstory = <Label>this.add.uiElement(UIElementType.LABEL, "helpMenu", {position: new Vec2(center.x, center.y - 50), text: "Back Story:  The Bad Guys Corporation(BGC) has done lots of very very\nbad things whatever you imagine. And the boss overworks \n his employees every day. The Smith bros and employees\noverworked every day got suddenly kicked out from the \nBGC. So, the family requests the Good Guys Corporation\n(GGC) to get their money back. The Player, whose name is \nGood Guy Lukas, has been given a mission by the GGC to \ntake down the BGC."});
        // backstory.textColor = Color.WHITE;
        // const ad = <Label>this.add.uiElement(UIElementType.LABEL, "helpMenu", {position: new Vec2(center.x, center.y), text: "-Press A and D to to move left and right respectively"});
        // ad.textColor = Color.WHITE;
        // const click = <Label>this.add.uiElement(UIElementType.LABEL, "helpMenu", {position: new Vec2(center.x, center.y + 50), text: "-Click to shoot bullets"});
        // click.textColor = Color.WHITE;
        // const shift = <Label>this.add.uiElement(UIElementType.LABEL, "helpMenu", {position: new Vec2(center.x, center.y + 100), text: "-Press shift to speed up, however you cannot shoot bullets"});
        // shift.textColor = Color.WHITE
        // const shift2 = <Label>this.add.uiElement(UIElementType.LABEL, "helpMenu", {position: new Vec2(center.x, center.y + 150), text: "while moving faster"});
        // shift2.textColor = Color.WHITE;

        // Back Button
        const back = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 600, center.y + 420), text: ""});
        back.size.set(600, 50);
        back.borderWidth = 2;
        back.borderColor = Color.TRANSPARENT;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "mainmenu";
        // 

        // Lvl 1 Button
        const lvl1Button = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 5, center.y + 268), text: ""});
        lvl1Button.size.set(370, 67);
        lvl1Button.borderWidth = 2;
        lvl1Button.borderColor = Color.TRANSPARENT;
        lvl1Button.backgroundColor = Color.TRANSPARENT;
        lvl1Button.onClickEventId = "level1";
        //

        // Lvl 2 Button
        const lvl2Button = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 5, center.y + 192), text: ""});
        lvl2Button.size.set(370, 67);
        lvl2Button.borderWidth = 2;
        lvl2Button.borderColor = Color.TRANSPARENT;
        lvl2Button.backgroundColor = Color.TRANSPARENT;
        lvl2Button.onClickEventId = "level2";
        //

         // Lvl 3 Button
         const lvl3Button = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 5, center.y + 116), text: ""});
         lvl3Button.size.set(370, 67);
         lvl3Button.borderWidth = 2;
         lvl3Button.borderColor = Color.TRANSPARENT;
         lvl3Button.backgroundColor = Color.TRANSPARENT;
         lvl3Button.onClickEventId = "level3";
         //

         // 40

         // Lvl 4 Button
         const lvl4Button = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 5, center.y + 40), text: ""});
         lvl4Button.size.set(370, 67);
         lvl4Button.borderWidth = 2;
         lvl4Button.borderColor = Color.TRANSPARENT;
         lvl4Button.backgroundColor = Color.TRANSPARENT;
         lvl4Button.onClickEventId = "level4";
         //

         // -36

         // Lvl 5 Button
         const lvl5Button = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 5, center.y - 36), text: ""});
         lvl5Button.size.set(370, 67);
         lvl5Button.borderWidth = 2;
         lvl5Button.borderColor = Color.TRANSPARENT;
         lvl5Button.backgroundColor = Color.TRANSPARENT;
         lvl5Button.onClickEventId = "level5";
         //

          // Lvl 5 Button
          const finalLvlButton = this.add.uiElement(UIElementType.BUTTON, LevelSelectionSceneLayers.PRIMARY, {position: new Vec2(center.x - 5, center.y - 122), text: ""});
          finalLvlButton.size.set(230, 63);
          finalLvlButton.borderWidth = 2;
          finalLvlButton.borderColor = Color.TRANSPARENT;
          finalLvlButton.backgroundColor = Color.TRANSPARENT;
          finalLvlButton.onClickEventId = "final";
          //

        this.receiver.subscribe("mainmenu");
        this.receiver.subscribe("level1");
        this.receiver.subscribe("level2");
        this.receiver.subscribe("level3");
        this.receiver.subscribe("level4");
        this.receiver.subscribe("level5");
        this.receiver.subscribe("final");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }

        if(Input.isKeyPressed("1")){
            this.sceneManager.changeToScene(MainHW4Scene);
         }
    }

    protected initBackground(): void {
		this.bg1 = this.add.sprite(LevelSelectionScene.BACKGROUND_KEY, LevelSelectionSceneLayers.BACKGROUND);
		// this.bg1.scale.set(1, 1.15);
		this.bg1.position.copy(this.viewport.getCenter());

        // this.bg2 = this.add.sprite(SplashScreen.BACKGROUND_KEY, SplashScreenLayers.BACKGROUND);
		// this.bg2.scale.set(1.5, 1.5);
		// this.bg2.position = this.bg1.position.clone();
		// this.bg2.position.add(this.bg1.sizeWithZoom.scale(2, 0));

	}


    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "mainmenu": {
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case "level1": {
                console.log("Goto lvl1");  
                this.sceneManager.changeToScene(MainHW4Scene);
                break;
            }
            case "level2": {
                console.log("Goto lvl2");  
               // TODO Change scene to lvl 2
                break;
            }
            case "level3": {
                console.log("Goto lvl3");  
                // TODO Change scene to lvl 3
                 break;
             }
             case "level4": {
                console.log("Goto lvl4");  
                // TODO Change scene to lvl 4
                 break;
             }
             case "level5": {
                console.log("Goto lvl5");  
                // TODO Change scene to lvl 5
                 break;
             }
             case "final": {
                console.log("Goto final lvl");  
                // TODO Change scene to final level
                 break;
             }
        }
    }
}
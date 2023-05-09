import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
// import MainHW4Scene from "./MainHW4Scene";
import MainMenu from "./MainMenu";
import testScene from "./Level1Scene";
import Level1Scene from "./Level1Scene";

export const ControlsSceneLayers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI"
} as const;



export default class ControlsScene extends Scene {
    public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw4_assets/sprites/Controls-Screen.png"

    private bg1: Sprite;

    public loadScene(){
        this.load.image(ControlsScene.BACKGROUND_KEY, ControlsScene.BACKGROUND_PATH);
    }

    public startScene(){
        const center = this.viewport.getCenter();


        this.addLayer(ControlsSceneLayers.BACKGROUND, 0);
		this.initBackground();

        this.addLayer(ControlsSceneLayers.PRIMARY, 5);

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

        const back = this.add.uiElement(UIElementType.BUTTON, ControlsSceneLayers.PRIMARY, {position: new Vec2(center.x - 595, center.y + 415), text: ""});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.TRANSPARENT;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "mainmenu";

        this.receiver.subscribe("mainmenu");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }

    }

    protected initBackground(): void {
		this.bg1 = this.add.sprite(ControlsScene.BACKGROUND_KEY, ControlsSceneLayers.BACKGROUND);
		// this.bg1.scale.set(.75, .75);
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
        }
    }


}


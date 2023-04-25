import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainHW4Scene from "./MainHW4Scene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AstarDemoScene from "./AstarDemoScene";
import GuardDemoScene from "./GuardDemoScene";
import HelpScene from "./HelpScene";
import ControlsScene from "./ControlsScene";
import LevelSelectionScene from "./LevelSelectionScene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export const MainMenuLayers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI"
} as const;


export default class MainMenu extends Scene {

    public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw4_assets/sprites/Main-Menu.png"

    private bg1: Sprite;

    
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    public loadScene(){
        this.load.image(MainMenu.BACKGROUND_KEY, MainMenu.BACKGROUND_PATH);
    }

    public startScene(){
        // let a = new Vec2(660,440);
        // this.viewport.setCenter(a);
        // const center = a;

        // console.log(center);
        
        const center = this.viewport.getCenter();

        // this.viewport.setCenter(center);
        // let a = new Vec2(660,440)
        // this.viewport.setCenter(660, 440);

        this.addLayer(MainMenuLayers.BACKGROUND, 0);
		this.initBackground();

        this.addLayer(MainMenuLayers.PRIMARY, 5);

        // The main menu
        // this.mainMenu = this.addUILayer("mainMenu");

        const play = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.PRIMARY, {position: new Vec2(center.x + 2, center.y + 335), text: ""});
        play.size.set(180, 210);
        play.borderWidth = 2;
        play.borderColor = Color.TRANSPARENT;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const help = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.PRIMARY, {position: new Vec2(center.x + 242, center.y + 230), text: ""});
        help.size.set(230, 430);
        help.borderWidth = 2;
        help.borderColor = Color.TRANSPARENT;
        help.backgroundColor = Color.TRANSPARENT;
        help.onClickEventId = "help";

        const controls = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.PRIMARY, {position: new Vec2(center.x - 238, center.y + 230), text: ""});
        controls.size.set(230, 430);
        controls.borderWidth = 2;
        controls.borderColor = Color.TRANSPARENT;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "controls";

        const level = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.PRIMARY, {position: new Vec2(center.x, center.y - 225), text: ""});
        level.size.set(705, 470);
        level.borderWidth = 2;
        level.borderColor = Color.TRANSPARENT;
        level.backgroundColor = Color.TRANSPARENT;
        level.onClickEventId = "level";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("help");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("level");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected initBackground(): void {
        const center = this.viewport.getCenter();

		this.bg1 = this.add.sprite(MainMenu.BACKGROUND_KEY, MainMenuLayers.BACKGROUND);
		// this.bg1.scale.set(1, 1.15);
        // this.viewport.setCenter(660, 440);
		this.bg1.position.copy(center);

        // this.bg2 = this.add.sprite(SplashScreen.BACKGROUND_KEY, SplashScreenLayers.BACKGROUND);
		// this.bg2.scale.set(1.5, 1.5);
		// this.bg2.position = this.bg1.position.clone();
		// this.bg2.position.add(this.bg1.sizeWithZoom.scale(2, 0));

	}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MainHW4Scene);
                break;
            }
            case "help": {
                this.sceneManager.changeToScene(HelpScene);
                break;
            }
            case "controls": {
                this.sceneManager.changeToScene(ControlsScene);
                break;
            }
            case "level": {
                this.sceneManager.changeToScene(LevelSelectionScene);
                break;
            }
        }
    }
}
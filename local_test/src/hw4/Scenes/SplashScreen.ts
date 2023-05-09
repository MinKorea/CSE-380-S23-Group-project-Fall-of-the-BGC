import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import testMenu from "./MainMenu";

export const SplashScreenLayers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI"
} as const;


export default class SplashScreen extends Scene {

    public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw4_assets/sprites/Splash-Screen.png"


    private bg1: Sprite;
    private bg2: Sprite;


    public loadScene(){
        this.load.image(SplashScreen.BACKGROUND_KEY, SplashScreen.BACKGROUND_PATH);

    }

    public startScene(){

        const center = this.viewport.getCenter();

        this.addLayer(SplashScreenLayers.BACKGROUND, 0);
		this.initBackground();

        this.addLayer(SplashScreenLayers.PRIMARY, 5);

        const play = this.add.uiElement(UIElementType.BUTTON, SplashScreenLayers.PRIMARY, {position: new Vec2(center.x, center.y + 475), text: ""});
        play.size.set(1320, 2000);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "mainmenu";

        this.receiver.subscribe("mainmenu");
        
        
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected initBackground(): void {
		this.bg1 = this.add.sprite(SplashScreen.BACKGROUND_KEY, SplashScreenLayers.BACKGROUND);
		// this.bg1.scale.set(1.75, 1.2);
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
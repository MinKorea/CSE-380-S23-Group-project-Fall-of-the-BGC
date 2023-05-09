import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
// import MainHW4Scene from "./MainHW4Scene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
// import AstarDemoScene from "./AstarDemoScene";
// import GuardDemoScene from "./GuardDemoScene";
import HelpScene from "./HelpScene";
import ControlsScene from "./ControlsScene";
import LevelSelectionScene from "./LevelSelectionScene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import testScene from "./Level1Scene";
import Level1Scene from "./Level1Scene";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import LastScene from "./LastScene";
import Level2Scene from "./Level2Scene";
import Level3Scene from "./Level3Scene";
import Level4Scene from "./Level4Scene";
import Level5Scene from "./Level5Scene";

export const MainMenuLayers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI",
    CONTROLS: "CONTROLS",
    HELP: "HELP",
    LEVELSELECT: "LEVELSELECT"
} as const;


export default class MainMenu extends Scene {

    public static BACKGROUND_KEY = "BACKGROUND"
    public static BACKGROUND_PATH = "hw4_assets/sprites/Main-Menu.png"

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/FalloftheBGCMainMenu.mp3";

    private bg1: Sprite;

    protected helpImage: Sprite;
    protected controlsImage: Sprite;
    protected levelSelectImage: Sprite;

    public static HELP_KEY = "HELP";
    public static HELP_PATH = "hw4_assets/sprites/Help-Screen.png";

    public static CONTROLS_KEY = "CONTROLS"
    public static CONTROLS_PATH = "hw4_assets/sprites/Controls-Screen.png"

    
    public static LEVELSELECT_KEY = "LEVELSELECT"
    public static LEVELSELECT_PATH = "hw4_assets/sprites/Levels-Selection-Screen.png"

    
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    public loadScene(){
        this.load.image(MainMenu.BACKGROUND_KEY, MainMenu.BACKGROUND_PATH);
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);

        this.load.image(MainMenu.HELP_KEY, MainMenu.HELP_PATH);
        this.load.image(MainMenu.CONTROLS_KEY, MainMenu.CONTROLS_PATH);
        this.load.image(MainMenu.LEVELSELECT_KEY, MainMenu.LEVELSELECT_PATH);
    }

    public startScene(){
        console.log(this.viewport.getCenter());
        
        let a = new Vec2(660,440);
        this.viewport.setCenter(a);
        // const center = a;

        // console.log(center);
        
        const center = this.viewport.getCenter();

        // this.viewport.setCenter(center);
        // let a = new Vec2(660,440)
        // this.viewport.setCenter(660, 440);

        this.addLayer(MainMenuLayers.BACKGROUND, 0);
		this.initBackground();

        this.addLayer(MainMenuLayers.PRIMARY, 5);

        this.addLayer(MainMenuLayers.CONTROLS, 6);
        this.addLayer(MainMenuLayers.HELP, 6);
        this.addLayer(MainMenuLayers.LEVELSELECT, 6);

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

        let controlsLayer = this.getLayer("CONTROLS");

        this.controlsImage = this.add.sprite(MainMenu.CONTROLS_KEY, controlsLayer.getName());
        this.controlsImage.position.copy(this.viewport.getCenter());
        // this.controlsImage.alpha = 0.5;

        const controlsBackButton = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.CONTROLS, {position: new Vec2(center.x - 595, center.y + 415), text: ""});
        controlsBackButton.size.set(200, 50);
        controlsBackButton.borderWidth = 2;
        controlsBackButton.borderColor = Color.TRANSPARENT;
        controlsBackButton.backgroundColor = Color.TRANSPARENT;
        controlsBackButton.onClickEventId = "backcontrols";

        controlsLayer.setPaused(true);
        controlsLayer.setHidden(true);

        // 
        let helpLayer = this.getLayer("HELP");

        this.helpImage = this.add.sprite(MainMenu.HELP_KEY, helpLayer.getName());
        this.helpImage.position.copy(this.viewport.getCenter());
        // this.helpImage.alpha = 0.5;

        const helpBackButton = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.HELP, {position: new Vec2(center.x - 595, center.y + 415), text: ""});
        helpBackButton.size.set(200, 50);
        helpBackButton.borderWidth = 2;
        helpBackButton.borderColor = Color.TRANSPARENT;
        helpBackButton.backgroundColor = Color.TRANSPARENT;
        helpBackButton.onClickEventId = "helpcontrols";

        helpLayer.setPaused(true);
        helpLayer.setHidden(true);


        let LevelSelectLayer = this.getLayer("LEVELSELECT");

        this.levelSelectImage = this.add.sprite(MainMenu.LEVELSELECT_KEY, LevelSelectLayer.getName());
        this.levelSelectImage.position.copy(this.viewport.getCenter());

         // Back Button
         const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 600, center.y + 420), text: ""});
         back.size.set(600, 50);
         back.borderWidth = 2;
         back.borderColor = Color.TRANSPARENT;
         back.backgroundColor = Color.TRANSPARENT;
         back.onClickEventId = "mainmenu";
         // 
 
         // Lvl 1 Button
         const lvl1Button = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 5, center.y + 268), text: ""});
         lvl1Button.size.set(370, 67);
         lvl1Button.borderWidth = 2;
         lvl1Button.borderColor = Color.TRANSPARENT;
         lvl1Button.backgroundColor = Color.TRANSPARENT;
         lvl1Button.onClickEventId = "level1";
         //
 
         // Lvl 2 Button
         const lvl2Button = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 5, center.y + 192), text: ""});
         lvl2Button.size.set(370, 67);
         lvl2Button.borderWidth = 2;
         lvl2Button.borderColor = Color.TRANSPARENT;
         lvl2Button.backgroundColor = Color.TRANSPARENT;
         lvl2Button.onClickEventId = "level2";
         //
 
          // Lvl 3 Button
          const lvl3Button = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 5, center.y + 116), text: ""});
          lvl3Button.size.set(370, 67);
          lvl3Button.borderWidth = 2;
          lvl3Button.borderColor = Color.TRANSPARENT;
          lvl3Button.backgroundColor = Color.TRANSPARENT;
          lvl3Button.onClickEventId = "level3";
          //
 
          // 40
 
          // Lvl 4 Button
          const lvl4Button = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 5, center.y + 40), text: ""});
          lvl4Button.size.set(370, 67);
          lvl4Button.borderWidth = 2;
          lvl4Button.borderColor = Color.TRANSPARENT;
          lvl4Button.backgroundColor = Color.TRANSPARENT;
          lvl4Button.onClickEventId = "level4";
          //
 
          // -36
 
          // Lvl 5 Button
          const lvl5Button = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 5, center.y - 36), text: ""});
          lvl5Button.size.set(370, 67);
          lvl5Button.borderWidth = 2;
          lvl5Button.borderColor = Color.TRANSPARENT;
          lvl5Button.backgroundColor = Color.TRANSPARENT;
          lvl5Button.onClickEventId = "level5";
          //
 
           // Lvl 5 Button
           const finalLvlButton = this.add.uiElement(UIElementType.BUTTON, MainMenuLayers.LEVELSELECT, {position: new Vec2(center.x - 5, center.y - 122), text: ""});
           finalLvlButton.size.set(230, 63);
           finalLvlButton.borderWidth = 2;
           finalLvlButton.borderColor = Color.TRANSPARENT;
           finalLvlButton.backgroundColor = Color.TRANSPARENT;
           finalLvlButton.onClickEventId = "final";
           //

           LevelSelectLayer.setPaused(true);
           LevelSelectLayer.setHidden(true);
 
         this.receiver.subscribe("mainmenu");
         this.receiver.subscribe("level1");
         this.receiver.subscribe("level2");
         this.receiver.subscribe("level3");
         this.receiver.subscribe("level4");
         this.receiver.subscribe("level5");
         this.receiver.subscribe("final");

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("help");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("level");
        this.receiver.subscribe("backcontrols");
        this.receiver.subscribe("helpcontrols");

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
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
                // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
                this.sceneManager.changeToScene(Level1Scene);
                break;
            }
            case "help": {
                this.helpImage.position.copy(this.viewport.getCenter());
                // this.pausePauseLayer();
                this.pausePrimaryLayer();
                this.pauseBackgroundLayer();                
                this.unpauseHelpLayer();
                break;
            }
            case "controls": {
                // this.sceneManager.changeToScene(ControlsScene);
                this.pausePrimaryLayer();
                this.pauseBackgroundLayer();  
                this.unpauseControlsLayer();
                break;
            }
            case "backcontrols": {
                this.unpausePrimaryLayer();
                this.unpauseBackgroundLayer();  
                this.pauseControlsLayer();
                break;
            }
            case "helpcontrols": {
                // this.unpausePauseLayer();
                this.unpausePrimaryLayer();
                this.unpauseBackgroundLayer();  
                this.pauseHelpLayer();
                break;
            }
            case "level": {
                // this.sceneManager.changeToScene(LevelSelectionScene);
                this.pausePrimaryLayer();
                this.pauseBackgroundLayer();  
                this.unpauseLevelSelectLayer();
                break;
            }
            case "level1": {
                console.log("Goto lvl1");  
                this.sceneManager.changeToScene(Level1Scene);
                break;
            }
            case "level2": {
                console.log("Goto lvl2");  
                this.sceneManager.changeToScene(Level2Scene);
               // TODO Change scene to lvl 2
                break;
            }
            case "level3": {
                console.log("Goto lvl3");  
                this.sceneManager.changeToScene(Level3Scene);
                // TODO Change scene to lvl 3
                 break;
             }
             case "level4": {
                console.log("Goto lvl4");
                this.sceneManager.changeToScene(Level4Scene);  
                // TODO Change scene to lvl 4
                 break;
             }
             case "level5": {
                console.log("Goto lvl5");  
                this.sceneManager.changeToScene(Level5Scene);  
                // TODO Change scene to lvl 5
                 break;
             }
             case "final": {
                console.log("Goto final lvl");  
                this.sceneManager.changeToScene(LastScene);
                // TODO Change scene to final level
                 break;
             }
             case "mainmenu": {
                // this.sceneManager.changeToScene(MainMenu);
                this.unpausePrimaryLayer();
                this.unpauseBackgroundLayer();  
                this.pauseLevelSelectLayer();
                break;
            }
        }
    }

    protected pausePrimaryLayer(): void {
        let primaryLayer = this.getLayer("PRIMARY");
        primaryLayer.setPaused(true);
        primaryLayer.setHidden(true);
    }
    
    protected unpausePrimaryLayer(): void {
        let primaryLayer = this.getLayer("PRIMARY");
        primaryLayer.setPaused(false);
        primaryLayer.setHidden(false);
    }

    protected pauseBackgroundLayer(): void {
        let backgroundLayer = this.getLayer("BACKGROUND");
        backgroundLayer.setPaused(true);
        backgroundLayer.setHidden(true);
    }
    
    protected unpauseBackgroundLayer(): void {
        let backgroundLayer = this.getLayer("BACKGROUND");
        backgroundLayer.setPaused(false);
        backgroundLayer.setHidden(false);
    }


    protected pauseHelpLayer(): void {
        let helpLayer = this.getLayer("HELP");
        helpLayer.setPaused(true);
        helpLayer.setHidden(true);
    }
    
    protected unpauseHelpLayer(): void {
        let helpLayer = this.getLayer("HELP");
        helpLayer.setPaused(false);
        helpLayer.setHidden(false);
    }

    protected pauseControlsLayer(): void {
        let controlsLayer = this.getLayer("CONTROLS");
        controlsLayer.setPaused(true);
        controlsLayer.setHidden(true);
    }
    
    protected unpauseControlsLayer(): void {
        let controlsLayer = this.getLayer("CONTROLS");
        controlsLayer.setPaused(false);
        controlsLayer.setHidden(false);
    }

    protected pauseLevelSelectLayer(): void {
        let levelSelectLayer = this.getLayer("LEVELSELECT");
        levelSelectLayer.setPaused(true);
        levelSelectLayer.setHidden(true);
    }
    
    protected unpauseLevelSelectLayer(): void {
        let levelSelectLayer = this.getLayer("LEVELSELECT");
        levelSelectLayer.setPaused(false);
        levelSelectLayer.setHidden(false);
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }
}
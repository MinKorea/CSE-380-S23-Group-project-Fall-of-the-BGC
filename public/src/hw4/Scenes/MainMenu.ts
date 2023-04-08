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

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    public loadScene(){}

    public startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");

        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const astar = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "A* Test Scene"});
        astar.size.set(200, 50);
        astar.borderWidth = 2;
        astar.borderColor = Color.WHITE;
        astar.backgroundColor = Color.TRANSPARENT;
        astar.onClickEventId = "astar";

        const guard = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Guard demo"});
        guard.size.set(200, 50);
        guard.borderWidth = 2;
        guard.borderColor = Color.WHITE;
        guard.backgroundColor = Color.TRANSPARENT;
        guard.onClickEventId = "guard";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("astar");
        this.receiver.subscribe("guard");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MainHW4Scene);
                break;
            }
            case "astar": {
                this.sceneManager.changeToScene(AstarDemoScene);
                break;
            }
            case "guard": {
                this.sceneManager.changeToScene(GuardDemoScene);
                break;
            }
        }
    }
}
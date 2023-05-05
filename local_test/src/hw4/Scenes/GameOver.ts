import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {


    public loadScene(){
       
    }


    startScene() {
        const center = this.viewport.getCenter();

        this.viewport.setZoomLevel(1);

        this.addUILayer("primary");

        const gameOver = <Label>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y), text: "Game Over"});
        gameOver.size.set(1320, 2000);
        gameOver.borderWidth = 2;
        gameOver.borderColor = Color.WHITE;
        gameOver.backgroundColor = Color.TRANSPARENT;
        gameOver.onClickEventId = "mainmenu";

        this.receiver.subscribe("mainmenu")
    }


    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
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
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerAnimationType, PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class Idle extends PlayerState {

    public override onEnter(options: Record<string, any>): void {
        this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.IDLE, true);
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        if (!this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}
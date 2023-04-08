import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import PlayerActor from "../../../Actors/PlayerActor";
import PlayerAI from "../PlayerAI";
import PlayerState, { PlayerStateType } from "./PlayerState";

export default class Invincible extends PlayerState {

    protected timer: Timer;

    constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent, owner);
        this.timer = new Timer(100, () => this.finished(PlayerStateType.IDLE));
    }

    public override update(deltaT: number): void {}

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public override onEnter(options: Record<string, any>): void {
        this.timer.start();
    }

    public override onExit(): Record<string, any> { 
        return {};
    }
}
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerEvent } from "../../../Events";
import PlayerState from "./PlayerState";

/**
 * The Dead state for the PlayerAI. While the player is in the "Dead" state, the player does not
 * get updated and all incoming events to the PlayerAI are ignored.
 */
export default class Dead extends PlayerState {

    /**
     * When the PlayerAI enters the dead state, an event is fired to alert the system
     * that the player is officially dead.
     */
    onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(PlayerEvent.PLAYER_KILLED);
    }

    /**
     * The input handler for the dead state ignores all incoming events to the player. 
     * @param event 
     */
    handleInput(event: GameEvent): void { }

    /**
     * Similar to the handleInput method, while in the dead state, the PlayerAI doesn't
     * get updated.
     * @param deltaT 
     */
    update(deltaT: number): void { }

    onExit(): Record<string, any> { return {} }

}
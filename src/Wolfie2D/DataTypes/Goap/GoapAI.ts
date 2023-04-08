import GameEvent from "../../Events/GameEvent";
import GameNode from "../../Nodes/GameNode";
import Queue from "../Collections/Queue";
import Stack from "../Collections/Stack";
import AI from "../Interfaces/AI";
import GoapAction from "./GoapAction";
import Updateable from "../Interfaces/Updateable";

/**
 * Defines a controller for a bot or a human. Must be able to update
 */
export default interface GoapAI extends AI {
    /** Current goal of the AI */
    get goal(): string;

    /** All current statuses this AI has */
    get currentStatus(): Array<string>;

    /** All possible actions that can be carried out */
    get possibleActions(): Array<GoapAction>;

    /** Current actions to be carried out */
    get plan(): Stack<GoapAction>;

    /** Clears references from to the owner */
    destroy(): void;

    /** Activates this AI from a stopped state and allows variables to be passed in */
    activate(options: Record<string, any>): void;

    /** Handles events from the Actor */
    handleEvent(event: GameEvent): void;

    /** Initializes the AI with the actor and any additional config */
    initializeAI(owner:GameNode, options: Record<string, any>): void
}
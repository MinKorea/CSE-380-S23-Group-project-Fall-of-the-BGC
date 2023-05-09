import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";

export default interface GoapAction {

    /** Cost it takes to complete this action */
    get cost(): number;

    /** Preconditions that have to be satisfied for an action to happen */
    get preconditions(): Array<string>;

    /** Resulting statuses after this action completes */
    get effects(): Array<string>;

    /**
     * Attempt to perform an action, if successful, it will return an array of the expected effects, otherwise it will return null
     * @param statuses Current statuses of the actor
     * @param actor GameNode for the actor
     * @param deltaT The time sine the last update
     * @param target GameNode for a optional target
     */
    performAction(ai: AI): GoapActionStatus;

    reset(ai: AI): void;

    /** 
     * Updates this action - you can use this method to update the effects, preconditions and cost 
     * of the action before creating a new plan.
     */
    update(ai: AI): void;

    /** Check preconditions with current statuses to see if action can be performed */
    checkPreconditions(ai: AI, statuses: string[]): boolean;

}

export enum GoapActionStatus {
    SUCCESS = 0,
    RUNNING = 1,
    FAILURE = 2
}

import IdleAction from "../NPCActions/GotoAction";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/FalseStatus";



/**
 * Idle behavior for an NPC. The idle behavior can be given to an NPC to tell it to do... nothing!
 */
export default class IdleBehavior extends NPCBehavior  {

    /** The GameNode that owns this NPCGoapAI */
    protected override owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;

        // Add the goal status
        this.addStatus("goal", new GoalReached());

        // Add the idle action
        let idle = new IdleAction(this, this.owner);
        idle.addEffect("goal");
        idle.cost = 100;
        this.addState("idle", idle);

        // Set the goal to idle
        this.goal = "goal";
    
        this.initialize();
    }

}
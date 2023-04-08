import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Finder from "../../../GameSystems/Searching/Finder";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import NavigationPath from "../../../../Wolfie2D/Pathfinding/NavigationPath";

/**
 * An abstract GoapAction for an NPC. All NPC actions consist of doing three things:
 * 
 *  1. Selecting some target/location
 *  2. Going to or moving within range of the selected target
 *  3. Doing something at the target location
 * 
 * The abstract NPC action takes care of the first two parts (selecting the target and moving to the target location). All
 * concrete implementations of the NPCAction will have to implement the abstract method performAction() which
 * gets called when the NPC reaches the target location.
 */
export default abstract class NPCAction extends GoapAction {

    protected parent: NPCBehavior;
    protected actor: NPCActor;

    // The targeting strategy used for this GotoAction - determines how the target is selected basically
    protected _targetFinder: Finder<TargetableEntity>;
    // The targets or Targetable entities 
    protected _targets: TargetableEntity[];
    // The target we are going to set the actor to target
    protected _target: TargetableEntity | null;
    // The path from the NPC to the target
    protected _path: NavigationPath | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.targetFinder = new BasicFinder();
        this.targets = [];
        this.target = null;
        this.path = null;
    }

    public onEnter(options: Record<string, any>): void {
        // Select the target location where the NPC should perform the action
        this.target = this.targetFinder.find(this.targets);

        // If we found a target, set the NPCs target to the target and find a path to the target
        if (this.target !== null) {
            // Set the actors current target to be the target for this action
            this.actor.setTarget(this.target);
            // Construct a path from the actor to the target
            this.path = this.actor.getPath(this.actor.position, this.target.position);
        }
    }

    public update(deltaT: number): void {
        if (this.target !== null && this.path !== null && !this.path.isDone()) {
            if (this.actor.atTarget()) {
                this.performAction(this.target);
            } else {
                this.actor.moveOnPath(this.actor.speed*deltaT*10, this.path)
            }
        } else {
            this.finished();
        }
    }

    public abstract performAction(target: TargetableEntity): void;

    public onExit(): Record<string, any> {
        // Clear the actor's current target
        this.actor.clearTarget();
        // Clear the reference to the target and the path in the action
        this.target = null;
        this.path = null;
        return {};
    }

    public handleInput(event: GameEvent): void {
        switch (event.type) {
            default: {
                throw new Error(`Unhandled event caught in NPCAction! Event type: ${event.type}`);
            }
        }
    }

    public get targetFinder(): Finder<TargetableEntity> { return this._targetFinder; }
    public set targetFinder(finder: Finder<TargetableEntity>) { this._targetFinder = finder; }

    public get targets(): Array<TargetableEntity> { return this._targets; }
    public set targets(targets: Array<TargetableEntity>) { this._targets = targets; }

    public get target(): TargetableEntity | null { return this._target; }
    protected set target(target: TargetableEntity | null) { this._target = target; }

    protected set path(path: NavigationPath | null) { this._path = path; }
    protected get path(): NavigationPath | null { return this._path; }
}

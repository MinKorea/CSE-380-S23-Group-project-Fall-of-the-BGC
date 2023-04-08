import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import Item from "../../../GameSystems/ItemSystem/Item";
import Finder from "../../../GameSystems/Searching/Finder";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";

export default class PickupTargetedItem extends NPCAction {

    // The targeting strategy used for this GotoAction - determines how the target is selected basically
    protected override _targetFinder: Finder<Item>;
    // The targets or Targetable entities 
    protected override _targets: Item[];
    // The target we are going to set the actor to target
    protected _target: Item | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
    }

    public performAction(target: Item): void {
        if (target.inventory === null) {
            this.actor.inventory.add(target)
        }
        this.finished();
    }

    public handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public get targetFinder(): Finder<Item> { return this._targetFinder; }
    public set targetFinder(finder: Finder<Item>) { this._targetFinder = finder; }

    public get targets(): Array<Item> { return this._targets; }
    public set targets(targets: Array<Item>) { this._targets = targets; }

    public get target(): Item | null { return this._target; }
    protected set target(target: Item | null) { this._target = target; }

}
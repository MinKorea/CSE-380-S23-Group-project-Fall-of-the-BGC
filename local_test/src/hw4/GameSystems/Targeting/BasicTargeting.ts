import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import { TargetableEntity } from "./TargetableEntity";
import { TargetingEntity } from "./TargetingEntity";


export default class BasicTargeting implements TargetingEntity {

    protected owner: Unique;
    protected _target: TargetableEntity | null;

    constructor(owner: Unique) {
        this.owner = owner;
        this.target = null;
    }

    clearTarget(): void {
        if (this.target !== null) {
            this.target.removeTargeting(this);
        }
        this._target = null;
    }
    setTarget(targetable: TargetableEntity): void {
        if (this.target !== null) {
            this.target.removeTargeting(this);
        }
        this.target = targetable;
        this.target.addTargeting(this);
    }
    getTarget(): TargetableEntity {
        if (this.target === null) {
            throw new Error("Target not set!");
        }
        return this.target;
    }

    hasTarget(): boolean {
        return this.target !== null;
    }

    public get id(): number { return this.owner.id; }

    protected get target(): TargetableEntity | null { return this._target; }
    protected set target(target: TargetableEntity | null) { this._target = target; }
}
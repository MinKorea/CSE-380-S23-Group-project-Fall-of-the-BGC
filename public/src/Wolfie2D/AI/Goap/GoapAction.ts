import Actor from "../../DataTypes/Interfaces/Actor";
import State from "../../DataTypes/State/State";
import StateMachineGoapAI from "./StateMachineGoapAI";

export default abstract class GoapAction extends State {

    protected parent: StateMachineGoapAI<GoapAction>
    protected actor: Actor;

    protected _preconditions: Set<string>;
    protected _effects: Set<string>;
    protected _cost: number;

    public constructor(parent: StateMachineGoapAI<GoapAction>, actor: Actor) {
        super(parent);
        this.actor = actor;
        this._preconditions = new Set<string>();
        this._effects = new Set<string>();
        this._cost = 0;
    }

    /** Cost it takes to complete this action */
    get cost(): number { return this._cost; }
    set cost(cost: number) { this._cost = cost; }

    /** Preconditions that have to be satisfied for an action to happen */
    get preconditions(): string[] { return Array.from(this._preconditions.values()); };

    /** Resulting statuses after this action completes */
    get effects(): string[] { return Array.from(this._effects.values()); }

    public checkPreconditions(status: string[]): boolean {
        return Array.from(this._preconditions.values()).every(precondition => status.includes(precondition));
    }

    public addPrecondition(status: string): void {
        this._preconditions.add(status);
    }
    public addEffect(status: string): void {
        this._effects.add(status);
    }

    public override finished(): void {
        this.parent.changeState();
    }

}

export enum GoapActionStatus {
    FAILURE = 0,
    SUCCESS = 1,
    RUNNING = 2
}
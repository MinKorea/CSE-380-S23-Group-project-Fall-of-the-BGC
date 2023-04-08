import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../../../Actors/NPCActor";

export class HasHealth extends GoapState {

    protected actor: NPCActor;
    protected min: number;
    protected max: number;

    public constructor(actor: NPCActor, min: number, max: number) {
        super()
        this.actor = actor;
        this.min = min;
        this.max = max;
    }

    public isSatisfied(): boolean {
        return MathUtils.between(this.min, this.max, this.actor.health, true);
    }
    
}
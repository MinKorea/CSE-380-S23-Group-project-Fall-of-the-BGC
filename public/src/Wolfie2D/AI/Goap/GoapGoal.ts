import Actor from "../../DataTypes/Interfaces/Actor";
import GoapState from "./GoapState";

export default abstract class GoapGoal {

    private priority: number;
    private state: string[];

    constructor(state: string[]) {
        this.state = state;
    };

    public abstract isValid(actor: Actor): boolean;


}
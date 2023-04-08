import Actor from "../../DataTypes/Interfaces/Actor";

/**
 * A state for a GoapAI. The "state" is not the same as a state in a state machine, or something of that nature.
 */
export default abstract class GoapState {

    public abstract isSatisfied(): boolean;
    
}
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Actor from "../../../../Wolfie2D/DataTypes/Interfaces/Actor";

export default class FalseStatus extends GoapState {
    public isSatisfied(): boolean {
        return false;
    } 
    
}
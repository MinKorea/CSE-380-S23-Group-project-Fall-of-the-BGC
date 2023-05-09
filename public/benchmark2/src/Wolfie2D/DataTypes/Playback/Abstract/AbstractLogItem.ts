import LogItem from "../Interfaces/LogItem";

/**
 * An abstract implementation of a LogItem. This class is meant to be extended and contain additional information.
 * @author Peter Walsh
 */
export default abstract class AbstractLogItem implements LogItem  {

    /** The frame this LogItem was logged at */
    protected _frame: number;
    
    /** The amount of time that has passed since the previous frame */
    protected _deltaT: number;

    constructor(frame: number, deltaT: number) {
        this.frame = frame;
        this.deltaT = deltaT;
    }

    /** @see LogItem.frame */
    public get frame(): number { return this._frame; }

    /** @see LogItem.deltaT */
    public get deltaT(): number { return this._deltaT; }

    protected set frame(value: number) { this._frame = value; }
    protected set deltaT(value: number) { this._deltaT = value; }
    
}
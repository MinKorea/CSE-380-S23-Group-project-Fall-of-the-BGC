import Recorder from "../Interfaces/Recorder";
import AbstractLogItem from "./AbstractLogItem";
import AbstractRecording from "./AbstractRecording";
import Updateable from "../../Interfaces/Updateable";
/**
 * An abstract implementation of a Recorder. In order to define a Recorder for a custom Recording type, this class
 * must be extended.
 * 
 * @author Peter Walsh
 */
export default abstract class AbstractRecorder<T extends AbstractRecording<E>, E extends AbstractLogItem> implements Recorder<T, E> {

    protected _active: boolean;

    constructor() {
        this._active = false;
    }

    /** @see Recorder.active */
    public active(): boolean { return this._active; }

    /** @see Recorder.start */
    public abstract start(recording: T): void;

    /** @see Recorder.stop */
    public abstract stop(): void;

    /** 
     * Regardless of whether the playback system is recording or replaying a game, 
     * this method gets called to update the recorder.
     * 
     * @see Updateable.update
     */
    public abstract update(deltaT: number): void;
}
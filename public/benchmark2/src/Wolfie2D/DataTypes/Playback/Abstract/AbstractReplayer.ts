import Replayer from "../Interfaces/Replayer";
import AbstractLogItem from "./AbstractLogItem";
import AbstractRecording from "./AbstractRecording";

/**
 * An abstract implementation of a Replayer. In order to define a Replayer for a custom Recording type, this class
 * must be extended.
 * 
 * @author Peter Walsh
 */
export default abstract class AbstractReplayer<T extends AbstractRecording<E>, E extends AbstractLogItem> implements Replayer<T, E> {

    protected _active: boolean;

    constructor() {
        this._active = false;
    }

    /** @see Replayer.active */
    public active(): boolean { return this._active; }

    /** @see Replayer.start */
    public abstract start(recording: T, onEnd: () => void): void;

    /** @see Replayer.stop */
    public abstract stop(): void;

    /** 
     * Regardless of whether the playback system is recording or replaying a game, 
     * this method gets called to update the recorder.
     * 
     * @see Updateable.update
     */
    public abstract update(deltaT: number): void;
    
}
import Queue from "../../Collections/Queue";
import Recorder from "../Interfaces/Recorder";
import Recording from "../Interfaces/Recording";
import Replayer from "../Interfaces/Replayer";
import AbstractLogItem from "./AbstractLogItem";
import AbstractRecorder from "./AbstractRecorder";
import AbstractReplayer from "./AbstractReplayer";

/**
 * An abstract implementation of a Recording type. In order to define a custom recording type, you must extend this
 * class. Documentation for the functions can be found in the {@link Recording} interface.
 * 
 * @author Peter Walsh
 */
export default abstract class AbstractRecording<T extends AbstractLogItem> implements Recording<T> {

    protected _capacity: number;
    protected _recording: Queue<T>;

    constructor(capacity: number) {
        this._capacity = capacity;
        this._recording = new Queue<T>(this._capacity);
    }

    /** @see Recording.recorder */
    public abstract recorder(): new (...args: any) => AbstractRecorder<AbstractRecording<T>, T>;

    /** @see Recording.replayer */
    public abstract replayer(): new (...args: any) => AbstractReplayer<AbstractRecording<T>, T>;

    /** @see Recording.isEmpty */
    public isEmpty(): boolean { return this._recording.hasItems(); }

    /** @see Recording.size */
    public size(): number { return this._recording.getSize(); }

    /** @see Recording.capacity */
    public capacity(): number { return this._capacity; }

    /** @see Recording.peek */
    public peek(): T { return this._recording.peekNext(); }

    /** @see Recording.enqueue */
    public enqueue(item: T): void { this._recording.enqueue(item); }

    /** @see Recording.dequeue */
    public dequeue(): T { return this._recording.dequeue(); }

    /** @see Recording.forEach */
    public forEach(func: (item: T, index?: number) => void): void { this._recording.forEach(func); }

    /** @see Recording.clear */
    public clear(): void { this._recording.clear(); }

}
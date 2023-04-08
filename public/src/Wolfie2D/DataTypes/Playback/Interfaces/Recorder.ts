import Recording from "./Recording";
import LogItem from "./LogItem";
import Updateable from "../../Interfaces/Updateable";

/**
 * An interface that defines a set of methods to be exposed by a Recorder type.
 * @author Peter Walsh
 */
export default interface Recorder<T extends Recording<E>, E extends LogItem> extends Updateable {
    /**
     * @returns true if this Recorder object is currently recording; false otherwise.
     */
    active(): boolean;

    /**
     * Tells this recorder object to start recording event data to the given Recording object.
     * @param recording the recording to record events to
     */
    start(recording: T): void;

    /**
     * Tells this recorder object to stop recording.
     */
    stop(): void;
}
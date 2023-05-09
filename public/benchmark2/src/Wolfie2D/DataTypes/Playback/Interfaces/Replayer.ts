import Updateable from "../../Interfaces/Updateable";
import LogItem from "./LogItem";
import Recording from "./Recording";

/**
 * An interface defining a set of methods to be exposed by a Replayer type.
 * @author Peter Walsh
 */
export default interface Replayer<T extends Recording<E>, E extends LogItem> extends Updateable {
    /**
     * @return true if this Replayer is playing a recording; false otherwise.
     */
    active(): boolean;

    /**
     * Tells this Replayer object to start playing a recording 
     * @param recording the recording to play
     * @param onEnd a callback function that gets called when the recording ends
     */
    start(recording: T, onEnd: () => void): void;

    /**
     * Tells this Replayer object to stop replaying the recording.
     */
    stop(): void;
}
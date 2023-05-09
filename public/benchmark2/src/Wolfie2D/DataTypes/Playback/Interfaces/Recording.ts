import Scene from "../../../Scene/Scene";
import Queue from "../../Collections/Queue";
import Collection from "../../Interfaces/Collection";
import Unique from "../../Interfaces/Unique";
import LogItem from "./LogItem";
import Recorder from "./Recorder";
import Replayer from "./Replayer";

/**
 * An interface that defines a set of methods to be exposed by all Recording types. 
 * @author Peter Walsh
 */
export default interface Recording<T extends LogItem> extends Collection {

    /** 
     * @return the type of Recorder used to record this type of Recording
     */
    recorder(): new (...args: any) => Recorder<Recording<T>, T>

    /** 
     * @return the type of Replayer used to replay this type of Recording 
     */
    replayer(): new (...args: any) => Replayer<Recording<T>, T>;

    /** 
     * @return the number of LogItems in this recording.
     */
    size(): number;

    /**
     *  @return true if the number of LogItems in this recording is 0; false otherwise. 
     */
    isEmpty(): boolean;

    /**
     * Gets and returns the first logged LogItem in this recording without removing it.
     * @return the LogItem at the start of the recording
     */
    peek(): T;

    /**
     * Adds a LogItem to the recording
     * @param logItem the LogItem to add
     */
    enqueue(logItem: T): void;

    /**
     * Removes and returns the LogItem at the start of the recording
     * @return the LogItem at the start of the recording
     */
    dequeue(): T;

    /** 
     * @return the maximum number of LogItems that this Recording can hold
     */
    capacity(): number;
}
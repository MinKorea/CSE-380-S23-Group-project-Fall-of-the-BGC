import Queue from "../DataTypes/Collections/Queue";
import Collection from "../DataTypes/Interfaces/Collection";
import RandUtils from "../Utils/RandUtils";
import Scene from "../Scene/Scene";
import EventLogItem from "./EventLogItem";
import EventRecorder from "./EventRecorder";
import EventReplayer from "./EventReplayer";
import AbstractRecording from "../DataTypes/Playback/Abstract/AbstractRecording";

/**
 * A class representing a recording of a slice of a game.
 */
export default class EventRecording extends AbstractRecording<EventLogItem> {

    /** The initial scene that the recording starts from. */
    private _scene: new (...args: any) => Scene;
    /** The state of the initial scene that the recording starts from. */
    private _init: Record<string, any>;

    public constructor(scene: new (...args: any) => Scene, init: Record<string, any> = {}, capacity: number = 100) {
        super(capacity);
        this._scene = scene;
        this._init = init;
    }

    public override recorder(): new (...args: any[]) => EventRecorder { return EventRecorder; }
    public override replayer(): new (...args: any[]) => EventReplayer { return EventReplayer; }
    
    public scene(): new (...args: any) => Scene { return this._scene; }
    public init(): Record<string, any> { return this._init; }
}
import EventQueue from "../Events/EventQueue";
import { GameEventType } from "../Events/GameEventType";
import Updateable from "../DataTypes/Interfaces/Updateable";
import Recording from "./EventRecording";
import Emitter from "../Events/Emitter";
import { InputHandlers } from "../Input/InputHandler";
import RandUtils from "../Utils/RandUtils";
import Replayer from "../DataTypes/Playback/Interfaces/Replayer";
import EventRecording from "./EventRecording";
import AbstractReplayer from "../DataTypes/Playback/Abstract/AbstractReplayer";
import EventLogItem from "./EventLogItem";

export default class EventReplayer extends AbstractReplayer<EventRecording, EventLogItem> {
    private eventQueue: EventQueue;
    private emitter: Emitter;

    private _frame: number;
    private _count: number;

    private recording: Recording;
    private onEnd: () => void;

    public constructor() {
        super();
        this.eventQueue = EventQueue.getInstance();
        this.emitter = new Emitter();
        
        this._frame = 0;
        this._count = 0;
    }

    public override update(deltaT: number): void {
        if (this._active) {

            while(this._count < this.recording.size() && this.recording.peek().frame * this.recording.peek().deltaT < this._frame * deltaT){
                let logItem = this.recording.dequeue();
                // Add the LogItem event to the EventQueue
                this.eventQueue.addEvent(logItem.event);
                this.recording.enqueue(logItem);
                this._count += 1;
            }
    
            // If we've iterated through the entire recording - end the replay
            if (this._count >= this.recording.size()) {
                this.stop();
            }

            this._frame += 1;
        }
    }

    public override start(recording: EventRecording, onEnd: () => void = null): void {
        // Clear any info about previous replay
        this._frame = 0;
        this._count = 0;
        this._active = true;
        this.recording = recording;
        this.onEnd = onEnd;

        // Disable all user inputs from the screen
        this.emitter.fireEvent(GameEventType.DISABLE_USER_INPUT, {inputs: [
            InputHandlers.MOUSE_DOWN, InputHandlers.MOUSE_UP, InputHandlers.CONTEXT_MENU, 
            InputHandlers.MOUSE_MOVE, InputHandlers.KEY_DOWN, InputHandlers.KEY_UP, 
            InputHandlers.ON_BLUR, InputHandlers.ON_WHEEL
        ]});
        
        // Change the scene to the initial
        this.emitter.fireEvent(GameEventType.CHANGE_SCENE, {scene: this.recording.scene(), init: this.recording.init()});
    
    }
    
    public override stop(): void {
        this._active = false;
        this.onEnd();
        this.emitter.fireEvent(GameEventType.ENABLE_USER_INPUT, {inputs: [
            InputHandlers.MOUSE_DOWN, InputHandlers.MOUSE_UP, InputHandlers.CONTEXT_MENU, 
            InputHandlers.MOUSE_MOVE, InputHandlers.KEY_DOWN, InputHandlers.KEY_UP, 
            InputHandlers.ON_BLUR, InputHandlers.ON_WHEEL
        ]});
    }
}
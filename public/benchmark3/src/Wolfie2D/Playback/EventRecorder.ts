import Receiver from "../Events/Receiver";
import Updateable from "../DataTypes/Interfaces/Updateable";
import { GameEventType } from "../Events/GameEventType";
import Recorder from "../DataTypes/Playback/Interfaces/Recorder";
import EventRecording from "./EventRecording";
import EventLogItem from "./EventLogItem";
import AbstractRecorder from "../DataTypes/Playback/Abstract/AbstractRecorder";


// @ignorePage

export default class EventRecorder extends AbstractRecorder<EventRecording, EventLogItem> {
	private _receiver: Receiver;
	private _frame: number;
	private _recording: EventRecording;

	constructor(){
		super();
		this._receiver = new Receiver();
		this._frame = 0;
		this._recording = null;

		this._receiver.subscribe(
			[GameEventType.MOUSE_DOWN, GameEventType.MOUSE_UP, GameEventType.MOUSE_MOVE, 
			GameEventType.KEY_DOWN, GameEventType.KEY_UP, GameEventType.CANVAS_BLUR,
			GameEventType.WHEEL_DOWN, GameEventType.WHEEL_UP]
		);
	}

	public update(deltaT: number): void {

		if (!this._active) { this._receiver.ignoreEvents(); }
		else {
			this._frame += 1;
			while(this._receiver.hasNextEvent()){
				this._recording.enqueue(new EventLogItem(this._frame, deltaT, this._receiver.getNextEvent()));
			}
		}
	}

	public override start(recording: EventRecording): void {
		this._active = true;
		this._frame = 0;
		this._recording = recording;
	}

	public override stop(): void {
		this._active = false;
	}
}
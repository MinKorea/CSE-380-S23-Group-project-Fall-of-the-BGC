import AbstractLogItem from "../DataTypes/Playback/Abstract/AbstractLogItem";
import GameEvent from "../Events/GameEvent";

export default class EventLogItem extends AbstractLogItem {
	protected _event: GameEvent;

	public constructor(frame: number, deltaT: number, event: GameEvent){
		super(frame, deltaT);
		this.event = event;
	}

	public get event(): GameEvent { return this._event; }
	protected set event(value: GameEvent) { this._event = value }
}
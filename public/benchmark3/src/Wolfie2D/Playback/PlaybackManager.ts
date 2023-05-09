import Updateable from "../DataTypes/Interfaces/Updateable";
import GameEvent from "../Events/GameEvent";
import { GameEventType } from "../Events/GameEventType";
import Receiver from "../Events/Receiver";

import AbstractReplayer from "../DataTypes/Playback/Abstract/AbstractReplayer";
import AbstractLogItem from "../DataTypes/Playback/Abstract/AbstractLogItem";
import AbstractRecording from "../DataTypes/Playback/Abstract/AbstractRecording";
import AbstractRecorder from "../DataTypes/Playback/Abstract/AbstractRecorder";

export default class PlaybackManager implements Updateable {

    protected recorder: AbstractRecorder<AbstractRecording<AbstractLogItem>, AbstractLogItem>;
    protected recording: boolean;

    protected replayer: AbstractReplayer<AbstractRecording<AbstractLogItem>, AbstractLogItem>;
    protected playing: boolean;

    protected lastRecording: AbstractRecording<AbstractLogItem>;

    protected receiver: Receiver;

    constructor() {
        this.recording = false;
        this.playing = false;
        
        this.receiver = new Receiver();
        this.receiver.subscribe([GameEventType.START_RECORDING, GameEventType.STOP_RECORDING, GameEventType.PLAY_RECORDING]);
    }

    public update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if (this.recorder !== undefined) {
            this.recorder.update(deltaT);
            this.recording = this.recorder.active();
        }
        if (this.replayer !== undefined) {
            this.replayer.update(deltaT);
            this.playing = this.replayer.active();
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case GameEventType.START_RECORDING: {
                this.handleStartRecordingEvent(event);
                break;
            }
            case GameEventType.STOP_RECORDING: {
                this.handleStopRecordingEvent();
                break;
            }
            case GameEventType.PLAY_RECORDING: {
                this.handlePlayRecordingEvent(event);
                break;
            }
        }
    }
    protected handleStartRecordingEvent(event: GameEvent): void {
        let recording = event.data.get("recording");
        if (!this.playing && !this.recording && recording !== undefined) {
            this.lastRecording = recording;
            let Recorder: new (...args: any[]) => AbstractRecorder<AbstractRecording<AbstractLogItem>, AbstractLogItem> = this.lastRecording.recorder();
            if (this.recorder === undefined || this.recorder.constructor !== Recorder) {
                this.recorder = new Recorder();
            }
            this.recorder.start(this.lastRecording);
            this.recording = this.recorder.active();
        }
    }
    protected handleStopRecordingEvent(): void {
        this.recorder.stop();
        this.recording = this.recorder.active();
    }
    protected handlePlayRecordingEvent(event: GameEvent): void {
        if (!this.recording && this.lastRecording !== undefined) {
            let Replayer: new (...args: any[]) => AbstractReplayer<AbstractRecording<AbstractLogItem>, AbstractLogItem> = this.lastRecording.replayer();
            if (this.replayer === undefined || this.replayer.constructor !== Replayer) {
                this.replayer = new Replayer();
            }
            this.replayer.start(this.lastRecording, event.data.get("onEnd"));
            this.playing = this.replayer.active();
        }
    }
}

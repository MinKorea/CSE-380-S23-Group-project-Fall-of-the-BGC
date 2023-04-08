import EventQueue from "../Events/EventQueue";
import Vec2 from "../DataTypes/Vec2";
import GameEvent from "../Events/GameEvent";
import { GameEventType } from "../Events/GameEventType";
import Updateable from "../DataTypes/Interfaces/Updateable";
import Receiver from "../Events/Receiver";

export enum InputHandlers {
    MOUSE_DOWN = 0,
    MOUSE_UP = 1,
    CONTEXT_MENU = 2,
    MOUSE_MOVE = 3,
    KEY_DOWN = 4,
    KEY_UP = 5, 
    ON_BLUR = 6,
    ON_WHEEL = 7
}

/**
 * Handles communication with the web browser to receive asynchronous events and send them to the @reference[EventQueue]
 */
export default class InputHandler implements Updateable {
	private eventQueue: EventQueue;
    private enabled: boolean[];
    private receiver: Receiver;
     
    /**
     * Creates a new InputHandler
     * @param canvas The game canvas
     */
    constructor(canvas: HTMLCanvasElement){
		this.eventQueue = EventQueue.getInstance();
        this.enabled = new Array<boolean>(...[true, true, true, true, true, true, true, true]);
		
        canvas.onmousedown = (event) => this.handleMouseDown(event, canvas);
        canvas.onmouseup = (event) => this.handleMouseUp(event, canvas);
        canvas.oncontextmenu = this.handleContextMenu;
        canvas.onmousemove = (event) => this.handleMouseMove(event, canvas);
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
        document.onblur = this.handleBlur;
        document.oncontextmenu = this.handleBlur;
        document.onwheel = this.handleWheel;

        this.receiver = new Receiver();
        this.receiver.subscribe(GameEventType.DISABLE_USER_INPUT);
        this.receiver.subscribe(GameEventType.ENABLE_USER_INPUT);
    }

    public update(deltaT: number): void {
        while(this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case GameEventType.DISABLE_USER_INPUT: {
                this.disableHandlers(event.data.get("inputs"));
                break;
            }
            case GameEventType.ENABLE_USER_INPUT: {
                this.enableHandlers(event.data.get("inputs"));
                break;
            }
            default: {
                throw new Error(`Unhandled event with type: ${event.type} caught in InputHandler.ts`);
            }
        }
    }

    public enableHandlers(handlers: InputHandlers[]): void {
        handlers.forEach(handler => this.enabled[handler] = true);
    }
    public disableHandlers(handlers: InputHandlers[]): void {
        handlers.forEach(handler => this.enabled[handler] = false);
    }

    private handleMouseDown = (event: MouseEvent, canvas: HTMLCanvasElement): void => {
        if (!this.enabled[InputHandlers.MOUSE_DOWN]) return;
		let pos = this.getMousePosition(event, canvas);
        let button = event.button;
        let gameEvent = new GameEvent(GameEventType.MOUSE_DOWN, {position: pos, button: button});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleMouseUp = (event: MouseEvent, canvas: HTMLCanvasElement): void => {
        if (!this.enabled[InputHandlers.MOUSE_DOWN]) return;
        let pos = this.getMousePosition(event, canvas);
        let gameEvent = new GameEvent(GameEventType.MOUSE_UP, {position: pos});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleMouseMove = (event: MouseEvent, canvas: HTMLCanvasElement): void => {
        if (!this.enabled[InputHandlers.MOUSE_MOVE]) return;
        let pos = this.getMousePosition(event, canvas);
        let gameEvent = new GameEvent(GameEventType.MOUSE_MOVE, {position: pos});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        if (!this.enabled[InputHandlers.KEY_DOWN]) return;
        let key = this.getKey(event);
        let gameEvent = new GameEvent(GameEventType.KEY_DOWN, {key: key});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleKeyUp = (event: KeyboardEvent): void => {
        if (!this.enabled[InputHandlers.KEY_UP]) return;
        let key = this.getKey(event);
        let gameEvent = new GameEvent(GameEventType.KEY_UP, {key: key});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleBlur = (event: Event): void => {
        if (!this.enabled[InputHandlers.ON_BLUR]) return;
        let gameEvent = new GameEvent(GameEventType.CANVAS_BLUR, {});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleContextMenu = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
    }

    private handleWheel = (event: WheelEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        if (!this.enabled[InputHandlers.ON_WHEEL]) return;
        
        let gameEvent: GameEvent;
        if(event.deltaY < 0){
            gameEvent = new GameEvent(GameEventType.WHEEL_UP, {});
        } else {
            gameEvent = new GameEvent(GameEventType.WHEEL_DOWN, {});
        }

        this.eventQueue.addEvent(gameEvent);
    }

    private getKey(keyEvent: KeyboardEvent){
        return keyEvent.key.toLowerCase();
    }

    private getMousePosition(mouseEvent: MouseEvent, canvas: HTMLCanvasElement): Vec2 {
        let rect = canvas.getBoundingClientRect();
        let x = mouseEvent.clientX - rect.left;
        let y = mouseEvent.clientY - rect.top;
        return new Vec2(x, y);
    }
}
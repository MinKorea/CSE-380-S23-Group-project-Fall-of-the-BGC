// @ignorePage

export enum GameEventType {
	/**
	 * Mouse Down event. Has data: {position: Vec2 - Mouse Position}
	 */
	MOUSE_DOWN = "mouse_down",
	/**
	 * Mouse Up event. Has data: {position: Vec2 - Mouse Position}
	 */
	MOUSE_UP = "mouse_up",
	/**
	 * Mouse Move event. Has data: {position: Vec2 - Mouse Position}
	 */
	MOUSE_MOVE = "mouse_move",

	/**
	 * Key Down event. Has data: {key: string - The key that is down}
	 */
	KEY_DOWN = "key_down",

	/**
	 * Key Up event. Has data: {key: string - The key that is up}
	 */
	KEY_UP = "key_up",

	/**
	 * Canvas Blur event. Has data: {}
	 */
	CANVAS_BLUR = "canvas_blur",

	/**
	 * Mouse wheel up event. Has data: {}
	 */
	WHEEL_UP = "wheel_up",

	/**
	 * Mouse wheel down event. Has data: {}
	 */
	WHEEL_DOWN = "wheel_down",

	/**
	 * Start Recording event. Has data: {recording: AbstractRecording}
	 */
	START_RECORDING = "start_recording",

	/**
	 * Stop Recording event. Has data: {}
	 */
	STOP_RECORDING = "stop_recording",
	
	/**
	 * Play Recording event. Has data: {}
	 */
	PLAY_RECORDING = "play_recording",

	/**
	 * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean }
	 */
	PLAY_SOUND = "play_sound",

	/**
	 * Play Sound event. Has data: {key: string}
	 */
	STOP_SOUND = "stop_sound",

	/**
	 * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean, channel: AudioChannelType }
	 */
 	PLAY_SFX = "play_sfx",

 	/**
	 * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean }
	 */
  	PLAY_MUSIC = "play_music",

	/**
	 * Mute audio channel event. Has data: {channel: AudioChannelType}
	 */
	MUTE_CHANNEL = "mute_channel",

	/**
	 * Unmute audio channel event. Has data: {channel: AudioChannelType}
	 */
	UNMUTE_CHANNEL = "unmute_channel",

	/**
	 * Encompasses all event types. Used for receivers only.
	 */
	ALL = "all",

	/** 
	 * Disables reveiving input from the user for the specified inputs. Has data: {inputs: InputHanlders[]}
	 */
	DISABLE_USER_INPUT = "disable_user_input",

	/** 
	 * Enables receiving input from the user for the specified inputs. Has data: {inputs: InputHandlers[]}
	 */
	ENABLE_USER_INPUT = "enable_user_input",

	/**
	 * Triggers a scene change. Has data: {scene: new (...args: any) => T extends Scene, init: Record<string, any>}
	 */
	CHANGE_SCENE = "change_scene"
}
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

/**
 * Strings used in the key binding for the player
 */
export enum PlayerInput {
    MOVE_UP = "MOVE_UP",
    MOVE_DOWN = "MOVE_DOWN",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
    ATTACKING = "ATTACKING",
    PICKUP_ITEM = "PICKUP_ITEM",
    DROP_ITEM = "DROP_ITEM"
}

/**
 * The PlayerController class handles processing the input recieved from the user and exposes  
 * a set of methods to make dealing with the user input a bit simpler.
 */
export default class PlayerController {

    /** The GameNode that owns the AI */
    protected owner: AnimatedSprite;

    constructor(owner: AnimatedSprite) {
        this.owner = owner;
    }

    /**
     * Gets the direction the player should move based on input from the keyboard. 
     * @returns a Vec2 indicating the direction the player should move. 
     */
    public get moveDir(): Vec2 { 
        let dir: Vec2 = Vec2.ZERO;
        dir.y = (Input.isPressed(PlayerInput.MOVE_UP) ? -1 : 0) + (Input.isPressed(PlayerInput.MOVE_DOWN) ? 1 : 0);
		dir.x = (Input.isPressed(PlayerInput.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(PlayerInput.MOVE_RIGHT) ? 1 : 0);
        return dir.normalize();
    }

    /** 
     * Gets the direction the player should be facing based on the position of the
     * mouse around the player
     * @return a Vec2 representing the direction the player should face.
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    /**
     * Gets the rotation of the players sprite based on the direction the player
     * should be facing.
     * @return a number representing how much the player should be rotated
     */
    public get rotation(): number { return Vec2.UP.angleToCCW(this.faceDir); }

    /** 
     * Checks if the player is attempting to use a held item or not.
     * @return true if the player is attempting to use a held item; false otherwise
     */
    public get useItem(): boolean { return Input.isMouseJustPressed(); }

    /** 
     * Checks if the player is attempting to pick up an item or not.
     * @return true if the player is attempting to pick up an item; false otherwise.
     */
    public get pickingUp(): boolean { return Input.isJustPressed(PlayerInput.PICKUP_ITEM); }

    /** 
     * Checks if the player is attempting to drop their held item or not.
     * @return true if the player is attempting to drop their held item; false otherwise.
     */
    public get dropping(): boolean { return Input.isJustPressed(PlayerInput.DROP_ITEM); }

}
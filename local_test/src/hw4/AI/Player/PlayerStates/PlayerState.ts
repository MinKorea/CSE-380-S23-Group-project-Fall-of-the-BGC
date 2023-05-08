import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import PlayerWeapon from "../PlayerWeapon";
import Input from "../../../../Wolfie2D/Input/Input";
import { BattlerEvent, HudEvent, ItemEvent } from "../../../Events"
import Item from "../../../GameSystems/ItemSystem/Item";
import PlayerAI from "../PlayerAI";


export enum PlayerAnimationType {
    IDLE = "IDLE"
}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD"
}

export default abstract class PlayerState extends State {

    protected parent: PlayerAI;
    protected owner: PlayerActor;
    protected weapon: PlayerWeapon;

    public constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent);
        this.owner = owner;
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {

        // Adjust the angle the player is facing 
        // this.parent.owner.rotation = this.parent.controller.rotation;
        
        // Update the rotation to apply the particles velocity vector
        //this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.parent.controller.faceDir) + Math.PI;

        // Move the player
        this.parent.owner.move(this.parent.controller.moveDir);

        // if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
        //     this.finished(PlayerStateType.IDLE);
        // }

        if(this.parent.owner.health <= 0)
        {
            this.parent.owner.animation.playIfNotAlready("DYING",false, "DEAD");
            this.parent.owner.freeze();
            //this.parent.owner.animation.playIfNotAlready("DEAD",false, PlayerStateType.DEAD);
            //this.finished(PlayerStateType.DEAD);
            // this.parent.owner.animation.play("DYING", true);
            if (!this.parent.owner.animation.isPlaying("DYING")) {
                this.parent.owner.animation.play("DEAD");
                this.finished(PlayerStateType.DEAD);
            }
        }
                       

        // Handle the player trying to pick up an item
        if (this.parent.controller.pickingUp) {
            // Request an item from the scene
            this.emitter.fireEvent(ItemEvent.ITEM_REQUEST, {node: this.owner, inventory: this.owner.inventory});
        }

        // Handle the player trying to drop an item
        if (this.parent.controller.dropping) {
            
        }

        if (this.parent.controller.useItem) {

        }
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Dead from "./Dead";
import PlayerActor from "../../../Actors/PlayerActor";
export { Idle, Invincible, Moving, Dead} 
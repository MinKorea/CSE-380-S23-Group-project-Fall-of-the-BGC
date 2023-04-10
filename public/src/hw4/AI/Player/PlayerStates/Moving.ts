import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import { PlayerInput } from "../PlayerController";

export default class Moving extends PlayerState {
    
    public override onEnter(options: Record<string, any>): void {
    
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        
        // if (Input.isKeyJustPressed("space")) {
        //     console.log("Space_pressed")
        //     if(this.parent.controller.faceDir.x < 0) 
        //     {
        //         console.log("Attacking left");
        //         this.owner.animation.play("ATTACKING_LEFT", false);
        //     }
        //     else                                      
        //     {
        //         console.log("Attacking right");
        //         this.owner.animation.play("ATTACKING_RIGHT", false);
        //     }

        //     // Update the rotation to apply the particles velocity vector
        //     //this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.parent.controller.faceDir) + Math.PI;
        //     // Start the particle system at the player's current position
        //     //this.weapon.startSystem(500, 0, this.owner.position);
        // }

        if (this.parent.controller.moveDir.x < 0) {
            this.owner.animation.playIfNotAlready("RUNNING_LEFT");
        }
        else if(this.parent.controller.moveDir.x > 0)
        {
            this.owner.animation.playIfNotAlready("RUNNING_RIGHT");
        }
        else
        {
            this.owner.animation.playIfNotAlready("IDLE");
        }

        if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.IDLE);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}
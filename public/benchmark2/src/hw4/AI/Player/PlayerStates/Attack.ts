import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Input from "../../../../Wolfie2D/Input/Input";
import { PlayerInput } from "../PlayerController";
import PlayerWeapon from "../PlayerWeapon";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";

export default class Attack extends PlayerState {

    protected tilemap: OrthogonalTilemap;
    protected weapon: PlayerWeapon;

    public override onEnter(options: Record<string, any>): void {
    
    }

    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);

        // Update the rotation to apply the particles velocity vector
        this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.faceDir) + Math.PI;

        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if (Input.isKeyJustPressed("space") && !this.weapon.isSystemRunning()) {

            if(this.faceDir.x < 0)  this.owner.animation.playIfNotAlready("ATTACKING_LEFT");
            else                    this.owner.animation.playIfNotAlready("ATTACKING_RIGHT");

            // Update the rotation to apply the particles velocity vector
            this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.faceDir) + Math.PI;
            // Start the particle system at the player's current position
            this.weapon.startSystem(500, 0, this.owner.position);
        }

        if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.IDLE);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import { PlayerAnimationType, PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import ShootLaserGun from "../../NPC/NPCActions/ShootLaserGun"; 
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import { ItemEvent } from "../../../Events";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../../../Wolfie2D/DataTypes/Shapes/Circle";
import MainHW4Scene from "../../../Scenes/MainHW4Scene";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";


export default class Idle extends PlayerState {

    protected lasergun: LaserGun;
    protected shootLaser: ShootLaserGun;

    public override onEnter(options: Record<string, any>): void {
        this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.IDLE, true);
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    protected getLaserEnd(walls: OrthogonalTilemap, start: Vec2, dir: Vec2): Vec2 {
        let end = start.clone().add(dir.scaled(900));
        let delta = end.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);

        let minIndex = walls.getTilemapPosition(minX, minY);
		let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                        end = hit.pos;
                    }
                }
            }
        }
        return end;
    }

    public override update(deltaT: number): void {
        super.update(deltaT);

        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if (Input.isKeyJustPressed("space")) {
            // Shoot Audio Played
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getShootAudioKey(), loop: false, holdReference: false});
        
            console.log("Space_pressed")

            let sprite = this.owner.getScene().add.sprite("laserGun", "primary");
            let line = <Line>this.owner.getScene().add.graphic(GraphicType.LINE, "primary", {start: Vec2.ZERO, end: Vec2.ZERO});
            this.lasergun = LaserGun.create(sprite, line);

            this.lasergun.laserStart.copy(this.owner.position);
            this.lasergun.direction.copy(this.owner.position.dirTo(Input.getGlobalMousePosition()));
            // this.lasergun.laserEnd.copy(Input.getGlobalMousePosition());
            this.lasergun.laserEnd.copy(this.getLaserEnd(this.owner.getScene().getWalls(), this.lasergun.laserStart, this.lasergun.direction));


            if(this.parent.controller.faceDir.x < 0) 
            {
                console.log("Attacking left");
                this.owner.animation.play("ATTACKING_LEFT", false);
                
                // Play the shooting animation for the laser gun
                this.lasergun.playShootAnimation();

                // Send a laser fired event
                this.emitter.fireEvent(ItemEvent.LASERGUN_FIRED, {
                    actorId: this.owner.id,
                    to: this.lasergun.laserStart.clone(), 
                    from: this.lasergun.laserEnd.clone().sub(this.lasergun.laserStart)
                });

            }
            else                                      
            {
                console.log("Attacking right");
                this.owner.animation.play("ATTACKING_RIGHT", false);

                // Play the shooting animation for the laser gun
                this.lasergun.playShootAnimation();

                // Send a laser fired event
                this.emitter.fireEvent(ItemEvent.LASERGUN_FIRED, {
                    actorId: this.owner.id,
                    to: this.lasergun.laserStart.clone(), 
                    from: this.lasergun.laserEnd.clone().sub(this.lasergun.laserStart)
                });
            }

            // Update the rotation to apply the particles velocity vector
            // this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.parent.controller.faceDir) + Math.PI;
            // Start the particle system at the player's current position
            //this.weapon.startSystem(500, 0, this.owner.position);
        }

        if (!this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}
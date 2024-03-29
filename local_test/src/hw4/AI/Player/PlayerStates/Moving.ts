import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import { PlayerInput } from "../PlayerController";
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import { ItemEvent } from "../../../Events";
import { GraphicType } from "../../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import { GameEventType } from "../../../../Wolfie2D/Events/GameEventType";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";


export default class Moving extends PlayerState {

    protected lasergun: LaserGun;
    
    public override onEnter(options: Record<string, any>): void {
    
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
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

        // if (Input.isKeyPressed("A") && Input.isKeyPressed("D")) {
        //     this.owner.animation.play("IDLE")
        // }
        // else if (Input.isKeyPressed("A")) {
        //     console.log("running left")
        //     this.owner.animation.play("RUNNING_LEFT", true, "IDLE");
        // }
        // else if (Input.isKeyPressed("D")) {
        //     console.log("running right")
        //     this.owner.animation.play("RUNNING_RIGHT", true, "IDLE");
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


        if (Input.isKeyJustPressed("space")) {
            console.log("Space_pressed")

            // if (this.parent.controller.moveDir.x < 0) {
            //     this.owner.animation.playIfNotAlready("RUNNING_LEFT");
            // }
            // else if(this.parent.controller.moveDir.x > 0)
            // {
            //     this.owner.animation.playIfNotAlready("RUNNING_RIGHT");
            // }
            // else
            // {
            //     this.owner.animation.playIfNotAlready("IDLE");
            // }
            // Shoot Audio Played
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getShootAudioKey(), loop: false, holdReference: false});

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
    
            // if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            //     this.finished(PlayerStateType.IDLE);
            // }

            let sprite = this.owner.getScene().add.sprite("laserGun", "primary");
            let line = <Line>this.owner.getScene().add.graphic(GraphicType.LINE, "primary", {start: Vec2.ZERO, end: Vec2.ZERO});
            this.lasergun = LaserGun.create(sprite, line);

            this.lasergun.laserStart.copy(this.owner.position);
            this.lasergun.direction.copy(this.owner.position.dirTo(Input.getGlobalMousePosition()));
            this.lasergun.laserEnd.copy(this.getLaserEnd(this.owner.getScene().getWalls(), this.lasergun.laserStart, this.lasergun.direction));

            if(this.parent.controller.faceDir.x < 0) 
            {
                console.log("Attacking left");
                this.owner.animation.play("ATTACKING_LEFT", false, "IDLE");
                
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
                this.owner.animation.play("ATTACKING_RIGHT", false, "RUNNING_RIGHT");

                // Play the shooting animation for the laser gun
                this.lasergun.playShootAnimation();

                // Send a laser fired event
                this.emitter.fireEvent(ItemEvent.LASERGUN_FIRED, {
                    actorId: this.owner.id,
                    to: this.lasergun.laserStart.clone(), 
                    from: this.lasergun.laserEnd.clone().sub(this.lasergun.laserStart)
                });
            }
        }

        
    }

    public override onExit(): Record<string, any> { return {}; }

}
import StateMachineGoapAI from "../../../Wolfie2D/AI/Goap/StateMachineGoapAI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Line from "../../../Wolfie2D/Nodes/Graphics/Line";
import Timer from "../../../Wolfie2D/Timing/Timer";
import NPCActor from "../../Actors/NPCActor";
import { ItemEvent } from "../../Events";
import NPCAction from "./NPCActions/NPCAction";


/**
 * An abstract implementation of behavior for an NPC. Each concrete implementation of the
 * NPCBehavior class should define some new behavior for an NPCActor. 
 */
export default abstract class NPCBehavior extends StateMachineGoapAI<NPCAction>  {
    protected override owner: NPCActor;

    public initializeAI(owner: NPCActor, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver.subscribe(ItemEvent.LASERGUN_FIRED);
    }

    public activate(options: Record<string, any>): void {}

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    /**
     * @param event the game event
     */
    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case ItemEvent.LASERGUN_FIRED: {
                console.log("Catching and handling lasergun fired event!!!");
                // Enable to have every NPC have shoot audio
                // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getShootAudioKey(), loop: false, holdReference: false});
                this.handleLasergunFired(event.data.get("actorId"), event.data.get("battlerId"), event.data.get("to"), event.data.get("from"));
                break;
            }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    protected handleLasergunFired(actorId: number, battlerId: number, to: Vec2, from: Vec2): void {
        if (actorId !== this.owner.id && battlerId !== this.owner.battleGroup) {
            this.owner.health -= this.owner.collisionShape.getBoundingRect().intersectSegment(to, from) ? 1 : 0;
            if(!this.owner.animation.isPlaying("ATTACKING"))
            {
                this.owner.animation.playIfNotAlready("TAKING_DAMAGE", false, "IDLE");
            }
            
        }
    }
    
}
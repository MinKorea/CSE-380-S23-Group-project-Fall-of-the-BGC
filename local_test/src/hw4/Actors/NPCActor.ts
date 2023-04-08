import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite"
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import { BattlerEvent, HudEvent } from "../Events";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import HW4Scene from "../Scenes/HW4Scene";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import BasicTargeting from "../GameSystems/Targeting/BasicTargeting";

import Battler from "../GameSystems/BattleSystem/Battler";
import { TargetableEntity } from "../GameSystems/Targeting/TargetableEntity";
import { TargetingEntity } from "../GameSystems/Targeting/TargetingEntity";
import BasicBattler from "../GameSystems/BattleSystem/BasicBattler";
import Timer from "../../Wolfie2D/Timing/Timer";


export default class NPCActor extends AnimatedSprite implements Battler, TargetingEntity {

    /** Override the type of the scene to be the HW3 scene */
    protected scene: HW4Scene

    // An invincible timer for our NPCs
    protected invincibleTimer: Timer;

    // The key of the Navmesh to use to build paths for this NPCActor
    protected _navkey: string;

    // The NPCs battler object
    protected _battler: Battler;

    protected _targeting: TargetingEntity

    public constructor(sheet: Spritesheet) {
        super(sheet);
        this._navkey = "navkey";
        this._battler = new BasicBattler(this);
        this._targeting = new BasicTargeting(this);
        this.invincibleTimer = new Timer(1000);

        this.receiver.subscribe("use-hpack");
    }

    /** The TargetingEntity interface */

    public clearTarget(): void { this._targeting.clearTarget(); }
    public setTarget(targetable: TargetableEntity): void { this._targeting.setTarget(targetable); }
    public hasTarget(): boolean { return this._targeting.hasTarget(); }
    public getTarget(): TargetableEntity { return this._targeting.getTarget(); }
    
    /** The TargetableEntity interface */

    public getTargeting(): TargetingEntity[] { return this._battler.getTargeting(); }
    public addTargeting(targeting: TargetingEntity): void { this._battler.addTargeting(targeting); }
    public removeTargeting(targeting: TargetingEntity): void { this._battler.removeTargeting(targeting); }

    atTarget(): boolean {
        return this._targeting.getTarget().position.distanceSqTo(this.position) < 625;
    }

    public get battlerActive(): boolean { return this.battler.battlerActive; }
    public set battlerActive(value: boolean) { 
        this.battler.battlerActive = value; 
        this.visible = value;
        this.aiActive = value;
    }

    public get battleGroup(): number { return this.battler.battleGroup; }
    public set battleGroup(battleGroup: number) { this.battler.battleGroup = battleGroup; }

    public get maxHealth(): number { return this.battler.maxHealth }
    public set maxHealth(maxHealth: number) { 
        this.battler.maxHealth = maxHealth; 
        this.emitter.fireEvent(HudEvent.HEALTH_CHANGE, {id: this.id, curhp: this.health, maxhp: this.maxHealth});
    }

    public get health(): number { return this.battler.health; }
    public set health(health: number) { 
        this.battler.health = health; 
        if (this.health <= 0 && this.battlerActive) {
            this.emitter.fireEvent(BattlerEvent.BATTLER_KILLED, {id: this.id});
        }
    }

    public get speed(): number { return this.battler.speed; }
    public set speed(speed: number) { this.battler.speed = speed; }

    public override setScene(scene: HW4Scene): void { this.scene = scene; }
    public override getScene(): HW4Scene { return this.scene; }

    public get navkey(): string { return this._navkey; }
    public set navkey(navkey: string) { this._navkey = navkey; }

    getPath(to: Vec2, from: Vec2): NavigationPath { 
        return this.scene.getNavigationManager().getPath(this.navkey, to, from);
    }

    public get inventory(): Inventory { return this.battler.inventory; }

    /** Protected getters for the different components */

    protected get battler(): Battler { return this._battler; }
    protected get targeting(): TargetingEntity { return this._targeting; }
}
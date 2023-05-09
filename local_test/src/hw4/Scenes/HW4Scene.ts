import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import LaserGun from "../GameSystems/ItemSystem/Items/LaserGun";
import Healthpack from "../GameSystems/ItemSystem/Items/Healthpack";
import Battler from "../GameSystems/BattleSystem/Battler";


export default abstract class HW4Scene extends Scene {

 protected shootAudioKey: string;

 protected hitAudioKey: string;

    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;

    public abstract getHealthpacks(): Healthpack[];

    public abstract getLaserGuns(): LaserGun[];

    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    

    public getShootAudioKey(): string {
        return this.shootAudioKey;
    }

    public getHitAudioKey(): string {
        return this.hitAudioKey;
    }
}
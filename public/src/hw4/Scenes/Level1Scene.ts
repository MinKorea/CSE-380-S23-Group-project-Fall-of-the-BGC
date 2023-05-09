import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../Actors/NPCActor";
import PlayerActor from "../Actors/PlayerActor";
import GuardBehavior from "../AI/NPC/NPCBehavior/GaurdBehavior";
import HealerBehavior from "../AI/NPC/NPCBehavior/HealerBehavior";
import PlayerAI from "../AI/Player/PlayerAI";
import PlayerController, { PlayerInput } from "../AI/Player/PlayerController";
import { ItemEvent, PlayerEvent, BattlerEvent, HudEvent } from "../Events";
import Battler from "../GameSystems/BattleSystem/Battler";
import BattlerBase from "../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import InventoryHUD from "../GameSystems/HUD/InventoryHUD";
import PauseHUD from "../GameSystems/HUD/PauseHUD";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Item from "../GameSystems/ItemSystem/Item";
import Healthpack from "../GameSystems/ItemSystem/Items/Healthpack";
import LaserGun from "../GameSystems/ItemSystem/Items/LaserGun";
import { ClosestPositioned } from "../GameSystems/Searching/HW4Reducers";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import Position from "../GameSystems/Targeting/Position";
import AstarStrategy from "../Pathfinding/AstarStrategy";
import GameOver from "./GameOver";
// import HW4Scene from "./HW4Scene";
// import MainMenu from "./MainMenu";
// import LevelSelectionScene from "./LevelSelectionScene";
// import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
// import testHW4Scene from "./FinalProjectScene";
import FinalProjectScene from "./FinalProjectScene";


export default class Level1Scene extends FinalProjectScene {


    public static SHOOT_AUDIO_KEY = "PLAYER_SHOOT"
    public static SHOOT_AUDIO_PATH = "hw4_assets/sounds/laserShoot.wav"

    public static HIT_AUDIO_KEY = "PLAYER_HIT"
    public static HIT_AUDIO_PATH = "hw4_assets/sounds/hit.wav"

    public static DYING_AUDIO_KEY = "PLAYER_DYING"
    public static DYING_AUDIO_PATH = "hw4_assets/sounds/dying.wav"

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/MainGameMusic.wav";


    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();
        this.player = new Array<PlayerActor>();
        this.enemies = new Array<NPCActor>();
   

        this.laserguns = new Array<LaserGun>();
        this.healthpacks = new Array<Healthpack>();

        this.shootAudioKey = Level1Scene.SHOOT_AUDIO_KEY;

        this.hitAudioKey = Level1Scene.HIT_AUDIO_KEY;

        this.dyingAudioKey = Level1Scene.DYING_AUDIO_KEY;
        
        this.levelMusicKey = Level1Scene.LEVEL_MUSIC_KEY
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {

        // Load the player and enemy spritesheets
        this.load.spritesheet("player1", "hw4_assets/spritesheets/Warball_001_Lukas.json");

        // Load in the enemy sprites
        this.load.spritesheet("BlueEnemy", "hw4_assets/spritesheets/psyfly.json");
        this.load.spritesheet("RedEnemy", "hw4_assets/spritesheets/Ball_Bat.json");
        this.load.spritesheet("BlueHealer", "hw4_assets/spritesheets/psyfly.json");
        this.load.spritesheet("RedHealer", "hw4_assets/spritesheets/Ball_Bat.json");

        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/BGCTilemap.json");

        // Load the enemy locations
        // this.load.object("red", "hw4_assets/data/enemies/lvl2.json");
        this.load.object("blue", "hw4_assets/data/enemies/blue.json");

        // Load the healthpack and lasergun loactions
        this.load.object("healthpacks", "hw4_assets/data/items/healthpacks.json");
        this.load.object("laserguns", "hw4_assets/data/items/laserguns.json");

        // Load the healthpack, inventory slot, and laser gun sprites
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");
        this.load.image(FinalProjectScene.PAUSE_KEY, FinalProjectScene.PAUSE_PATH);
        this.load.image(FinalProjectScene.HELP_KEY, FinalProjectScene.HELP_PATH);
        this.load.image(FinalProjectScene.CONTROLS_KEY, FinalProjectScene.CONTROLS_PATH);
        this.load.image(FinalProjectScene.COMPLETE_KEY, FinalProjectScene.COMPLETE_PATH);

        this.load.audio(this.shootAudioKey, Level1Scene.SHOOT_AUDIO_PATH);
        this.load.audio(this.hitAudioKey, Level1Scene.HIT_AUDIO_PATH);
        this.load.audio(this.dyingAudioKey, Level1Scene.DYING_AUDIO_PATH);
        this.load.audio(this.levelMusicKey, Level1Scene.LEVEL_MUSIC_PATH);

    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        super.startScene();
        
    }


    public getBattlers(): Battler[] { return this.battlers; }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    public getHealthpacks(): Healthpack[] { return this.healthpacks; }

    public getLaserGuns(): LaserGun[] { return this.laserguns; }

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/4));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }

    
}
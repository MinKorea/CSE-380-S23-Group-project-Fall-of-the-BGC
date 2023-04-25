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
import HW4Scene from "./HW4Scene";
import MainMenu from "./MainMenu";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export const MainSceneLayers = {
	PRIMARY: "PRIMARY",
	BACKGROUND: "BACKGROUND", 
	UI: "UI",
    PAUSE: "PAUSE",
    CONTROLS: "CONTROLS",
    HELP: "HELP"
} as const;

export default class MainHW4Scene extends HW4Scene {

    /** GameSystems in the HW3 Scene */
    // private inventoryHud: InventoryHUD;

    /** All the battlers in the HW3Scene (including the player) */
    private battlers: (Battler & Actor)[];
    /** Healthbars for the battlers */
    private healthbars: Map<number, HealthbarHUD>;

    private player: (PlayerActor)[];
    private enemies: (NPCActor)[];
    
    // private pause: (PauseHUD);

    // private pauseMenu: (UIElement);
    
    public static PAUSE_KEY = "PAUSE";
    public static PAUSE_PATH = "hw4_assets/sprites/Paused-Screen.png";
    private pauseImage: Sprite;

    public static HELP_KEY = "HELP";
    public static HELP_PATH = "hw4_assets/sprites/Help-Screen.png";
    private helpImage: Sprite;

    public static CONTROLS_KEY = "CONTROLS"
    public static CONTROLS_PATH = "hw4_assets/sprites/Controls-Screen.png"
    private controlsImage: Sprite;


    private bases: BattlerBase[];

    private healthpacks: Array<Healthpack>;
    private laserguns: Array<LaserGun>;

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();
        this.player = new Array<PlayerActor>();
        this.enemies = new Array<NPCActor>();
        // this.pause;
        // this.pauseMenu;

        this.laserguns = new Array<LaserGun>();
        this.healthpacks = new Array<Healthpack>();
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {


        // Load the player and enemy spritesheets
        this.load.spritesheet("player1", "hw4_assets/spritesheets/Warball_001_Lukas.json");

        // Load in the enemy sprites
        this.load.spritesheet("BlueEnemy", "hw4_assets/spritesheets/Psyfly.json");
        this.load.spritesheet("RedEnemy", "hw4_assets/spritesheets/Ball_Bat.json");
        this.load.spritesheet("BlueHealer", "hw4_assets/spritesheets/Psyfly.json");
        this.load.spritesheet("RedHealer", "hw4_assets/spritesheets/Ball_Bat.json");

        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/Level1Tilemap.json");

        // Load the enemy locations
        this.load.object("red", "hw4_assets/data/enemies/red.json");
        this.load.object("blue", "hw4_assets/data/enemies/blue.json");

        // Load the healthpack and lasergun loactions
        this.load.object("healthpacks", "hw4_assets/data/items/healthpacks.json");
        this.load.object("laserguns", "hw4_assets/data/items/laserguns.json");

        // Load the healthpack, inventory slot, and laser gun sprites
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");
        this.load.image(MainHW4Scene.PAUSE_KEY, MainHW4Scene.PAUSE_PATH);
        this.load.image(MainHW4Scene.HELP_KEY, MainHW4Scene.HELP_PATH);
        this.load.image(MainHW4Scene.CONTROLS_KEY, MainHW4Scene.CONTROLS_PATH);

    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        const center = this.viewport.getCenter();

        

        // this.addLayer(MainSceneLayers.UI, );
        // this.addLayer(MainSceneLayers.PAUSE, 5);
        // let v = this.getLayer("UI");
        
        

        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
    
        // 

        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        this.initializeItems();

        this.initializeNavmesh();

        // Create the NPCS
        this.initializeNPCs();

        // Subscribe to relevant events
        this.receiver.subscribe("healthpack");
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(ItemEvent.ITEM_REQUEST);

    

        // Add a UI for health
        this.addUILayer("health");

        // Pause Button (Not needed just press escape)
        // let pause = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.UI, {position: new Vec2(center.x + 600, center.y - 400), text: "Pause"});
        // pause.size.set(100, 50);
        // pause.borderWidth = 2;
        // pause.borderColor = Color.TRANSPARENT;
        // pause.backgroundColor = Color.TRANSPARENT;
        // pause.onClickEventId = "pause";

        // this.pauseMenu = pause;

        // TODO Make text move with button

        // let pauseBar = new PauseHUD(this, pause, center);
        // this.pause = pauseBar;


        let pauseLayer = this.getLayer("PAUSE");

        this.pauseImage = this.add.sprite(MainHW4Scene.PAUSE_KEY, pauseLayer.getName());
        this.pauseImage.position.copy(this.viewport.getCenter());
        this.pauseImage.alpha = 0.7;

        const unpause = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.PAUSE, {position: new Vec2(center.x, center.y - 200), text: ""});
        unpause.size.set(400, 100);
        unpause.borderWidth = 2;
        unpause.borderColor = Color.TRANSPARENT;
        unpause.backgroundColor = Color.TRANSPARENT;
        unpause.onClickEventId = "unpause";

        const mainMenu = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.PAUSE, {position: new Vec2(center.x, center.y + 233), text: ""});
        mainMenu.size.set(400, 100);
        mainMenu.borderWidth = 2;
        mainMenu.borderColor = Color.TRANSPARENT;
        mainMenu.backgroundColor = Color.TRANSPARENT;
        mainMenu.onClickEventId = "mainmenu";

        const controlsButton = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.PAUSE, {position: new Vec2(center.x, center.y - 55), text: ""});
        controlsButton.size.set(400, 100);
        controlsButton.borderWidth = 2;
        controlsButton.borderColor = Color.TRANSPARENT;
        controlsButton.backgroundColor = Color.TRANSPARENT;
        controlsButton.onClickEventId = "controls";

        const helpButton = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.PAUSE, {position: new Vec2(center.x, center.y + 90), text: ""});
        helpButton.size.set(400, 100)
        helpButton.borderWidth = 2;
        helpButton.borderColor = Color.TRANSPARENT;
        helpButton.backgroundColor = Color.TRANSPARENT;
        helpButton.onClickEventId = "help";
        

        pauseLayer.setPaused(true);
        pauseLayer.setHidden(true);

       
        let controlsLayer = this.getLayer("CONTROLS");

        this.controlsImage = this.add.sprite(MainHW4Scene.CONTROLS_KEY, controlsLayer.getName());
        this.controlsImage.position.copy(this.viewport.getCenter());
        // this.controlsImage.alpha = 0.5;

        const controlsBackButton = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.CONTROLS, {position: new Vec2(center.x - 600, center.y + 405), text: ""});
        controlsBackButton.size.set(200, 50);
        controlsBackButton.borderWidth = 2;
        controlsBackButton.borderColor = Color.TRANSPARENT;
        controlsBackButton.backgroundColor = Color.TRANSPARENT;
        controlsBackButton.onClickEventId = "backcontrols";

        controlsLayer.setPaused(true);
        controlsLayer.setHidden(true);

        // 
        let helpLayer = this.getLayer("HELP");

        this.helpImage = this.add.sprite(MainHW4Scene.HELP_KEY, helpLayer.getName());
        this.helpImage.position.copy(this.viewport.getCenter());
        // this.helpImage.alpha = 0.5;

        const helpBackButton = this.add.uiElement(UIElementType.BUTTON, MainSceneLayers.HELP, {position: new Vec2(center.x - 600, center.y + 405), text: ""});
        helpBackButton.size.set(200, 50);
        helpBackButton.borderWidth = 2;
        helpBackButton.borderColor = Color.TRANSPARENT;
        helpBackButton.backgroundColor = Color.TRANSPARENT;
        helpBackButton.onClickEventId = "helpcontrols";

        helpLayer.setPaused(true);
        helpLayer.setHidden(true);


        // this.pauseMenu = unpause;

        // let val = this.layers;

        // console.log(val);

        // this.viewport.setZoomLevel(.5);
        
        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_RESPAWN);
        this.receiver.subscribe("pause");
        this.receiver.subscribe("unpause");
        this.receiver.subscribe("mainmenu");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");
        this.receiver.subscribe("backcontrols");
        this.receiver.subscribe("helpcontrols");

        
    }
    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        // this.inventoryHud.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
        // this.pause.setCenter(this.viewport.getCenter());
        // this.pauseMenu.update(deltaT);
        // this.pause.update(deltaT);
    
        if (Input.isKeyJustPressed("escape")){
            console.log("Escape pressed");
            let v = new GameEvent("pause", null);
            this.handleEvent(v);
        }
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case BattlerEvent.BATTLER_KILLED: {
                this.handleBattlerKilled(event);
                break;
            }
            case BattlerEvent.BATTLER_RESPAWN: {
                break;
            }
            case ItemEvent.ITEM_REQUEST: {
                this.handleItemRequest(event.data.get("node"), event.data.get("inventory"));
                break;
            }
            case PlayerEvent.PLAYER_KILLED: {
                this.sceneManager.changeToScene(GameOver);
            }
            case "pause": {
                console.log("Pause");

                this.pauseImage.position.copy(this.viewport.getCenter()); // Works but when moving the screen gets moved upwards.
                
                this.player[0].freeze(); // Freezes player
                this.player[0].disablePhysics();

                for(let i = 0; i < this.enemies.length; i++){ // Freezes enemies 
                    this.enemies[i].freeze();
                    this.enemies[i].disablePhysics();
                    this.enemies[i].aiActive = false;
                    // this.enemies[i].clearTarget(); 
                    // TODO Stop enemy from attacking while paused
                }
            
               this.unpausePauseLayer(); 
               this.pausePrimaryLayer();
               this.pauseUILayer();


                break;
            }
            case "unpause": {
                console.log("unpause");

                let center = this.viewport.getCenter();
                // this.pauseMenu.position.set(center.x, center.y);
                
                
                this.player[0].unfreeze();
                this.player[0].enablePhysics();
                // Input.enableInput();

                for(let i = 0; i < this.enemies.length; i++){
                    this.enemies[i].unfreeze();
                    this.enemies[i].enablePhysics();
                    this.enemies[i].aiActive = true;
                    // this.enemies[i].setTarget(this.battlers[0]);
                }

                this.pausePauseLayer();
                this.unpausePrimaryLayer();
                this.unpauseUILayer();


                break;
            } 
            case "mainmenu": {
                this.viewport.follow(undefined);
                this.sceneManager.changeToScene(MainMenu);
                break;
            } 
            case "controls": {
                this.controlsImage.position.copy(this.viewport.getCenter());
                this.pausePauseLayer();
                this.unpauseControlsLayer();
                break;
            } 
            case "backcontrols": {
                this.unpausePauseLayer();
                this.pauseControlsLayer();
                break;
            }
            case "help": {
                this.helpImage.position.copy(this.viewport.getCenter());
                this.pausePauseLayer();
                this.unpauseHelpLayer();
                break;
            }
            case "helpcontrols": {
                this.unpausePauseLayer();
                this.pauseHelpLayer();
                break;
            }
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in HW3Scene event handler`);
            }
        }
    }

    protected pausePauseLayer(): void {
        let pauseLayer = this.getLayer("PAUSE");
        pauseLayer.setPaused(true);
        pauseLayer.setHidden(true);
    }

    protected unpausePauseLayer(): void {
        let pauseLayer = this.getLayer("PAUSE");
        pauseLayer.setPaused(false);
        pauseLayer.setHidden(false);
    }

    protected pauseControlsLayer(): void {
        let controlsLayer = this.getLayer("CONTROLS");
        controlsLayer.setPaused(true);
        controlsLayer.setHidden(true);
    }

    protected unpauseControlsLayer(): void {
        let controlsLayer = this.getLayer("CONTROLS");
        controlsLayer.setPaused(false);
        controlsLayer.setHidden(false);
    }

    protected pausePrimaryLayer(): void {
        let primaryLayer = this.getLayer("primary");
        primaryLayer.setPaused(true);
        primaryLayer.setHidden(true);
    }

    protected unpausePrimaryLayer(): void {
        let primaryLayer = this.getLayer("primary");
        primaryLayer.setPaused(false);
        primaryLayer.setHidden(false);
    }

    protected pauseUILayer(): void {
        let uiLayer = this.getLayer("UI");
        uiLayer.setPaused(true);
        uiLayer.setHidden(true);
    }

    protected unpauseUILayer(): void {
        let uiLayer = this.getLayer("UI");
        uiLayer.setPaused(false);
        uiLayer.setHidden(false);
    }

    protected pauseHelpLayer(): void {
        let helpLayer = this.getLayer("HELP");
        helpLayer.setPaused(true);
        helpLayer.setHidden(true);
    }

    protected unpauseHelpLayer(): void {
        let helpLayer = this.getLayer("HELP");
        helpLayer.setPaused(false);
        helpLayer.setHidden(false);
    }


    protected handleItemRequest(node: GameNode, inventory: Inventory): void {
        let items: Item[] = new Array<Item>(...this.healthpacks, ...this.laserguns).filter((item: Item) => {
            return item.inventory === null && item.position.distanceTo(node.position) <= 100;
        });

        if (items.length > 0) {
            inventory.add(items.reduce(ClosestPositioned(node)));
        }
    }

    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */
    protected handleBattlerKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        let battler = this.battlers.find(b => b.id === id);

        if (battler) {
            battler.battlerActive = false;
            this.healthbars.get(id).visible = false;
        }
        
    }

    /** Initializes the layers in the scene */
    protected initLayers(): void {

        this.addLayer(MainSceneLayers.UI);
        this.addLayer(MainSceneLayers.PAUSE, 10);
        this.addLayer(MainSceneLayers.HELP, 11);
        this.addLayer(MainSceneLayers.CONTROLS, 11);

        this.addLayer("primary", 5);
    }




    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        const center = this.viewport.getCenter();
        let player = this.add.animatedSprite(PlayerActor, "player1", "primary");
        player.position.set(center.x, center.y);

        player.battleGroup = 2;
        

        player.health = 10;
        player.maxHealth = 10;
        player.scale = new Vec2(1, 1); // Scales player 

        player.inventory.onChange = ItemEvent.INVENTORY_CHANGED
        // this.inventoryHud = new InventoryHUD(this, player.inventory, "inventorySlot", {
        //     start: new Vec2(232, 24),
        //     slotLayer: "slots",
        //     padding: 8,
        //     itemLayer: "items"
        // });

        // Give the player physics
        player.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 64)));

        // Give the player a healthbar
        let healthbar = new HealthbarHUD(this, player, "primary", {size: player.size.clone().scaled(1, 1/4), offset: player.size.clone().scaled(0, -2/3)});
        this.healthbars.set(player.id, healthbar);

        // Give the player PlayerAI
        player.addAI(PlayerAI);

        // Start the player in the "IDLE" animation
        player.animation.play("IDLE");
        
        this.battlers.push(player);
        this.player.push(player);
        this.viewport.follow(player);
        this.viewport.setZoomLevel(1);
        
    }
    /**
     * Initialize the NPCs 
     */
    protected initializeNPCs(): void {

        // Get the object data for the red enemies
        let red = this.load.getObject("red");

        // Initialize the red healers
        for (let i = 0; i < red.healers.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "RedHealer", "primary");
            npc.position.set(red.healers[i][0], red.healers[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)), null, false);
            
            

            npc.battleGroup = 1;
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";
            // npc.scale = new Vec2(1,1);

            npc.addAI(GuardBehavior, {target: this.battlers[0], range: 100});
            // npc.moveOnPath(npc.speed, npc.getPath(this.battlers[0].position, npc.position));

            // Give the NPC a healthbar
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1/2, 1/4), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            
            npc.animation.play("IDLE");
            this.battlers.push(npc);

            // npc.moveOnPath(npc.speed, npc.getPath(this.battlers[0].position, npc.position));
        }

        for (let i = 0; i < red.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "RedEnemy", "primary");
            npc.position.set(red.enemies[i][0], red.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)), null, false);

            // Give the NPC a healthbar
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1/2, 1/4), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);
            
            // Set the NPCs stats
            npc.battleGroup = 1
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";
            // npc.scale = new Vec2(3,3);

            npc.addAI(GuardBehavior, {target: this.battlers[0], range: 100});

            // npc.moveOnPath(npc.speed, npc.getPath(this.battlers[0].position, npc.position));

            // Play the NPCs "IDLE" animation 
            npc.animation.play("IDLE");
            // Add the NPC to the battlers array
            this.battlers.push(npc);
        }

        // Get the object data for the blue enemies
        let blue = this.load.getObject("blue");

        // Initialize the blue enemies
        for (let i = 0; i < blue.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "BlueEnemy", "primary");
            npc.position.set(blue.enemies[i][0], blue.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)), null, false);

            // Give the NPCS their healthbars
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1/2, 1/4), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.battleGroup = 1
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";
            npc.scale = new Vec2(1,1);

            

            // Give the NPCs their AI
            npc.addAI(GuardBehavior, {target: this.battlers[0], range: 0});

            // Play the NPCs "IDLE" animation 
            npc.animation.play("IDLE");

            this.battlers.push(npc);
            this.enemies.push(npc);
        }

        // Initialize the blue healers
        for (let i = 0; i < blue.healers.length; i++) {
            
            let npc = this.add.animatedSprite(NPCActor, "BlueHealer", "primary");
            npc.position.set(blue.healers[i][0], blue.healers[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)), null, false);

            npc.battleGroup = 1;
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";
            npc.scale = new Vec2(1,1);

            // npc.getPath(this.playerPos, npc.position);
            npc.addAI(GuardBehavior, {target: this.battlers[0], range: 100});

            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1/2, 1/4), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            /// npc.addAI(HealerBehavior);
            npc.animation.play("IDLE");
            this.battlers.push(npc);

            
        }

    }

    /**
     * Initialize the items in the scene (healthpacks and laser guns)
     */
    protected initializeItems(): void {
        let laserguns = this.load.getObject("laserguns");
        this.laserguns = new Array<LaserGun>(laserguns.items.length);
        for (let i = 0; i < laserguns.items.length; i++) {
            let sprite = this.add.sprite("laserGun", "primary");
            let line = <Line>this.add.graphic(GraphicType.LINE, "primary", {start: Vec2.ZERO, end: Vec2.ZERO});
            this.laserguns[i] = LaserGun.create(sprite, line);
            this.laserguns[i].position.set(laserguns.items[i][0], laserguns.items[i][1]);
        }

        let healthpacks = this.load.getObject("healthpacks");
        this.healthpacks = new Array<Healthpack>(healthpacks.items.length);
        for (let i = 0; i < healthpacks.items.length; i++) {
            let sprite = this.add.sprite("healthpack", "primary");
            this.healthpacks[i] = new Healthpack(sprite);
            this.healthpacks[i].position.set(healthpacks.items[i][0], healthpacks.items[i][1]);
        }
    }
    /**
     * Initializes the navmesh graph used by the NPCs in the HW3Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * 
     * - Peter
     */
    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < this.graph.numVertices; i++) {
            rc = this.walls.getTileColRow(i);
            if (!this.walls.isTileCollidable(rc.x, rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = this.walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));
        // Select A* as our navigation strategy
        navmesh.setStrategy("astar");

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
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
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

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
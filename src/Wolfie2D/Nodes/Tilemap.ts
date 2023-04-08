import Vec2 from "../DataTypes/Vec2";
import Tileset from "../DataTypes/Tilesets/Tileset";
import { TiledTilemapData, TiledLayerData } from "../DataTypes/Tilesets/TiledData"
import CanvasNode from "./CanvasNode";
import PhysicsManager from "../Physics/PhysicsManager";
import Shape from "../DataTypes/Shapes/Shape";
import AABB from "../DataTypes/Shapes/AABB";

/**
 * The representation of a tilemap - this can consist of a combination of tilesets in one layer
 */
export default abstract class Tilemap extends CanvasNode {

    /** An array of the tilesets that this tilemap uses */
    protected tilesets: Array<Tileset>;
    /** The size of a tile in this tilemap */
    protected tileSize: Vec2;
    /** An array of tile data */
    protected data: Array<number>;
    /** An array of tile collision data */
    protected collisionMap: Array<boolean>;
    /** The name of the tilemap */
    protected _name: string;
    /** The number of columns in the tilemap */
    protected numCols: number;
    /** The number of rows in the tilemap */
    protected numRows: number;
    

    // TODO: Make this no longer be specific to Tiled
    constructor(tilemapData: TiledTilemapData, layer: TiledLayerData, tilesets: Array<Tileset>, scale: Vec2) {
        super();

        this.tilesets = tilesets;
        this.tileSize = new Vec2(0, 0);
        this.name = layer.name;
        this.numCols = tilemapData.width;
        this.numRows = tilemapData.height;

        let tilecount = 0;
        for(let tileset of tilesets){
            tilecount += tileset.getTileCount() + 1;
        }

        this.collisionMap = new Array(tilecount);
        for(let i = 0; i < this.collisionMap.length; i++){
            this.collisionMap[i] = false;
        }

        // Defer parsing of the data to child classes - this allows for isometric vs. orthographic tilemaps and handling of Tiled data or other data
        this.parseTilemapData(tilemapData, layer);
        this.scale.set(scale.x, scale.y);
    }
    
    public get name(): string { return this._name; }
    public set name(name: string) { this._name = name; }

    /**
     * Gets the data value of the tile at the specified index
     * @param index The index of the tile
     * @returns The data value of the tile
     */
    public getTile(col: number, row: number): number {
        let index = this.getTileIndex(col, row);
        if (index === -1) { return -1; }

        return this.data[index];
    }
    /**
     * Gets the index of the tile in the tilemaps backing array.
     * @param position the position in row-column format in the backing array of the tilemap
     * @returns the index of position in the tilemap
     */
    public getTileIndex(col: number, row: number): number {
        if (col < 0 || col >= this.numCols || row < 0 || row >= this.numRows) {
            return -1;
        }
        return row * this.numCols + col;
    }
    /**
     * Gets the column and row of a tile in the tilemap from the index of the tile
     * in the backing array.
     * @param index the index of the tile in the backing array
     * @return a Vec2 containing the column and row indices of the tile
     */
    public getTileColRow(index: number): Vec2 {
        let col = index % this.numCols;
        let row = Math.floor(index / this.numCols);
        return new Vec2(col, row);
    }

    /**
     * Sets the tile at the specified position to the given tile.
     * @param position the row and column of the tile in the backing array
     * @param tile the number of the tile to set
     */
    public setTile(col: number, row: number, tile: number): void {
        let index = this.getTileIndex(col, row);
        if (index !== -1) { 
            this.data[index] = tile;
        }
    }



    /**
     * Returns an array of the tilesets associated with this tilemap
     * @returns An array of all of the tilesets assocaited with this tilemap.
     */
    public getTilesets(): Tileset[] {
        return this.tilesets;
    }
    /**
     * Gets the dimensions of the tilemap
     * @returns A Vec2 containing the number of columns and the number of rows in the tilemap.
     */
    public getDimensions(): Vec2 {
        return new Vec2(this.numCols, this.numRows);
    }

    // Methods for getting the size of a tile

    /**
     * Gets the raw size of the tiles, without any scaling or zooming.
     * @returns the size of the tiles in this tilemap
     */
    public getTileSize(): Vec2 {
        return this.tileSize;
    }
    /**
     * Returns the size of tiles in this tilemap as they appear in the game world after scaling
     * @returns A vector containing the size of tiles in this tilemap as they appear in the game world after scaling.
     */
    public getScaledTileSize(): Vec2 {
        return this.getTileSize().scaled(this.scale.x, this.scale.y);
    }
   

    /**
     * Returns true if the tile at the specified row and column of the tilemap is collidable
     * @param col the specified column
     * @param row the specified row
     * @returns A flag representing whether or not the tile is collidable.
     */
    public isTileCollidable(col: number, row: number): boolean {
        if (col < 0 || col >= this.numCols || row < 0 || row >= this.numRows) {
            return false;
        }
        return this.collisionMap[this.getTile(col, row)];
    }

    /**
     * Adds this tilemap to the physics system
     */
    public addPhysics(): void {
        this.hasPhysics = true;
        this.active = true;
        this.group = -1;
        this.scene.getPhysicsManager().registerTilemap(this);
    }

    /**
     * Gets the x/y coordinates of a tile on the screen from the position of the tile in the 
     * backing array of the tilemap.
     * @param row the row position of the tile in the backing array
     * @param col the column position of the tile in the backing array
     * @returns a Vec2 containing the world position of the tile
     */
    public abstract getWorldPosition(col: number, row: number): Vec2;
    
    /**
     * Gets the row/column position of a tile in the tilemap from the screen coordinates of the tile.
     * @param x the x-coordinate of the tile on the screen
     * @param y the y-coordinate of the tile on the screen
     * @returns a Vec2 containing the column and row position of the tile in the tilemap
     */
    public abstract getTilemapPosition(x: number, y: number): Vec2;

    /**
     * Gets the collision shape for the specified tile at the specified column/row in the tilemap
     * @param row the row
     * @param col the column
     * @return a new Shape object representing the collision shape of the tile
     */
    public abstract getTileCollider(col: number, row: number): Shape;

    /**
     * Gets the column and row position of first tile in the region. This method gets called
     * when rendering is done to determine which tiles should be rendered in the viewport.
     * @param upperLeft the upper left corner of the region
     * @param bottomRight the bottom right corner of the region
     */
    public abstract getMinColRow(region: AABB): Vec2;

    /**
     * Gets the column and row position of the last tile in the region. This method gets called 
     * when rendering is done to determine which tiles should be rendered in the viewport.
     * @param upperLeft the upper left corner of the region
     * @param bottomRight the bottom right corner of the region
     */
    public abstract getMaxColRow(region: AABB): Vec2;

    /**
     * Sets up the tileset using the data loaded from file
     * @param tilemapData The tilemap data from file
     * @param layer The layer data from file
     */
    protected abstract parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void;
}
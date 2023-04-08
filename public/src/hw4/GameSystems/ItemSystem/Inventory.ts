import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import Item from "./Item";
import Healthpack from "./Items/Healthpack";

/**
 * An inventory is a collection of items. All items in the inventory must be registered with
 * the Inventorys ItemManager class. 
 */
export default class Inventory implements Unique {

    /** The id number of the next inventory */
    private static NEXT_ID: number = 0;

    /** The id of this inventory */
    protected __id: number;

    /** The collection of items in the inventory */
    protected _inventory: Map<number, Item>;

    /** A flag indicating whether the */
    protected _dirty: boolean;

    /** The maximum number of items this inventory can hold */
    protected _capacity: number;

    /** The number of items in this inventory */
    protected _size: number;

    /** The event to fire when this inventory changes */
    protected _onChange: string | null;

    /** An emitter used to emit events when this inventory changes */
    protected _emitter: Emitter;

    public constructor(capacity: number = 10) {
        this.__id = Inventory.NEXT_ID 
        Inventory.NEXT_ID += 1;

        this.inventory = new Map<number, Item>();
        this._emitter = new Emitter();

        this.size = 0;
        this.capacity = capacity;
        this.dirty = false;
        this.onChange = null;
        
    }

    public get id(): number { return this.__id; }

    public get dirty(): boolean { return this._dirty; }
    protected set dirty(dirty: boolean) { this._dirty = dirty; }

    public get size(): number { return this._size; }
    protected set size(size: number) { this._size = size; }

    public get capacity(): number { return this._capacity; }
    protected set capacity(capacity: number) { this._capacity = capacity; }

    public get onChange(): string { return this._onChange; }
    public set onChange(onChange: string) { this._onChange = onChange; }

    protected get inventory(): Map<number, Item> { return this._inventory; }
    protected set inventory(inventory: Map<number, Item>) { this._inventory = inventory; }

    protected get emitter(): Emitter { return this._emitter; }
    protected set emitter(emitter: Emitter) { this._emitter = emitter; }

    /**
     * Gets an item from this inventory by id.
     * @param id the id of the item to get
     * @returns the item if it exists; null otherwise
     */
    public get(id: number): Item | null {
        if (!this.has(id)) {
            return null;
        }
        return this.inventory.get(id);
    }

    /**
     * Adds an item to this inventory
     * @param item adds an item to the inventory with the key of the items owner
     * @returns if the Item was successfully added to the inventory; null otherwise
     */
    public add(item: Item): Item | null { 
        if (this.has(item.id) || this.size >= this.capacity || item.inventory !== null) {
            return null;
        }
        this.inventory.set(item.id, item);
        this.size += 1;
        this.dirty = true;

        item.inventory = this;
        item.visible = false;

        return item;
    }

    /**
     * Checks if an item with the given id number exists in this inventory.
     * @param id the id of the item in the inventory
     * @returns true if the item with the id exists; false otherwise
     */
    public has(id: number): boolean { 
        return this.inventory.has(id);
    }

    /**
     * Removes the item with the given id number from this inventory
     * @param id the id of the item
     * @returns the item that was removed or null 
     */
    public remove(id: number): Item | null { 
        if (!this.has(id)) {
            return null;
        }
        let item: Item = this.get(id);
        this.inventory.delete(id);
        this.size -= 1;
        this.dirty = true

        item.inventory = null;

        return item;
    }

    public items(): IterableIterator<Item> {
        return this.inventory.values()
    }

    public find(func: (item: Item) => boolean): Item | null {
        let item = Array.from(this.inventory.values()).find(func);
        return item === undefined ? null : item;
    }

    public clean(): void {
        this.dirty = false;
        if (this.onChange !== null) {
            this.emitter.fireEvent(this.onChange, { id: this.id, inventory: this });
        }
    }
}
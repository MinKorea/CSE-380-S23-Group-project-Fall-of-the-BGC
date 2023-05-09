import Collection from "../Interfaces/Collection";

export default class BinaryHeapSet<T> implements Collection {

    private readonly MAX_ELEMENTS: number;
    private readonly ROOT: number;

    /** An array representing the binary heap backing the priority queue */
    private heap: Array<T>;
    /** A mapping of nodes that exist in the queue to their positions in the heap array */
    private map: Map<T, number>;

    /** The number of elements currently in the heap */
    private size: number;
    /** The comparison function used to compare heap elements */
    private comp: (e1: T, e2: T) => number;

    constructor(compareTo: (e1: T, e2: T) => number, maxElements: number = 100) {
        this.ROOT = 0;
        this.MAX_ELEMENTS = maxElements;

        this.heap = new Array(this.MAX_ELEMENTS);
        this.map = new Map<T, number>();
        this.size = 0;
        this.comp = compareTo;
    }

    push(e: T): void {
        if (!this.map.has(e)) {
            this.heap[this.size] = e;
            this.map.set(e, this.size);
            this.percup(this.size);
            this.size += 1;
        }
    }

    pop(): T {
        let top = this.peek();
        this.map.delete(this.heap[this.ROOT]);
        this.size -= 1;

        this.heap[this.ROOT] = this.heap[this.size];
        this.percdown(this.ROOT);

        return top;
    }

    peek(): T {
        return this.heap[this.ROOT];
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(func: Function): void {
        this.heap.forEach(func());
    }

    clear(): void {
        this.heap.fill(null);
    }

    restore(value: T): void {
        let node = this.map.get(value);
        this.percup(node);
        this.percdown(node);
    }

    has(value: T): boolean {
        return this.map.has(value);
    }

    toString(): string {
        let res = "Backing Heap: [";
        for (let i = 0; i < this.size; i++) {
            res += `${this.heap[i]}`
            if (i < this.size - 1) {
                res += ", "
            }
        }
        res += "]\nMap: [\n";
        this.map.forEach((val: number, key: T) => {
            res += `\t${key} -> ${val}\n`;
        });
        res += "]";
        return res;
    }

    protected percup(node: number): void {
        let prnt = this.parent(node);
        while (node > this.ROOT && this.comp(this.heap[node], this.heap[prnt]) > 0) {
            this.swap(node, prnt);
            node = prnt;
            prnt = this.parent(node);
        }
    }
    protected percdown(node: number): void {
        let child = this.lchild(node);
        while (child < this.size) {
            if (child < this.size - 1 && this.comp(this.heap[child], this.heap[child + 1]) <= 0) {
                child += 1;
            }
            if (this.comp(this.heap[child], this.heap[node]) > 0) {
                this.swap(node, child);
                node = child;
                child = this.lchild(node);
            } else {
                break;
            }
        }
    }

    protected parent(node: number): number { 
        return Math.floor((node - 1)/2); 
    }
    protected lchild(node: number): number { 
        return node*2 + 1; 
    }
    protected rchild(node: number): number { 
        return node*2 + 2; 
    }
    protected swap(node1: number, node2: number): void {
        this.map.set(this.heap[node1], node2);
        this.map.set(this.heap[node2], node1);

        let temp = this.heap[node1];
        this.heap[node1] = this.heap[node2];
        this.heap[node2] = temp;
    }
    
}
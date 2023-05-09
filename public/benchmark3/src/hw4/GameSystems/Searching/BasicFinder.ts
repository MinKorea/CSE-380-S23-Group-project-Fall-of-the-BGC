export default class BasicFinder<T> {

    protected reducer: (t1: T, t2: T) => T | null;
    protected filters: ((t: T) => boolean)[];

    public constructor(reducer: (t1: T, t2: T) => T = null, ...filters: ((t: T) => boolean)[]) {
        this.reducer = reducer;
        this.filters = filters;
    }

    public find(targets: Readonly<T[]>): T | null {
        let filtered = targets.filter(target => this.filters.every(filter => filter(target)));
        return filtered.length === 0 ? null : this.reducer === null ? filtered[0] : filtered.reduce(this.reducer);
    }

}
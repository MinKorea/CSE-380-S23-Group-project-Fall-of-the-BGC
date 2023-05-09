export default interface Finder<T> {

    find(targets: Readonly<T[]>): T | null;

}
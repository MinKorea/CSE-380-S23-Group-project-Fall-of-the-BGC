import Path from "./Path";

/** Represents an entity that can be navigated on. */
export default interface Navigable<T, P extends Path<T>> {

    /**
     * Gets a new navigation path based on this Navigable object.
     * @param fromPosition The position to start navigation from.
     * @param toPosition The position to navigate to.
     */
    getNavigationPath(fromPosition: T, toPosition: T): P;
}
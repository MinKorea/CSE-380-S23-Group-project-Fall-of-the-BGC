import Path from "./Path";

/**
 * An interface that defines a generic algorithm used to perform pathfinding. This is
 * the strategy design pattern.
 * @author PeteyLumpkins
 */
export default interface PathStrategy<T, P extends Path<T>> {

    buildPath(to: T, from: T): P

}
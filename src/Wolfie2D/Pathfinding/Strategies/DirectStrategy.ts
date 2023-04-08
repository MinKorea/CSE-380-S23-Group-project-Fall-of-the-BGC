import Stack from "../../DataTypes/Collections/Stack";
import Vec2 from "../../DataTypes/Vec2";
import NavigationPath from "../NavigationPath";
import NavPathStrat from "./NavigationStrategy";

/**
 * Constructs a navigation path that goes directly from point A to point B. In the 
 * original implementation of the NavigationPath, you could set a flag to tell it to
 * create a direct path. I've basically removed that flag and created this class in 
 * it's place.
 * @author PeteyLumpkins
 */
export default class DirectPathStrat extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        let stack = new Stack<Vec2>();
        stack.push(to.clone());
        return new NavigationPath(stack);
    }
    
}
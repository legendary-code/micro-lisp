/**
 * Represents an abstract syntax tree node
 */
class Node {
    constructor(location) {
        this._location = location;
    }

    eval(context, env) {
        throw "eval() must be implemented for type " + this.constructor.name;
    }

    toString() {
        throw "toString() must be implemented for type " + this.constructor.name;
    }

    get location() {
        return this._location;
    }

    get type() {
        return this.constructor;
    }

    isOfType(type) {
        return this instanceof type;
    }
}

module.exports = Node;
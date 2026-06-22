import TreeNode from "../util/TreeNode.js";
export default class ChineseCharacter {
    constructor(options) {
        this.glyph = options.glyph;
        this.index = options.index;
        this.strokes = options.strokes;
        this._parents = [];
        this._recipes = [];
        this._tier = undefined;
    }
    addShape(shape) {
        if (this._recipes.length === 0)
            this._recipes.push([]);
        this._recipes[0].push(shape);
        this._tier = undefined;
    }
    addRecipe(recipe) {
        if (recipe.length === 0)
            return;
        if (this._recipes.some(existing => this.hasSameRecipe(existing, recipe)))
            return;
        this._recipes.push(recipe);
        this._tier = undefined;
    }
    addParent(parent) {
        if (this._parents.includes(parent))
            return;
        this._parents.push(parent);
    }
    hasSameRecipe(a, b) {
        return a.length === b.length && a.every((shape, i) => shape === b[i]);
    }
    get shapes() {
        return this._recipes[0] ?? [];
    }
    get recipes() {
        return this._recipes;
    }
    get parents() {
        return this._parents;
    }
    getShapeTree() {
        const tree = new TreeNode(this.glyph);
        for (const shape of this.shapes) {
            tree.addChild(shape.getShapeTree());
        }
        return tree;
    }
    getTier() {
        if (typeof this._tier !== "undefined")
            return this._tier;
        let tier = 1;
        if (this._recipes.length > 0) {
            tier = Math.min(...this._recipes.map(recipe => {
                let recipeTier = 1;
                for (const shape of recipe) {
                    recipeTier = Math.max(recipeTier, shape.getTier() + 1);
                }
                return recipeTier;
            }));
        }
        this._tier = tier;
        return tier;
    }
}

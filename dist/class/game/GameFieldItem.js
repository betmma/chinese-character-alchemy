export default class GameFieldItem {
    constructor(chineseCharacter) {
        this.chineseCharacter = chineseCharacter;
        this.position = [50 + (Math.random() * 20 - 10), (Math.random() * 20 - 10)];
        const tier = this.chineseCharacter.getTier();
        this.size = 5 + (tier) / 2;
    }
    isPointInItem(x, y) {
        const { position: [xi, yi], size: si } = this;
        const isPointIn = xi - si / 2 <= x && x <= xi + si / 2 &&
            yi - si / 2 <= y && y <= yi + si / 2;
        return isPointIn;
    }
    isCollisionWith(item) {
        const { position: [x1, y1], size: s1 } = this;
        const { position: [x2, y2], size: s2 } = item;
        const isCollision = x1 < x2 + s2 &&
            x1 + s1 > x2 &&
            y1 < y2 + s2 &&
            s1 + y1 > y2;
        return isCollision;
    }
    getMergedItemsForRecipe(recipe, items) {
        const needed = [...recipe];
        const selectedIdx = needed.indexOf(this.chineseCharacter);
        if (selectedIdx === -1)
            return null;
        needed.splice(selectedIdx, 1);
        const remainingItems = [...items];
        const merged = [this];
        for (const character of needed) {
            const itemIdx = remainingItems.findIndex(item => item.chineseCharacter === character);
            if (itemIdx === -1)
                return null;
            merged.push(remainingItems[itemIdx]);
            remainingItems.splice(itemIdx, 1);
        }
        return merged;
    }
    mergeWith(items) {
        const parents = this.chineseCharacter.parents;
        const crafted = [];
        let totalMerged = [];
        for (const parent of parents) {
            for (const recipe of parent.recipes) {
                const merged = this.getMergedItemsForRecipe(recipe, items);
                if (merged === null)
                    continue;
                crafted.push(parent);
                totalMerged.push(...merged);
                totalMerged = [...new Set(totalMerged)];
                break;
            }
        }
        if (crafted.length > 0)
            return [crafted, totalMerged];
        return null;
    }
}

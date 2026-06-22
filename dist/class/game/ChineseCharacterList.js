export default class ChineseCharacterList {
    constructor(game, options) {
        this.game = game;
        this.chineseCharacters = [...options.chineseCharacters];
        this.unlocked = [...new Set(options.unlocked
                .map(char => this.chineseCharacters.findIndex(c => c.glyph === char))
                .filter(idx => idx !== -1))];
        this.unlockedSet = new Set(this.unlocked);
        this.listTitleEl = options.listTitleEl;
        this.listWrapperEl = options.listWrapperEl;
        this.listItemEls = new Array(this.chineseCharacters.length);
        this.hideCompleted = false;
        this.init();
    }
    init() {
        for (const idx of this.unlocked) {
            this.ensureItemEl(idx);
        }
        this.updateTitle();
    }
    insertItemEl(idx, itemEl) {
        for (let i = idx + 1; i < this.listItemEls.length; i++) {
            const nextEl = this.listItemEls[i]?.wrapper;
            if (nextEl) {
                this.listWrapperEl.insertBefore(itemEl, nextEl);
                return;
            }
        }
        this.listWrapperEl.appendChild(itemEl);
    }
    ensureItemEl(idx) {
        const existing = this.listItemEls[idx];
        if (existing)
            return existing;
        const chineseCharacter = this.chineseCharacters[idx];
        const itemEl = document.createElement("div");
        itemEl.classList.add("list-item");
        itemEl.classList.add("tier" + chineseCharacter.getTier());
        itemEl.addEventListener("click", () => {
            this.spawnItem(idx);
        });
        this.insertItemEl(idx, itemEl);
        const glyphEl = document.createElement("div");
        glyphEl.classList.add("list-item__glyph");
        glyphEl.innerText = chineseCharacter.glyph;
        itemEl.appendChild(glyphEl);
        const tierEl = document.createElement("div");
        tierEl.classList.add("list-item__tier");
        tierEl.innerText = "\u2605".repeat(chineseCharacter.getTier());
        itemEl.appendChild(tierEl);
        const idxEl = document.createElement("div");
        idxEl.classList.add("list-item__idx");
        idxEl.innerText = (idx + 1).toString();
        itemEl.appendChild(idxEl);
        const progressEl = document.createElement("div");
        progressEl.classList.add("list-item__progress");
        itemEl.appendChild(progressEl);
        const els = {
            wrapper: itemEl,
            glyph: glyphEl,
            tier: tierEl,
            index: idxEl,
            progress: progressEl
        };
        this.listItemEls[idx] = els;
        this.updateEl(idx);
        return els;
    }
    unlockItem(idx) {
        if (this.unlockedSet.has(idx))
            return;
        this.unlocked.push(idx);
        this.unlockedSet.add(idx);
        const els = this.ensureItemEl(idx);
        const chineseCharacter = this.chineseCharacters[idx];
        els.glyph.innerText = chineseCharacter.glyph;
        for (const shape of chineseCharacter.shapes) {
            this.updateEl(shape.index);
        }
        this.updateTitle();
    }
    update() {
        for (let i = 0; i < this.listItemEls.length; i++) {
            this.updateEl(i);
        }
    }
    updateTitle() {
        const titleEl = this.listTitleEl;
        const progress = this.unlocked.length / this.chineseCharacters.length;
        titleEl.innerText = `List (${this.unlocked.length}/${this.chineseCharacters.length})`;
        titleEl.style.setProperty("--progress", progress * 100 + "%");
    }
    updateEl(idx) {
        const els = this.listItemEls[idx];
        if (!els)
            return;
        const progress = this.getProgress(idx);
        els.progress.style.setProperty("--progress", progress * 100 + "%");
        if (progress === 1)
            els.wrapper.classList.add("completed");
        els.wrapper.style.display = progress >= 1 && this.hideCompleted ? "none" : "";
    }
    spawnItem(idx) {
        if (!this.unlockedSet.has(idx))
            return;
        this.game.field.addItem(this.chineseCharacters[idx]);
    }
    getProgress(idx) {
        const parents = this.chineseCharacters[idx].parents;
        if (parents.length === 0)
            return 1;
        const progress = parents.reduce((a, b) => a + (this.unlockedSet.has(b.index) ? 1 : 0), 0) / parents.length;
        return progress;
    }
    scrollToItem(idx) {
        const itemEl = this.listItemEls[idx]?.wrapper;
        if (itemEl) {
            itemEl.scrollIntoView({
                behavior: "smooth"
            });
        }
    }
}

export function useExtensions() {
    /**
     * Returns the pixels
     * @return {string}
     */
    Number.prototype.px = function () {
        return this.toString() + 'px';
    };

    /**
     * Returns the percents
     * @return {string}
     */
    Number.prototype.pc = function () {
        return this.toString() + '#';
    };

    /**
     * Sets the height
     * @param h
     */
    Element.prototype.setHeight = HTMLElement.prototype.setHeight = function (h) {
        this.style['height'] = typeof h === "number" ? h.px() : h;
    }
}
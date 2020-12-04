export class MainFrame {
    constructor() {

        this.elements = {
            appBar: document.querySelector(".app-bar"),
            appWrapper: document.querySelector(".app-wrapper"),
            appAreaText: document.querySelector("#text"),
            appAreaResults: document.querySelector("#results"),
            appAreaTypes: document.querySelector("#typings"),
            appFooter: document.querySelector(".app-footer"),
            appModules: document.querySelector(".app-modules"),
        }

        this.resize();
    }

    /**
     * Resize function
     */
    resize() {
        this.appHeight = window.innerHeight;
        this.appWidth = window.innerWidth;
        this.appBarHeight = this.elements.appBar.clientHeight;
        this.appFooterHeight = this.elements.appFooter.clientHeight;
        this.appModulesHeight = this.elements.appModules.clientHeight;

        // document.body.style['height'] = this.appHeight.px();
        // document.body.style['window'] = this.appWidth.px();

        const wrapperHeight = this.appHeight - (this.appBarHeight +
            this.appFooterHeight + this.appModulesHeight);
        this.elements.appWrapper.setHeight(wrapperHeight);
        this.elements.appAreaText.setHeight(wrapperHeight);
        this.elements.appAreaResults.setHeight(wrapperHeight);
        this.elements.appAreaTypes.setHeight(wrapperHeight);
    }

}
export class ModesFrame {

    constructor(props) {
        this.elements = {
            appModules: document.querySelector(".app-modules"),
            modes: document.querySelectorAll(".app-modules-item"),
        };

        // Event handlers
        this.onModeChanged = (m) => m;

        // Added events
        this.elements.modes.forEach(value => {
            const mode = value.getAttribute("data-toggle");
            value.onclick = () => {
                this.selectMode(mode);
            };
        });
        this.selectMode(props.initialMode);
    }

    /**
     * Selects the mode
     * @param mode
     */
    selectMode(mode) {
        this.elements.modes.forEach(value => {
            const m = value.getAttribute("data-toggle");
            value.classList.remove('--active');
            if (m === mode) {
                value.classList.add('--active');
                this.onModeChanged(mode);
            }
        })
    }

}
// Gestão de UI
export default class UIManager {
    constructor(app) {
        this.app = app;
        this.propertiesContainer = document.getElementById("properties-container");
        this.audioStatus = document.getElementById("audioStatus");
        this.audioLevel = document.getElementById("audioLevel");
        this.errorModal = document.getElementById("errorModal");
        this.errorMessage = document.getElementById("errorMessage");
        this.closeModalBtn = this.errorModal.querySelector(".close");

        this.setupEventListeners();
        this.updatePropertiesPanel();
    }

    setupEventListeners() {
        // Fecha modal de erro
        this.closeModalBtn?.addEventListener("click", () => {
            this.errorModal.classList.add("hidden");
        });
    }

    // Atualiza o estado dos botões dependendo se o áudio está a tocar
    setButtonStates(isPlaying) {
        const btnStart = document.getElementById("btnMicrophone");
        const btnStop = document.getElementById("btnStop");
        const fileInput = document.getElementById("audioFile");

        if (btnStart) btnStart.disabled = isPlaying;
        if (btnStop) btnStop.disabled = !isPlaying;
        if (fileInput) fileInput.disabled = isPlaying;

        this.audioStatus.textContent = `Áudio: ${isPlaying ? "A tocar" : "Parado"}`;
    }

    // Exibe modal de erro
    showError(message) {
        if (!this.errorModal || !this.errorMessage) return;
        this.errorMessage.textContent = message;
        this.errorModal.classList.remove("hidden");
    }

    // Atualiza o painel de propriedades com sliders ou inputs
    updatePropertiesPanel(props = null) {
        if (!this.propertiesContainer) return;
        this.propertiesContainer.innerHTML = "";

        // Se não passar props, tenta pegar da visualização atual
        if (!props && this.app.visualizationEngine.currentVisualization) {
            props = this.app.visualizationEngine.currentVisualization.getProperties();
        }
        if (!props) return;

        for (const [key, value] of Object.entries(props)) {
            const wrapper = document.createElement("div");
            wrapper.className = "property";

            const label = document.createElement("label");
            label.textContent = key;
            label.htmlFor = `prop-${key}`;

            let input;
            if (typeof value === "number") {
                input = document.createElement("input");
                input.type = "range";
                input.min = 0;
                input.max = 100;
                input.value = value;
            } else if (typeof value === "string" && value.startsWith("#")) {
                input = document.createElement("input");
                input.type = "color";
                input.value = value;
			}
			else if(typeof value === "boolean")
			{
				input = document.createElement("input");
				input.type = "checkbox";
				input.checked = value;
            } else {
                input = document.createElement("input");
                input.type = "text";
                input.value = value;
            }

            input.id = `prop-${key}`;
            input.addEventListener("input", (e) => {
				let val;
				if(e.target.type === "range")
					val = Number(e.target.value);
				else if(e.target.type === "checkbox")
					val = e.target.checked;
				else
					val = e.target.value;
                this.app.visualizationEngine.updateVisualizationProperty(key, val);
            });
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            this.propertiesContainer.appendChild(wrapper);
        }
    }

    // Atualiza o nível de áudio em tempo real
    updateAudioLevel(level) {
        if (this.audioLevel) {
            this.audioLevel.textContent = `Nível: ${Math.round(level * 100)}%`;
        }
    }
}

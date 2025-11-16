// js/visualizationEngine.js
import WaveformVisualization from './WaveformVisualization.js';
import SpectrumVisualization from './SpectrumVisualization.js';
import ParticleVisualization from './ParticleVisualization.js';

class VisualizationEngine {
  constructor(canvasId, audioProcessor) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;
    this.audioProcessor = audioProcessor; // Referência ao processador

    // Redimensiona automaticamente o canvas
    window.addEventListener("resize", () => this.resize());
    this.resize();

    // Inicializa os tipos de visualização disponíveis
    this.initVisualizations();
  }

  initVisualizations() {
    this.visualizations.set(
      "spectrum",
      new SpectrumVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "waveform",
      new WaveformVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "particles",
      new ParticleVisualization(this.canvas, this.audioProcessor)
    );
  }

  setVisualization(type) {
    if (this.visualizations.has(type)) {
      this.currentVisualization = this.visualizations.get(type);
      console.log(`Visualização atual definida: ${type}`);
      return true;
    } else {
      console.warn(`Tipo de visualização inválido: ${type}`);
      return false;
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;

    if (!this.currentVisualization) {
      this.setVisualization("spectrum");
    }

    console.log("Iniciando motor de visualização...");
    this.animationLoop();
  }

  stop() {
    if (!this.isRunning) return;

    cancelAnimationFrame(this.animationId);
    this.isRunning = false;
    console.log("Parando motor de visualização...");
  }

  animationLoop = () => {
    // Chama update() SÓ SE a referência do audioProcessor for válida.
    // Isto impede o crash inicial e permite que a visualização com dados de teste corra.
    if (this.audioProcessor) {
      this.audioProcessor.update();

		const level = this.audioProcessor.calculateAudioLevel();

		if(this.uiManager)
		{ 	
			this.uiManager.updateAudioLevel(level);
		}
	}
    // Atualiza e desenha a visualização
    if (this.currentVisualization) {
      this.currentVisualization.update();
      this.currentVisualization.draw();
    }

    // Solicita o próximo frame
    this.animationId = requestAnimationFrame(this.animationLoop);
  };
  resize() {
    // Ajusta o tamanho do canvas
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // Notifica a visualização ativa
    if (this.currentVisualization && this.currentVisualization.resize) {
      this.currentVisualization.resize(this.canvas.width, this.canvas.height);
    }
  }

  getVisualizationProperties() {
    return this.currentVisualization
      ? this.currentVisualization.getProperties()
      : {};
  }

  updateVisualizationProperty(property, value) {
    if (this.currentVisualization && this.currentVisualization.updateProperty) {
      this.currentVisualization.updateProperty(property, value);
      console.log(`Propriedade atualizada: ${property} = ${value}`);
    }
  }
}

export default VisualizationEngine;

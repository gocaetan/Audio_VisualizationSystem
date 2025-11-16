// Classe principal da aplicação
//criar todas as instâncias necessárias para a app
//Composição: App cria os objetos e controla o ciclo de vida.
import AudioProcessor from './AudioProcessor.js';
import VisualizationEngine from './VisualizationEngine.js';
import UIManager from './UIManager.js';
import ExportManager from './ExportManager.js';
//Agregação: AudioProcessor tem referência ao UIManager, mas não é dono.
export default class App {
  constructor() {
    this.audioProcessor = new AudioProcessor(); // captura e processa audio
    this.visualizationEngine = new VisualizationEngine(
      "audioCanvas",
      this.audioProcessor
    ); // desenha as visualizações no canva
    this.uiManager = new UIManager(this); //gerencia os controlos e painel de propriedades
	this.visualizationEngine.uiManager = this.uiManager;
    this.exportManager = new ExportManager(this.visualizationEngine); //permite explorar a visualização como imagem

    // Inicialização
    this.init(); //chama init para fazer configurações extra
  }

  init() {
    // TODO: inicializar a aplicação
    console.log("App inicializada");
    // Ligar botões HTML a métodos da App
    $(document).ready(() =>{

		$("#btnMicrophone").on("click", () => this.startMicrophone());
		$("#btnLoadFile").on("change", (e) => this.loadAudioFile(e.target.files[0]));
		$("#btnStop").on("click", () => this.stopAudio());
		$("#exportPNG").on("click", () => this.exportManager.exportAsPNG());
		$("#exportJPEG").on("click", () => this.exportManager.exportAsJPEG());

		this.visualizationEngine.start();

		$("#selectVisualization").on("change", (e) => this.setVisualization(e.target.value));

    	// Inicializa painel de propriedades
    	this.updatePropertiesPanel();
	});
  }
  //Métodos de áudio
  async startMicrophone() {
    try {
      await this.audioProcessor.startMicrophone();
      this.visualizationEngine.start();
      this.uiManager.setButtonStates(true);
    } catch (err) {
      this.uiManager.showError(err.message);
    }
  }
  async loadAudioFile(file) {
	console.log("A tentar carregar ficheiro");
    if (!file) return;
    try {
      await this.audioProcessor.loadAudioFile(file);
      this.visualizationEngine.start();
      this.uiManager.setButtonStates(true);
    } catch (err) {
      this.uiManager.showError(err.message);
    }
  }

  stopAudio() {
    this.audioProcessor.stop();
    this.visualizationEngine.stop();
    this.uiManager.setButtonStates(false);
  }
  //Atualiza a visualização no visualizationEngine
  setVisualization(type) {
    if (this.visualizationEngine.setVisualization(type)) {
      const props = this.visualizationEngine.getVisualizationProperties();
      this.uiManager.updatePropertiesPanel(props);
    }
  }
  // Atualiza o painel de propriedades com sliders ou inputs
  updatePropertiesPanel() {
    const props = this.visualizationEngine.getVisualizationProperties();
    this.uiManager.updatePropertiesPanel(props);
  }
  exportFrame() {
    this.exportManager.exportAsPNG();
  }

  destroy() {
    this.stopAudio();
    cancelAnimationFrame(this.visualizationEngine.animationId);
    console.log("Aplicação destruída");
  }
}

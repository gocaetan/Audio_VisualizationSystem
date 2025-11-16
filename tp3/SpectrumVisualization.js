import AudioVisualization from './AudioVisualization.js';

// Visualizações Concretas
export default class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas
    // 👇 Propriedades configuráveis em tempo real
    this.properties = {
      color: "#00ffcc",
      barWidth: 3,
      spacing: 1,
      intensity: 1.0,
    };
  }

  draw() {
    this.clearCanvas();
    const data = this.audioProcessor ? this.audioProcessor.getFrequencyData() : this.testData;
    const { color, barWidth, spacing, intensity } = this.properties;
    const width = this.canvas.width;
    const height = this.canvas.height;

    let x = 0;
    for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * height * intensity;
        this.ctx.fillStyle = color; // ou criar gradiente se quiser
        this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + spacing;
    }
}


  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}

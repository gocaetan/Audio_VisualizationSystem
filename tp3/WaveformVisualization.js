import AudioVisualization from './AudioVisualization.js';

export default class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas
    this.properties = {
      strokeColor: "#ff0055",
      lineWidth: 2,
      smoothness: 1.0,
    };
  }

  draw() {
	console.log("Desenhando...")
    this.clearCanvas();
    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const sliceWidth = width / data.length;

    this.ctx.beginPath();
    let y = height / 2; // centro vertical
    this.ctx.moveTo(0, y);

    for (let i = 0; i < data.length; i++) {
      y = (data[i] / 128.0) * (height / 2);
      this.ctx.lineTo(i * sliceWidth, y);
    }

    this.ctx.strokeStyle = this.properties.strokeColor;
	this.ctx.lineWidth = this.properties.lineWidth;

    this.ctx.stroke();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}

import AudioVisualization from './AudioVisualization.js';

export default class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";

    this.properties = {
      strokeColor: "#ff0055",
      lineWidth: 2,
      smoothness: 1.0,
    };
  }

  draw() {
    console.log("Desenhando...");
    this.clearCanvas();

    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const sliceWidth = width / data.length;

    this.ctx.beginPath();
    let prevY = height / 2;
    this.ctx.moveTo(0, prevY);

    for (let i = 0; i < data.length; i++) {
      let targetY = (data[i] / 128.0) * (height / 2);

      let y = (prevY * this.properties.smoothness + targetY) /
              (this.properties.smoothness + 1);

      this.ctx.lineTo(i * sliceWidth, y);
      prevY = y;
    }

    this.ctx.strokeStyle = this.properties.strokeColor;
    this.ctx.lineWidth = this.properties.lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    return super.getProperties();
  }
}


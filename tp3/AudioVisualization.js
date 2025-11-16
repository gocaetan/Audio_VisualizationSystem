// Classe Abstrata Base para Visualizações
class AudioVisualization {
  constructor(canvas, audioProcessor) {
    if (this.constructor === AudioVisualization) {
      throw new Error(
        "AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente."
      );
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.audioProcessor = audioProcessor;
    this.name = "Visualização";
    this.properties = {};
    this.testData = new Uint8Array(256);
    this.frameCount = 0;

    // Inicializar dados de teste
    for (let i = 0; i < this.testData.length; i++) {
      this.testData[i] = Math.sin(i / 10) * 128 + 128;
    }
  }
  

  draw() {
    throw new Error("Método draw() deve ser implementado pela subclasse.");
  }
// serve para atualizar variáveis internas a cada frame
  update() {
    // TODO: atualizar estado da visualização
    this.frameCount++;
  }
// Atualiza as dimensões do canvas
  resize(width, height) {
    // TODO: redimensionar visualização
    this.canvas.width = width;
    this.canvas.height = height;
  }
// permite ler ou alterar parâmetros da visualização dinamica, por ex: mudar a cor
  getProperties() {
    // TODO: obter propriedades da visualização
    return this.properties;
  }

  updateProperty(property, value) {
    // TODO: atualizar propriedade
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;
    }
  }
//Apaga o conteúdo anterior do canvas antes de desenhar o próximo frame.
  clearCanvas() {
    // TODO: limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid(spacing = 50, color = "rgba(255, 255, 255, 0.05)") {
  const { ctx, canvas } = this;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}
//Cria um gradiente linear para colorir as formas (barras, linhas, etc.).
  createGradient() {
    // TODO: criar gradiente de cores
    return this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  normalizeData() {
    if (!data || data.length === 0) return [];
    return Array.from(data).map(v => v / 255.0);
  }
}

export default AudioVisualization;

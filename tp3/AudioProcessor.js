// É a classe principal, crucial para captar som e preparar os dados para visualização, Processamento de Áudio.
//Define a classe que encapsula toda a lógica de áudio.
class AudioProcessor {
  constructor(uiManager) {
    this.uiManager = uiManager;//agregação
    //O construtor inicializa as propriedades com null ou valores padrão,  garantindo que não há residuos de execuções anteriores.
    this.audioContext = null; //definição e inicialização da variavel com valor null
    this.analyser = null;
    this.mediaStream = null;
    this.audioFileSource = null;
    this.mediaStreamSource = null; // para guardar o SourceNode
    this.frequencyData = new Uint8Array();
    this.waveformData = new Uint8Array();
    this.isPlaying = false;
    this.isPlayingFile = false;
  }
  // Método para inicializar o AudioContext e Analyser
  //Assegura se a aplicação tem tudo o que precisa para receber e analisar o áudio
  _initAudioContext() {
    //Verifica se AudioContext ainda não foi criado, impede a recriação do contexto, garantindo só uma instância
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      //cria o AnalyserNode que é um nó crucial ligado ao fluxo do audio, para espiar e extrair dados de frequência e dorma de onda, sem afetar o som, ou seja Permite a Análise de Áudio em tempo real.
      this.analyser = this.audioContext.createAnalyser();

      // Configurações do AnalyserNode
      this.analyser.fftSize = 2048; // definição do tamanho da FFT.
      const bufferLength = this.analyser.frequencyBinCount; //Define tamanho dos Arrays de dados
      this.frequencyData = new Uint8Array(bufferLength); //Cria o array de 8 bits (Uint8Array) com o tamanho de 1024. Este array irá armazenar os dados do espetro de frequência (barras).
      this.waveformData = new Uint8Array(bufferLength); //Cria outro array de 8 bits com o tamanho de 1024. Este array irá armazenar os dados da forma de onda (a amplitude do som ao longo do tempo).
    }
  }
  //captar audio em tempo real
  async startMicrophone() {
    this._initAudioContext();
    this.stop(); // Parar qualquer áudio anterior (microfone ou ficheiro)
    // 1. Política de Autoplay: Resume o contexto em resposta à ação do utilizador (clique).
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    try {
      // 2. Pedir permissão e obter o MediaStream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // 3. Criar a fonte de áudio a partir do stream
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );

      // 4. Conexão: Fonte -> Analyser -> Destino (opcional: colunas)
      this.mediaStreamSource.connect(this.analyser);
      // Se quiser ouvir o microfone, conecte ao destino:
      // this.analyser.connect(this.audioContext.destination);

      this.isPlaying = true;
      this.isPlayingFile = false;
      console.log("captura do microfone iniciada.");
      return true; // Sucesso
    } catch (error) {
      this.isPlaying = false;
      throw new Error(
        `Permissão de áudio negada: ${error.name}. Verifique se o microfone está ligado.`
      );
    }
  }
      // carregar ficheiros de áudio
  async loadAudioFile(file) {
    this._initAudioContext();
    this.stop(); // Parar qualquer áudio anterior (microfone ou ficheiro)
    // 1. Política de Autoplay: Resume o contexto.
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    // 2. Ler o ficheiro
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // 3. Descodificar o array buffer para um AudioBuffer
        const audioBuffer = await this.audioContext.decodeAudioData(
          e.target.result
        );

        // 4. Criar a nova fonte de buffer
        this.audioFileSource = this.audioContext.createBufferSource();
        this.audioFileSource.buffer = audioBuffer;


        // 5. Conexão: Fonte -> Analyser -> Destino (colunas)
        this.audioFileSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // 6. Configurar o loop (para reprodução contínua) e iniciar
        this.audioFileSource.loop = true;
        this.audioFileSource.start(0);

        this.isPlaying = true;
        this.isPlayingFile = true;
      } catch (error) {
        this.stop();
        console.error("Erro ao descodificar áudio:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  }
      // parar tudo e libertar recursos
  stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }

    if (this.audioFileSource) {
      this.audioFileSource.stop();
      this.audioFileSource.disconnect();
      this.audioFileSource = null;
    }

    this.isPlaying = false;
    this.isPlayingFile = false;

    if (this.audioContext && this.audioContext.state === "running") {
      this.audioContext.suspend();
    }

    console.log("Processamento de áudio parado.");
  }
// ler os  dados de áudio em tempo real
  update() {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.analyser.getByteTimeDomainData(this.waveformData);
    }
  }

  getFrequencyData() {
    return this.frequencyData;
  }

  getWaveformData() {
    return this.waveformData;
  }

  calculateAudioLevel() {
    if (!this.isPlaying) return 0;
    const data = this.frequencyData;
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    return sum / data.length / 255.0;
  }
}

export default AudioProcessor;

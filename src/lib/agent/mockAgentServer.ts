import { ChatMessage, ServerMessage } from './agentTypes';

/**
 * Servidor Mock local que simula el orquestador de agentes de OVNISTUDIO.
 */

const RESPUESTAS_INICIALES = [
  '¡Hola! Soy EVA, la IA de OVNISTUDIO. Creamos soluciones de inteligencia artificial local y sistemas cognitivos a medida, ¿te ayudo en algo?',
  '¡Bienvenido/a! Me presento: soy EVA. Estoy acá para mostrarte cómo optimizamos flujos de trabajo con agentes autónomos totalmente privados, ¿en qué te puedo colaborar hoy?',
];

const RESPUESTAS_CONSULTA = [
  'Con respecto a tu consulta: en OVNISTUDIO desarrollamos agentes de IA que funcionan 100% en tu infraestructura local. Esto garantiza privacidad total sin enviar información a servidores externos.',
  'Nuestra arquitectura RAG permite conectar tus bases de datos y documentos para que el agente responda preguntas con precisión y contexto actualizado.',
  'Podemos integrar automatizaciones personalizadas, gestión de leads y procesamiento de voz en tiempo real. ¿Te gustaría coordinar una demostración con nuestro equipo técnico?',
  'Totalmente. Nuestros sistemas están diseñados para ser ultra rápidos y adaptables a cualquier flujo empresarial. ¿Querés que profundicemos en algún aspecto en particular?',
];

export class MockAgentServer {
  private onMessageCallback?: (msg: ServerMessage) => void;
  private messageCount = 0;

  constructor(onMessage: (msg: ServerMessage) => void) {
    this.onMessageCallback = onMessage;
  }

  public async processTextMessage(userText: string): Promise<void> {
    if (!this.onMessageCallback) return;

    // Emitir estado 'processing'
    this.onMessageCallback({ type: 'status', status: 'processing' });

    await this.delay(600);

    const lower = userText.toLowerCase().trim();
    const esSaludo = ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'que tal'].some(s => lower.includes(s));

    let replyText = '';
    if (esSaludo) {
      replyText = RESPUESTAS_INICIALES[this.messageCount % RESPUESTAS_INICIALES.length];
    } else if (lower.includes('ovni') || lower.includes('que es')) {
      replyText = 'OVNISTUDIO es una plataforma de desarrollo de sistemas cognitivos e Inteligencia Artificial local privada. Creamos agentes autónomos que optimizan tus procesos sin exponer datos a terceros, ¿te gustaría conocer más o probar una demo?';
    } else {
      replyText = RESPUESTAS_CONSULTA[this.messageCount % RESPUESTAS_CONSULTA.length];
    }
    this.messageCount++;

    const messageId = `msg_${Date.now()}`;

    // Simular streaming de texto palabra por palabra
    const words = replyText.split(' ');
    this.onMessageCallback({ type: 'status', status: 'speaking' });

    for (let i = 0; i < words.length; i++) {
      const delta = (i === 0 ? '' : ' ') + words[i];
      const isDone = i === words.length - 1;

      this.onMessageCallback({
        type: 'text_stream',
        messageId,
        delta,
        isDone,
      });

      await this.delay(120);
    }

    // Emitir estado idle
    await this.delay(400);
    this.onMessageCallback({ type: 'status', status: 'idle' });
  }

  public async processAudioChunk(audioBlob: Blob): Promise<void> {
    if (!this.onMessageCallback) return;

    // Simular STT + respuesta
    this.onMessageCallback({ type: 'status', status: 'processing' });

    await this.delay(1000);

    // Simular respuesta del agente a la voz grabada
    const replyText =
      'Entendido tu mensaje de voz. En OVNISTUDIO automatizamos tus procesos con IA local privada.';
    const messageId = `msg_voice_${Date.now()}`;

    const words = replyText.split(' ');
    this.onMessageCallback({ type: 'status', status: 'speaking' });

    for (let i = 0; i < words.length; i++) {
      const delta = (i === 0 ? '' : ' ') + words[i];
      const isDone = i === words.length - 1;

      this.onMessageCallback({
        type: 'text_stream',
        messageId,
        delta,
        isDone,
      });

      await this.delay(100);
    }

    // Usar Web Speech API de voz sintetizada del navegador si está disponible para simular TTS
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(replyText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    await this.delay(500);
    this.onMessageCallback({ type: 'status', status: 'idle' });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

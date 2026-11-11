import { ChatMessage, ServerMessage } from './agentTypes';

/**
 * Servidor Mock local que simula el orquestador de agentes de OVNISTUDIO.
 */

const RESPUESTAS_INICIALES = [
  '¡Hola! Soy EVA, la IA de OVNISTUDIO. Desarrollamos software e integramos inteligencia artificial en sitios web y sistemas privados, ¿te ayudo con algún proyecto?',
  '¡Bienvenido/a! Soy EVA. Te muestro cómo copilotos de IA pueden atender consultas 24/7, guiar a tus usuarios y calificar leads en tu web o sistemas internos, ¿en qué te puedo colaborar?',
];

const RESPUESTAS_CONSULTA = [
  'Con respecto a tu consulta: desarrollamos sitios web y sistemas privados con agentes de IA integrados que funcionan como copilotos para tus usuarios.',
  'Nuestros copilotos pueden responder consultas complejas las 24 hs, navegar y recomendar productos o servicios del sitio, y guardar o calificar leads de forma automática.',
  'Podemos integrar estas soluciones tanto en páginas web públicas como en plataformas internas o sistemas de gestión privados con máxima seguridad.',
  'Totalmente. ¿Te gustaría coordinar una demo personalizada o ver cómo aplicarlo al sitio o sistema de tu negocio?',
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

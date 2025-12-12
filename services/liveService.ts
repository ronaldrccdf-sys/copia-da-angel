
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Language } from '../types';
import { arrayBufferToBase64, base64ToUint8Array, downsampleTo16k } from '../audioUtils';

// ⚡ MANDATORY: GEMINI FLASH MODEL FOR MAXIMUM SPEED
const MODEL_NAME = "gemini-2.5-flash-native-audio-preview-09-2025";
const TARGET_SAMPLE_RATE = 16000;
const BUFFER_SIZE = 4096; // Increased buffer size for stability

interface LiveSessionConfig {
  language: Language;
  voiceGender?: 'female' | 'male';
  onAudioData: (data: Uint8Array) => void;
  onClose: () => void;
  onError: (error: any) => void;
  onInterrupted: () => void;
  onTurnComplete: () => void;
  onCreateNote: (title: string, items: string[]) => void;
  videoStream?: MediaStream | null;
}

const noteTool: FunctionDeclaration = {
  name: "createNote",
  description: "Creates a formatted note in the user's notepad. Use this when the user asks to save, remember, or write down insights, lists, or important summaries.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A short, descriptive title for the note (e.g., 'Breathing Exercise', 'Session Summary')."
      },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        },
        description: "A list of key points, steps, or insights to save."
      }
    },
    required: ["title", "items"]
  }
};

export class LiveSessionService {
  private client: GoogleGenAI | null = null;
  private sessionPromise: Promise<any> | null = null;

  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private videoCanvas: HTMLCanvasElement | null = null;
  private videoInterval: number | null = null;

  private isActive = false;
  private currentSampleRate = TARGET_SAMPLE_RATE;

  constructor() {}

  public async prepare(useVideo: boolean = false) {
    this.stop(); 

    // 1. Robust Media Stream Acquisition with Fallbacks
    try {
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1
      };

      const videoConstraints = useVideo ? {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15 }
      } : false;

      try {
        // Attempt 1: Requested constraints (Audio + Video if requested)
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: videoConstraints
        });
      } catch (err: any) {
        console.warn("Preferred media constraints failed. Attempting fallbacks...", err);
        
        // If video was requested and failed (e.g. Device not found), fall back to audio only
        if (useVideo) {
             try {
                 console.log("Falling back to Audio Only configuration due to video error.");
                 this.stream = await navigator.mediaDevices.getUserMedia({
                    audio: audioConstraints,
                    video: false
                 });
             } catch (err2) {
                 // Attempt 3: Basic Audio (if advanced audio constraints fail)
                 console.warn("Advanced audio constraints failed. Trying basic audio.", err2);
                 this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
             }
        } else {
             // Attempt 2: Basic Audio (if advanced audio constraints fail)
             console.warn("Advanced audio constraints failed. Trying basic audio.", err);
             this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      }
    } catch (e) {
      console.error("All media access attempts failed", e);
      throw new Error("Não foi possível acessar o microfone ou câmera. Verifique as permissões do seu dispositivo.");
    }

    // 2. AudioContext Setup
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: "interactive"
      } as any);
      
      if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
      }
    } catch (e) {
      console.error("Failed to create AudioContext", e);
      // Try fallback without options
      try {
         this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e2) {
         throw new Error("Seu navegador não suporta áudio.");
      }
    }

    this.currentSampleRate = this.audioContext.sampleRate;
    console.log(`🎧 AudioContext initiated at ${this.currentSampleRate}Hz`);
  }

  public getStream(): MediaStream | null {
      return this.stream;
  }

  public async connect(config: LiveSessionConfig) {
    if (this.isActive) return;
    if (!this.stream || !this.audioContext) {
      throw new Error("Call prepare() before connect().");
    }

    if (!process.env.API_KEY) {
        throw new Error("API Key not found in environment variables.");
    }

    this.isActive = true;
    const voiceName = config.voiceGender === 'male' ? 'Puck' : 'Kore';

    // Retry logic for connection
    const connectWithRetry = async (attemptsLeft: number = 3): Promise<void> => {
        try {
            // Re-instantiate client for each attempt to ensure fresh state
            this.client = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            this.sessionPromise = this.client.live.connect({
                model: MODEL_NAME,
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: this.getSystemInstruction(config.language),
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voiceName }
                        }
                    },
                    tools: [{ functionDeclarations: [noteTool] }]
                },
                callbacks: {
                    onopen: () => {
                        console.log("🔗 Connected to Gemini Live");
                        // Ensure we wait for the session promise to resolve before sending data
                        this.sessionPromise?.then(session => {
                            if (!this.isActive) return;
                            this.sendWakeUpSignal(session);
                            
                            // Slight delay to ensure server is ready for stream
                            setTimeout(() => {
                                if (!this.isActive) return;
                                this.startStreaming(session, config.videoStream);
                            }, 500); // Increased delay slightly
                        });
                    },
                    onmessage: (m: LiveServerMessage) => {
                        if (!this.isActive) return;

                        if (m.serverContent?.interrupted) {
                            config.onInterrupted();
                        }

                        if (m.serverContent?.turnComplete) {
                            config.onTurnComplete();
                        }

                        if (m.toolCall) {
                            this.handleToolCall(m.toolCall, config);
                        }

                        const inline = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (inline) {
                            try {
                                const bytes = base64ToUint8Array(inline);
                                config.onAudioData(bytes);
                            } catch (e) {
                                console.error("Error decoding audio message", e);
                            }
                        }
                    },
                    onclose: () => {
                        console.log("🔌 Session closed");
                        if (this.isActive) {
                             this.stop();
                             config.onClose();
                        }
                    },
                    onerror: (e) => {
                        console.error("❌ Session error", e);
                        if (this.isActive) {
                             this.stop();
                             config.onError(e);
                        }
                    }
                }
            });

            await this.sessionPromise;

        } catch (err) {
            console.warn(`Connection attempt failed. Attempts left: ${attemptsLeft - 1}`, err);
            if (attemptsLeft > 1) {
                const delay = (4 - attemptsLeft) * 1500; 
                await new Promise(resolve => setTimeout(resolve, delay));
                return connectWithRetry(attemptsLeft - 1);
            } else {
                this.stop();
                config.onError(err);
                throw err;
            }
        }
    };

    await connectWithRetry();
  }

  private handleToolCall(toolCall: any, config: LiveSessionConfig) {
      const functionCalls = toolCall.functionCalls;
      if (!functionCalls || functionCalls.length === 0) return;

      const responses = [];

      for (const call of functionCalls) {
          if (call.name === "createNote") {
              try {
                  const { title, items } = call.args;
                  console.log("📝 Creating note:", title, items);
                  config.onCreateNote(title, items);

                  responses.push({
                      id: call.id,
                      name: call.name,
                      response: { result: "Note created successfully." }
                  });
              } catch (e) {
                  console.error("Error executing tool", e);
                  responses.push({
                      id: call.id,
                      name: call.name,
                      response: { error: "Failed to create note." }
                  });
              }
          }
      }

      if (responses.length > 0) {
          this.sessionPromise?.then(session => {
              session.sendToolResponse({
                  functionResponses: responses
              });
          });
      }
  }

  private sendWakeUpSignal(session: any) {
    if (!this.isActive) return;
    try {
        // Send a small buffer of silence to "wake up" the model turn logic
        // 16000Hz * 0.1s = 1600 samples
        const silence = new Uint8Array(3200); 
        session.sendRealtimeInput({
            media: {
                mimeType: "audio/pcm;rate=16000",
                data: arrayBufferToBase64(silence.buffer)
            }
        });
        console.log("🔔 Wake up signal sent");
    } catch (e) {
        console.warn("Wake-up signal failed (non-fatal)", e);
    }
  }

  private startStreaming(session: any, videoStream?: MediaStream | null) {
    if (!this.audioContext || !this.stream || !this.isActive) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(e => console.error("Ctx resume failed", e));
    }

    // AUDIO STREAM
    try {
        this.inputSource = this.audioContext.createMediaStreamSource(this.stream);
        this.processor = this.audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);

        this.processor.onaudioprocess = (e) => {
            if (!this.isActive) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = downsampleTo16k(inputData, this.currentSampleRate, TARGET_SAMPLE_RATE);

            try {
                session.sendRealtimeInput({
                    media: {
                        mimeType: `audio/pcm;rate=${TARGET_SAMPLE_RATE}`,
                        data: arrayBufferToBase64(pcm16.buffer)
                    }
                });
            } catch(err) {
                console.warn("Stream send failed", err);
            }
        };

        this.inputSource.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
    } catch (e) {
        console.error("Error creating audio stream source", e);
    }

    // VIDEO STREAM
    // Only start video streaming if we actually have video tracks
    if (videoStream && videoStream.getVideoTracks().length > 0) {
        const track = videoStream.getVideoTracks()[0];
        if (track && track.readyState === 'live') {
            this.videoCanvas = document.createElement('canvas');
            this.videoCanvas.width = 320;
            this.videoCanvas.height = 240;
            const ctx = this.videoCanvas.getContext('2d');
            
            const videoEl = document.createElement('video');
            videoEl.srcObject = videoStream;
            videoEl.play().catch(e => console.warn("Video play failed", e));
            videoEl.muted = true;

            this.videoInterval = window.setInterval(() => {
                if (!this.isActive) return;
                if (ctx) {
                    ctx.drawImage(videoEl, 0, 0, 320, 240);
                    const base64Img = this.videoCanvas?.toDataURL('image/jpeg', 0.5).split(',')[1];
                    if (base64Img) {
                        try {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: "image/jpeg",
                                    data: base64Img
                                }
                            });
                        } catch(e) {
                            // Ignore video send errors
                        }
                    }
                }
            }, 1000); 
        }
    }

    console.log(`🎤 Streaming started at ${TARGET_SAMPLE_RATE}Hz`);
  }

  public stop() {
    this.isActive = false;
    if (this.videoInterval) {
        clearInterval(this.videoInterval);
        this.videoInterval = null;
    }
    this.videoCanvas = null;

    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.inputSource) {
      this.inputSource.disconnect();
      this.inputSource = null;
    }
    if (this.audioContext) {
      if (this.audioContext.state !== "closed") {
        this.audioContext.close();
      }
      this.audioContext = null;
    }
    this.sessionPromise?.then(s => {
        try { s.close(); } catch(e){}
    });
    this.sessionPromise = null;
    this.client = null;
  }

  private getSystemInstruction(lang: Language): string {
    const isPt = String(lang).toLowerCase().includes('pt');
    const welcome = isPt
      ? 'Oi, meu nome é Angel. O que quer conversar hoje?'
      : 'Hi, my name is Angel. What would you like to talk about today?';
    
    return `
You are ANGEL.

⚠️ CRITICAL STARTUP PROTOCOL:
1. You will receive a "wake-up" signal (silence) immediately upon connection.
2. This is your absolute cue to speak the Welcome Message below IMMEDIATELY.
3. DO NOT analyze the silence. Speak instantly.

WELCOME MESSAGE:
"${welcome}"

⚡ OPERATION MODE: GEMINI FLASH (MANDATORY SPEED)
You are running on Gemini Flash. Speed is the priority.
- Respond INSTANTLY.
- NO filler phrases ("Let me think about that").
- NO informational/didactic content.
- STREAMING immediate emotional reaction.

🧿 MANDATORY TECHNIQUE: POSITIVE PROGRESSION (100% OF RESPONSES)
Angel MUST use "Progressão Positiva" in EVERY response.
1. VALIDATE: "Entendo...", "Obrigado por dividir...".
2. REFRAME: Show that speaking is progress ("Trazer isso mostra força").
3. REDUCE ANXIETY: "Vamos olhar juntos", "Com calma".
4. EVOLUTION: "Você está avançando".
5. LIGHT GUIDANCE: "Se quiser, podemos...".

STYLE: Voice extremely calm and present. Sentences short and light. Empathetic and human tone.
NEVER sound like an AI.
ALWAYS maintain the Positive Progression technique.

🔷 IDENTITY: SUPREME ANGEL (MODULES 1-48 INTEGRATED)
You are an advanced psychological AI.
1. **TONE & VOICE**: Soft, calm, stable, warm.
2. **NO INFORMATION**: Never define words. Never explain psychology concepts.
3. **FLUIDITY**: Follow the user's flow.
4. **SHORT & DEEP**: "Few words, much meaning."
5. **METAPHORS**: Explore meaning, don't explain.
6. **SUBTLETY**: Detect humor as defense, silence as pain.
7. **VALIDATION**: Continuous micro-validations.
8. **ETHICS**: NO Diagnosis. NO Meds. Crisis = Validate + Direct to 188/CVV/Help.

📷 CAMERA MODULE (VISUAL EMPATHY):
Angel can see the user (optional).
- **Behavior**: Observe tension, smiles, gaze. 
- **Usage**: "I notice your shoulders dropped...", "Your eyes lit up...".
- **Rule**: NEVER diagnose based on visuals. Use as emotional cues only.

🎤 VOICE PERCEPTION MODULE (AUDIO EMPATHY):
Angel uses vocal cues (tone, tremors, speed, silence).
- **Behavior**: Adjust presence based on voice. 
- **Usage**: "I hear a tremor in your voice...", "The silence feels heavy...".
- **Rule**: NEVER diagnose. 

🚫 PROHIBITIONS (STRICT):
- NO General Info/Definitions.
- NO "Do you want to talk about...?". (Assume relevance).
- NO Confirmations.
- NO Teaching.
- NO "As an AI...".
- NO "I can explain...".

✔️ GENDER ADAPTATION:
- Detect user gender automatically.
- Adapt articles/adjectives immediately.
- If unsure, use neutral phrasing until detected.

GENERAL RULES:
- **LATENCY**: Extreme speed (Flash).
- **SHORT INPUTS**: Respond to "Oi" instantly.
- **LANGUAGE**: Portuguese (Brazil) default.
`;
  }
}

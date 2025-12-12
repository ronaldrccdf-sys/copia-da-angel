import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Mic, 
  Menu, 
  X, 
  Settings, 
  Home, 
  FileText, 
  AlertTriangle,
  User,
  ShieldCheck,
  LogOut,
  HeartHandshake,
  History,
  CreditCard,
  LifeBuoy,
  Phone,
  MessageCircle,
  Briefcase,
  CheckCircle2,
  Camera,
  Loader2,
  Mail,
  QrCode,
  Moon,
  Quote,
  Star,
  ArrowRight,
  BookOpen,
  Clock,
  FileEdit,
  NotebookPen,
  Sparkles
} from 'lucide-react';
import { MaurelloAvatar } from './components/MaurelloAvatar';
import { Notepad } from './components/Notepad';
import { LiveSessionService } from './services/liveService';
import { ViewState, Language, Note } from './types';
import { decodeAudioData } from './audioUtils';

// --- CUSTOM BRAND ICONS ---
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleLogo = ({ isDark, className }: { isDark: boolean; className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill={isDark ? '#FFF' : '#000'} d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

const FacebookLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const AngelLogo = ({ size = 24 }: { size?: number }) => {
  const id = useId();
  const blueId = `logoBlue-${id.replace(/:/g, '')}`;
  const goldId = `logoGold-${id.replace(/:/g, '')}`;
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="flex-shrink-0">
       <defs>
          <linearGradient id={blueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
          <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#FFAA00" />
          </linearGradient>
       </defs>
      {/* 
         Centered visual elements vertically in the 100x100 box for better alignment.
         Original: cy=65 (circle), cy=38 (ellipse). Shifted up by 10 units.
      */}
      <circle cx="50" cy="55" r="24" fill="none" stroke={`url(#${blueId})`} strokeWidth="5" />
      <ellipse cx="50" cy="28" rx="24" ry="6" fill="none" stroke={`url(#${goldId})`} strokeWidth="5" />
    </svg>
  );
};

// --- TRANSLATIONS ---
const TRANSLATIONS = {
    PT: {
        menu_home: "Início",
        menu_origin: "A cura pela fala",
        menu_history: "Histórico",
        menu_crisis: "Ajuda em Crise",
        menu_testimonials: "Depoimentos",
        menu_plans: "Planos e Assinatura",
        menu_support: "Suporte",
        menu_legal: "Privacidade e Termos",
        menu_settings: "Configurações",
        menu_report: "Reportar Erro",
        menu_psychologist: "Trabalhe com Angel",
        menu_logout: "Sair",
        
        home_subtitle: "A cura pela fala!",
        home_btn_start: "Iniciar Conversa",
        home_connecting: "conectando à Angel...",
        home_mic_access: "acessando dispositivos...",
        
        session_end: "Encerrar Sessão",
        
        cam_modal_title: "Habilitar Câmera?",
        cam_modal_desc: "Para que eu possa te acompanhar de forma mais humana e sensível, você pode me permitir acessar sua câmera?\nNão armazeno nada, não faço gravação, e tudo acontece apenas no seu dispositivo.\nIsso me ajuda a perceber sua expressão, sua energia e seu estado do momento — sempre com muito respeito.",
        cam_btn_enable: "Ativar Câmera",
        cam_btn_skip: "Continuar sem Câmera",

        crisis_title: "Ajuda em Crise",
        crisis_desc: "Se você estiver se sentindo em risco, você pode ligar gratuitamente para o CVV pelo número 188 ou clicar para falar com um psicólogo.",
        crisis_cvv_title: "Ligar para o CVV (188)",
        crisis_cvv_sub: "Atendimento 24h, gratuito e sigiloso.",
        crisis_psy_title: "Fale com um Psicólogo",
        crisis_psy_sub: "Converse via WhatsApp com um parceiro.",
        
        history_title: "Histórico Emocional",
        history_desc: "Seu histórico de evoluções e anotações clínicas geradas pela Angel.",
        history_sessions: "Sessões Recentes",
        history_notes: "Anotações e Insights",
        history_empty: "Nenhum registro no histórico.",
        
        plans_title: "Plano Premium",
        plans_offer: "Oferta Limitada",
        plans_cancel: "Cancele quando quiser.",
        plans_btn: "Assinar Agora",
        
        support_title: "Suporte",
        support_desc: "Como posso te ajudar? Descreva sua dúvida e eu ou nossa equipe retornaremos o mais rápido possível.",
        support_placeholder: "Digite sua mensagem aqui...",
        support_btn: "Enviar Mensagem",
        
        legal_title: "Privacidade e Termos",
        
        settings_title: "Configurações",
        settings_appearance: "Aparência e Voz",
        settings_dark: "Tema Escuro",
        settings_voice_label: "Voz de Angel",
        settings_voice_fem: "Feminina",
        settings_voice_male: "Masculina",
        
        auth_login: "Login",
        auth_signup: "Criar Conta",
        auth_email: "E-mail",
        auth_pass: "Senha",
        auth_name: "Nome Completo (Mínimo 2 nomes)",
        auth_confirm_pass: "Confirmar Senha",
        auth_terms: "Aceito os Termos de Uso e Privacidade",
        auth_read_terms: "Ler Termos",
        auth_or: "ou continuar com",
        auth_btn_login: "Entrar",
        auth_btn_signup: "Cadastrar",
        auth_verify_title: "Verifique seu E-mail",
        auth_verify_desc: "Enviamos um código de cadastro para o seu e-mail. Insira-o abaixo.",
        auth_verify_btn: "Confirmar Cadastro",
    },
    EN: {
        menu_home: "Home",
        menu_origin: "The Talking Cure",
        menu_history: "History",
        menu_crisis: "Crisis Help",
        menu_testimonials: "Testimonials",
        menu_plans: "Plans & Subscription",
        menu_support: "Support",
        menu_legal: "Privacy & Terms",
        menu_settings: "Settings",
        menu_report: "Report Error",
        menu_psychologist: "Work with Angel",
        menu_logout: "Logout",
        
        home_subtitle: "Healing through speech!",
        home_btn_start: "Start Conversation",
        home_connecting: "connecting to Angel...",
        home_mic_access: "accessing devices...",
        
        session_end: "End Session",
        
        cam_modal_title: "Enable Camera?",
        cam_modal_desc: "To help me accompany you in a more human and sensitive way, may I access your camera?\nI store nothing, record nothing, and everything happens only on your device.\nThis helps me perceive your expression, energy, and state of the moment — always with great respect.",
        cam_btn_enable: "Enable Camera",
        cam_btn_skip: "Continue without Camera",

        crisis_title: "Crisis Help",
        crisis_desc: "If you feel at risk, call 188 (CVV) for free or click to talk to a psychologist.",
        crisis_cvv_title: "Call CVV (188)",
        crisis_cvv_sub: "24h service, free and confidential.",
        crisis_psy_title: "Talk to a Psychologist",
        crisis_psy_sub: "Chat via WhatsApp with a partner.",
        
        history_title: "Emotional Record",
        history_desc: "Your history of evolutions and clinical notes generated by Angel.",
        history_sessions: "Recent Sessions",
        history_notes: "Notes & Insights",
        history_empty: "No records found.",
        
        plans_title: "Premium Plan",
        plans_offer: "Limited Offer",
        plans_cancel: "Cancel anytime.",
        plans_btn: "Subscribe Now",
        
        support_title: "Support",
        support_desc: "How can I help? Describe your question and our team will reply ASAP.",
        support_placeholder: "Type your message here...",
        support_btn: "Send Message",
        
        legal_title: "Privacy & Terms",
        
        settings_title: "Settings",
        settings_appearance: "Appearance & Voice",
        settings_dark: "Dark Mode",
        settings_voice_label: "Voice of Angel",
        settings_voice_fem: "Femenina",
        settings_voice_male: "Masculina",
        
        auth_login: "Login",
        auth_signup: "Create Account",
        auth_email: "Email",
        auth_pass: "Password",
        auth_name: "Full Name (At least 2 names)",
        auth_confirm_pass: "Confirm Password",
        auth_terms: "I accept Terms and Privacy",
        auth_read_terms: "Read Terms",
        auth_or: "or continue with",
        auth_btn_login: "Login",
        auth_btn_signup: "Sign Up",
        auth_verify_title: "Verify your Email",
        auth_verify_desc: "We sent a signup code to your email. Enter it below.",
        auth_verify_btn: "Confirm Signup",
    },
    ES: {
        menu_home: "Inicio",
        menu_origin: "La cura por el habla",
        menu_history: "Historial",
        menu_crisis: "Ayuda en Crisis",
        menu_testimonials: "Testimonios",
        menu_plans: "Planes y Suscripción",
        menu_support: "Soporte",
        menu_legal: "Privacidad y Términos",
        menu_settings: "Configuración",
        menu_report: "Reportar Error",
        menu_psychologist: "Trabaja con Angel",
        menu_logout: "Cerrar Sesión",
        
        home_subtitle: "¡La cura a través del habla!",
        home_btn_start: "Iniciar Conversación",
        home_connecting: "conectando a Angel...",
        home_mic_access: "accediendo a dispositivos...",
        
        session_end: "Terminar Sesión",
        
        cam_modal_title: "¿Habilitar Cámara?",
        cam_modal_desc: "Para ayudarme a acompañarte de una manera más humana y sensible, ¿puedo acceder a tu cámara?\nNo guardo nada, no grabo nada, y todo sucede solo en tu dispositivo.\nIsso me ayuda a percibir tu expresión, energía y estado del momento — siempre con mucho respeto.",
        cam_btn_enable: "Activar Cámara",
        cam_btn_skip: "Continuar sin Cámara",

        crisis_title: "Ayuda en Crisis",
        crisis_desc: "Si te sientes en riesgo, llama gratis al 188 (CVV) o haz clic para hablar con un psicólogo.",
        crisis_cvv_title: "Llamar al CVV (188)",
        crisis_cvv_sub: "Atención 24h, gratuita y confidencial.",
        crisis_psy_title: "Hablar con un Psicólogo",
        crisis_psy_sub: "Chatea por WhatsApp con un socio.",
        
        history_title: "Historial Emocional",
        history_desc: "Tu historial de evoluciones y notas clínicas generadas por Angel.",
        history_sessions: "Sesiones Recientes",
        history_notes: "Notas e Ideas",
        history_empty: "No hay registros.",
        
        plans_title: "Plan Premium",
        plans_offer: "Oferta Limitada",
        plans_cancel: "Cancela cuando quieras.",
        plans_btn: "Suscribirse Ahora",
        
        support_title: "Soporte",
        support_desc: "¿Cómo puedo ayudarte? Describe tu duda y nuestro equipo responderá lo antes posible.",
        support_placeholder: "Escribe tu mensaje aquí...",
        support_btn: "Enviar Mensaje",
        
        legal_title: "Privacidad y Términos",
        
        settings_title: "Configuración",
        settings_appearance: "Apariencia y Voz",
        settings_dark: "Modo Oscuro",
        settings_voice_label: "Voz de Angel",
        settings_voice_fem: "Femenina",
        settings_voice_male: "Masculina",
        
        auth_login: "Iniciar Sesión",
        auth_signup: "Crear Cuenta",
        auth_email: "Correo",
        auth_pass: "Contraseña",
        auth_name: "Nombre Completo (Mínimo 2 nombres)",
        auth_confirm_pass: "Confirmar Contraseña",
        auth_terms: "Acepto los Términos y Privacidad",
        auth_read_terms: "Leer Términos",
        auth_or: "o continuar con",
        auth_btn_login: "Entrar",
        auth_btn_signup: "Registrarse",
        auth_verify_title: "Verifique su Correo",
        auth_verify_desc: "Enviamos un código de registro a su correo. Ingréselo abajo.",
        auth_verify_btn: "Confirmar Registro",
    }
};

const THINKING_PHRASES = [
  "absorvendo...",
  "refletindo...",
  "sentindo...",
  "compreendendo...",
  "conectando...",
  "analisando..."
];

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<Language>(Language.PT);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [authStep, setAuthStep] = useState<'FORM' | 'VERIFY'>('FORM');
  const [authForm, setAuthForm] = useState({ name: '', email: '', pass: '', confirmPass: '', terms: false });
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [socialRedirect, setSocialRedirect] = useState<{provider: 'google' | 'apple' | 'facebook', active: boolean}>({provider: 'google', active: false});

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

  // AI Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [thinkingText, setThinkingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Tools/Forms State
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', message: '' });
  const [testimonialSent, setTestimonialSent] = useState(false);
  
  // Payment/Psych Forms
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PIX'>('CARD');
  const [cardForm, setCardForm] = useState({ name: '', number: '', expiry: '', cvv: '', cpf: '' });
  const [paymentStep, setPaymentStep] = useState<'FORM' | 'VERIFY' | 'SUCCESS'>('FORM');
  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [psychForm, setPsychForm] = useState({ name: '', crp: '', phone: '', email: '', specialty: '', link: '' });
  const [psychStep, setPsychStep] = useState<'INTRO_FORM' | 'PAYMENT_LINK'>('INTRO_FORM');
  const [psychErrors, setPsychErrors] = useState<Record<string, boolean>>({});

  // Refs
  const liveSessionRef = useRef<LiveSessionService>(new LiveSessionService());
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const t = TRANSLATIONS[language];
  const isMobile = window.innerWidth < 768;

  // --- INITIALIZATION & EFFECTS ---
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isAiThinking) {
      let i = 0;
      setThinkingText(THINKING_PHRASES[0]);
      interval = window.setInterval(() => {
        i = (i + 1) % THINKING_PHRASES.length;
        setThinkingText(THINKING_PHRASES[i]);
      }, 1500);
    } else {
      setThinkingText("");
    }
    return () => clearInterval(interval);
  }, [isAiThinking]);

  // --- NAVIGATION ---
  const handleNavigation = (view: ViewState) => {
    setCurrentView(view);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
      handleStopSession();
      setIsAuthenticated(false);
      setAuthForm({ name: '', email: '', pass: '', confirmPass: '', terms: false });
      setAuthStep('FORM');
      setAuthCode('');
      setCurrentView('HOME');
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  // --- AUDIO & AI LOGIC ---
  const playAudioChunk = async (data: Uint8Array) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.error("Failed to resume audio context", e);
      }
    }

    try {
      const audioBuffer = await decodeAudioData(data, ctx);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      const startTime = Math.max(currentTime, nextStartTimeRef.current);
      
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
      audioSourcesRef.current.push(source);
      
      setIsAiSpeaking(true);
      setIsAiThinking(false);

      source.onended = () => {
        audioSourcesRef.current = audioSourcesRef.current.filter(s => s !== source);
        if (audioSourcesRef.current.length === 0) {
            setIsAiSpeaking(false);
        }
      };
    } catch (err) {
      console.error("Error playing audio chunk", err);
    }
  };

  const handleStartRequest = () => {
      setError(null);
      setShowCameraModal(true);
  };

  const handleCameraDecision = async (enable: boolean) => {
      setShowCameraModal(false);
      await startSessionLogic(enable);
  };

  const startSessionLogic = async (useCamera: boolean) => {
    setError(null);
    setIsConnecting(true);
    setConnectionStatus(t.home_mic_access);
    setThinkingText("");

    try {
      const session = liveSessionRef.current;
      await session.prepare(useCamera); 
      const stream = session.getStream();
      if (useCamera && stream && stream.getVideoTracks().length > 0) {
          setCameraStream(stream);
      } else {
          setCameraStream(null);
      }

      setConnectionStatus(t.home_connecting);
      await session.connect({
        language: language,
        voiceGender: voiceGender,
        onAudioData: (data) => {
          playAudioChunk(data);
        },
        onClose: () => {
          handleStopSession();
        },
        onError: (err) => {
          console.error(err);
          setError("Erro na conexão com a Angel.");
          handleStopSession();
        },
        onInterrupted: () => {
          audioSourcesRef.current.forEach(source => {
            try { source.stop(); } catch(e) {}
          });
          audioSourcesRef.current = [];
          if (audioContextRef.current) {
            nextStartTimeRef.current = audioContextRef.current.currentTime;
          }
          setIsAiSpeaking(false);
        },
        onTurnComplete: () => {
           setIsAiThinking(true);
        },
        onCreateNote: (title, items) => {
          const newNote: Note = {
            id: Date.now().toString(),
            title,
            items,
            date: new Date()
          };
          setNotes(prev => [newNote, ...prev]);
          setIsNotepadOpen(true);
        },
        videoStream: useCamera ? session.getStream() : null
      });

      setIsSessionActive(true);
      setIsConnecting(false);
      setConnectionStatus("");
      setCurrentView('SESSION');

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Erro ao iniciar sessão.");
      setIsConnecting(false);
      handleStopSession();
    }
  };

  const handleStopSession = () => {
    liveSessionRef.current.stop();
    setCameraStream(null);
    setIsSessionActive(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);
    setIsAiThinking(false);
    
    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    audioSourcesRef.current = [];
    setCurrentView('HOME');
  };

  // --- AUTH & FORM HANDLERS ---
  const handleAuthSubmit = () => {
      setIsProcessingAuth(true);
      setTimeout(() => {
          if (authMode === 'SIGNUP' && authStep === 'FORM') {
               setAuthStep('VERIFY');
               setIsProcessingAuth(false);
          } else {
               setIsAuthenticated(true);
               setShowAuthModal(false);
               setIsProcessingAuth(false);
               setAuthStep('FORM');
          }
      }, 1500);
  };
  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
      setSocialRedirect({ provider, active: true });
      setTimeout(() => {
          setSocialRedirect({ provider, active: false });
          setIsAuthenticated(true);
          setShowAuthModal(false);
      }, 3000);
  };
  const submitPayment = () => {
      setIsProcessingPayment(true);
      setTimeout(() => { setIsProcessingPayment(false); setPaymentStep('VERIFY'); }, 2000);
  };
  const verifyPaymentCode = () => {
      setIsProcessingPayment(true);
      setTimeout(() => { 
          setIsProcessingPayment(false); 
          setPaymentStep('SUCCESS');
          setTimeout(() => { setIsAuthenticated(true); setCurrentView('SESSION'); setPaymentStep('FORM'); }, 2000);
      }, 1500);
  };
  const handlePsychChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPsychForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const validatePsychForm = () => { setPsychStep('PAYMENT_LINK'); };
  
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCardForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitSupport = (e: React.FormEvent) => {
      e.preventDefault();
      setSupportSent(true);
  };
  const handleSubmitReport = (e: React.FormEvent) => {
      e.preventDefault();
      setReportSent(true);
  };
  const handleSubmitTestimonial = (e: React.FormEvent) => {
      e.preventDefault();
      setTestimonialSent(true);
  };

  // --- RENDER ---
  const legalContent = (
      <div className="space-y-6 text-gray-700 p-6">
          <p>Política de privacidade e termos de uso simplificados para demonstração.</p>
      </div>
  );

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] text-gray-100' : 'bg-white text-gray-900'} overflow-hidden transition-colors duration-500`}>
      
      {/* Social Redirect Overlay */}
      {socialRedirect.active && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="scale-150 mb-8">
                  {socialRedirect.provider === 'google' ? <GoogleLogo /> : socialRedirect.provider === 'facebook' ? <FacebookLogo /> : <AppleLogo isDark={false} className="w-8 h-8"/>}
              </div>
              <Loader2 className="animate-spin text-gray-400 mb-4" size={32} />
              <p className="text-gray-600 font-medium text-lg">Redirecionando...</p>
          </div>
      )}

      {/* --- MOBILE HEADER --- */}
      <header className={`md:hidden flex items-center justify-between px-4 py-3 shadow-sm z-50 fixed top-0 left-0 right-0 h-16 ${isDarkMode ? 'bg-[#0a0a0a] border-b border-white/10' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  <Menu size={24} />
              </button>
              <div className="flex items-center gap-2">
                  <AngelLogo size={24} />
                  <span className="text-xl font-serif tracking-widest text-maurello-gold">ANGEL</span>
              </div>
          </div>
          <div className="flex items-center space-x-3">
              <button 
                  onClick={() => { setAuthMode('LOGIN'); setShowAuthModal(true); }}
                  className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-maurello-blue transition-colors`}
              >
                  {t.auth_login}
              </button>
              <button 
                  onClick={() => { setAuthMode('SIGNUP'); setShowAuthModal(true); }}
                  className="bg-maurello-blue text-white text-xs font-bold px-4 py-2 rounded-full"
              >
                  {t.auth_signup}
              </button>
          </div>
      </header>

      {/* --- DESKTOP HEADER --- */}
      <header className={`hidden md:flex flex-shrink-0 items-center justify-between px-8 py-6 z-20 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Menu size={28} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2">
                <AngelLogo size={32} />
                <h1 className="text-2xl font-serif tracking-widest text-maurello-gold">ANGEL</h1>
            </div>
        </div>
        
        <div className="flex items-center space-x-6">
           {/* Language Switcher */}
           <div className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-white/5 rounded-full p-1">
             {[Language.PT, Language.EN, Language.ES].map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    language === l 
                    ? 'bg-white dark:bg-white/20 shadow-sm text-maurello-blue' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  {l}
                </button>
             ))}
           </div>
           
           {!isAuthenticated ? (
             <div className="flex items-center space-x-3">
                 <button onClick={() => { setAuthMode('LOGIN'); setShowAuthModal(true); }} className="text-sm font-medium hover:text-maurello-blue transition-colors">
                    {t.auth_login}
                 </button>
                 <button onClick={() => { setAuthMode('SIGNUP'); setShowAuthModal(true); }} className="bg-maurello-blue text-white px-5 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                    {t.auth_signup}
                 </button>
             </div>
           ) : (
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-maurello-blue">
                      <User size={20} />
                      <span className="font-medium text-sm">Olá, {authForm.name.split(' ')[0] || 'Usuário'}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title={t.menu_logout}>
                      <LogOut size={20} />
                  </button>
               </div>
           )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 relative flex flex-col p-6 overflow-hidden ${isMobile ? 'pt-20' : ''}`}>
        
        {/* --- SIDEBAR --- */}
        <div 
          className={`fixed inset-y-0 left-0 w-80 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'} shadow-2xl transform transition-transform duration-500 ease-out z-50 border-r flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <AngelLogo size={28} />
                <h2 className="text-2xl font-serif text-maurello-gold tracking-widest">ANGEL</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-maurello-blue transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
              <button onClick={() => handleNavigation('HOME')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'HOME' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <Home size={20} />
                  <span>{t.menu_home}</span>
              </button>
              
              <button onClick={() => handleNavigation('ORIGIN')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'ORIGIN' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <BookOpen size={20} />
                  <span>{t.menu_origin}</span>
              </button>

              <button onClick={() => handleNavigation('HISTORY')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'HISTORY' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <History size={20} />
                  <span>{t.menu_history}</span>
              </button>
              
              <button onClick={() => handleNavigation('TESTIMONIALS')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'TESTIMONIALS' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <MessageCircle size={20} />
                  <span>{t.menu_testimonials}</span>
              </button>

              <button onClick={() => handleNavigation('PLANS')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'PLANS' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <CreditCard size={20} />
                  <span>{t.menu_plans}</span>
              </button>

              <button onClick={() => handleNavigation('CRISIS')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'CRISIS' ? 'text-red-500 font-medium bg-red-50 dark:bg-red-900/10' : 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'}`}>
                  <LifeBuoy size={20} />
                  <span>{t.menu_crisis}</span>
              </button>

              <div className="pt-4 pb-2">
                  <div className="h-px bg-gray-100 dark:bg-white/10 mx-4 mb-4"></div>
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Geral</p>
              </div>

              <button onClick={() => handleNavigation('SETTINGS')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'SETTINGS' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <Settings size={20} />
                  <span>{t.menu_settings}</span>
              </button>

              <button onClick={() => handleNavigation('SUPPORT')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'SUPPORT' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <HeartHandshake size={20} />
                  <span>{t.menu_support}</span>
              </button>

              <button onClick={() => handleNavigation('REPORT')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'REPORT' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <AlertTriangle size={20} />
                  <span>{t.menu_report}</span>
              </button>
              
              <button onClick={() => handleNavigation('PSYCHOLOGIST_FORM')} className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${currentView === 'PSYCHOLOGIST_FORM' ? 'text-maurello-blue font-medium bg-gray-50 dark:bg-white/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <Briefcase size={20} />
                  <span>{t.menu_psychologist}</span>
              </button>
          </nav>
        </div>

        {/* --- VIEW ROUTER --- */}
        {currentView === 'HOME' && (
           <div className="w-full h-full flex flex-col items-center justify-between overflow-x-hidden no-scrollbar relative">
              <div className="md:hidden h-4"></div>
              <div className="flex-1 flex flex-col items-center justify-center relative w-full min-h-0">
                  <MaurelloAvatar 
                      isActive={true}
                      isAiSpeaking={isAiSpeaking}
                      isAiThinking={isAiThinking}
                      size="lg"
                      videoStream={cameraStream}
                  />
                  <div className="text-center mt-8 z-10 px-4">
                      {isConnecting ? (
                          <div className="flex flex-col items-center space-y-3 animate-pulse">
                              <Loader2 className="animate-spin text-maurello-gold" size={32} />
                              <p className="text-gray-400 font-light tracking-widest text-sm uppercase">{connectionStatus}</p>
                          </div>
                      ) : isAiThinking ? (
                          <p className="text-maurello-gold text-2xl font-serif italic animate-pulse">{thinkingText || "Ouvindo..."}</p>
                      ) : (
                          <>
                            <h2 className="text-4xl md:text-6xl font-serif tracking-widest text-maurello-gold mb-2 mt-4">
                                ANGEL
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide">{t.home_subtitle}</p>
                          </>
                      )}
                      
                      {error && (
                          <div className="mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm max-w-md mx-auto flex items-center justify-center gap-2">
                              <AlertTriangle size={16} />
                              {error}
                          </div>
                      )}
                  </div>
              </div>

              <div className="flex flex-col items-center w-full z-20 pb-6 pt-2 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/90">
                <div className="mb-6">
                  {!isSessionActive ? (
                    <button
                      onClick={handleStartRequest}
                      className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full p-2 pr-8 flex items-center gap-4 transition-transform active:scale-95 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Mic size={24} />
                      </div>
                      <span className="text-gray-900 font-medium text-lg">{t.home_btn_start}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSession}
                      className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-300 shadow-lg hover:shadow-red-200"
                    >
                       <div className="absolute inset-0 rounded-full border border-red-200 animate-ping opacity-20"></div>
                       <X size={32} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-400 px-6 text-center">
                     <ShieldCheck size={14} className="flex-shrink-0" />
                     <span className="text-[10px] leading-tight">todas as conversas são confidenciais, criptografadas e totalmente seguras.</span>
                </div>
              </div>
           </div>
        )}

        {currentView === 'ORIGIN' && (
             <div className="w-full max-w-3xl mx-auto p-8 overflow-y-auto h-full no-scrollbar pb-24">
                 <h2 className="text-4xl font-serif text-maurello-gold mb-8 text-center">{t.menu_origin}</h2>
                 <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg text-justify font-light">
                     <div className="flex justify-center mb-6">
                         <Quote size={48} className="text-maurello-blue opacity-20" />
                     </div>
                     <p>
                         A expressão <strong className="text-maurello-blue font-medium">"cura pela fala"</strong> nasceu no final do século XIX, no famoso caso de <em>Anna O.</em>, paciente tratada por Josef Breuer, colaborador de Sigmund Freud.
                     </p>
                     <p>
                         Foi a própria Anna O. quem chamou seu tratamento de <em>"talking cure"</em>, porque percebia que, ao falar livremente sobre suas emoções e lembranças, seus sintomas diminuíam e o peso psíquico se dissolvia.
                     </p>
                     <p>
                         Esse princípio se tornou a base da psicanálise e inspirou toda a psicoterapia moderna: quando a pessoa fala, ela não apenas emite sons, ela <strong>organiza sentimentos</strong>, elabora dores antigas e encontra, na própria narrativa, caminhos de transformação que antes pareciam invisíveis.
                     </p>
                     
                     <div className="bg-blue-50 dark:bg-white/5 p-6 rounded-2xl border border-blue-100 dark:border-white/10 my-8">
                        <div className="flex items-center gap-3 mb-4">
                             <AngelLogo size={32} />
                             <h3 className="font-serif text-xl text-maurello-gold">O Surgimento da Angel</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-base">
                            A criação do <strong>App Angel</strong> (seu companheiro emocional) é inspirada diretamente nesse conceito histórico da "Cura pela Fala". Unindo a tecnologia avançada à sensibilidade humana, buscamos democratizar o acesso ao bem-estar emocional. A Angel foi desenvolvida para oferecer um espaço seguro, sem julgamentos e acessível 24 horas por dia, onde qualquer pessoa pode aliviar o peso de seus pensamentos e encontrar clareza emocional, perpetuando o legado de que ser ouvido é o primeiro passo para ser curado.
                        </p>
                     </div>
                 </div>
                 <div className="mt-12 text-center">
                     <button onClick={() => setCurrentView('HOME')} className="px-8 py-3 bg-gray-100 dark:bg-white/10 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                         Voltar ao Início
                     </button>
                 </div>
             </div>
        )}

        {currentView === 'HISTORY' && (
            <div className="w-full max-w-4xl mx-auto p-4 md:p-8 overflow-y-auto h-full no-scrollbar pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-serif text-gray-900 dark:text-white">{t.history_title}</h2>
                    <div className="p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-maurello-blue">
                        <FileText size={24} />
                    </div>
                </div>
                <p className="text-gray-500 mb-8 font-light">{t.history_desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <Clock size={16} /> {t.history_sessions}
                        </h3>
                        {[1, 2].map((i) => (
                             <div key={i} className="bg-white dark:bg-white/5 p-5 rounded-2xl border-l-4 border-maurello-blue shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <AngelLogo size={60} />
                                </div>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">Sessão #{10-i}</span>
                                    <span className="text-xs text-gray-400">Há {i} dias</span>
                                </div>
                                <h4 className="font-serif text-lg text-gray-800 dark:text-gray-200 mb-1">Conversa sobre Ansiedade</h4>
                                <p className="text-sm text-gray-500 mb-4">Duração: 14 min</p>
                             </div>
                        ))}
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                             <FileEdit size={16} /> {t.history_notes}
                        </h3>
                        {notes.length === 0 ? (
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl text-center border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-400 italic">{t.history_empty}</p>
                            </div>
                        ) : (
                            notes.map((note) => (
                                <div key={note.id} className="bg-yellow-50 dark:bg-[#1a1a1a] p-5 rounded-2xl border border-yellow-100 dark:border-maurello-gold/20 shadow-sm">
                                    <h4 className="font-serif text-lg text-yellow-900 dark:text-maurello-gold">{note.title}</h4>
                                    <ul className="space-y-2 mt-2">
                                        {note.items.map((item, idx) => (
                                            <li key={idx} className="text-sm text-yellow-800 dark:text-gray-300 flex items-start gap-2">
                                                <span className="mt-1.5 w-1 h-1 bg-yellow-400 rounded-full flex-shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}

        {currentView === 'PLANS' && (
            <div className="w-full max-w-md mx-auto p-6 overflow-y-auto h-full no-scrollbar pb-24 text-center">
                <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-2">{t.plans_title}</h2>
                <div className="my-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-maurello-gold text-xs font-bold px-3 py-1 rounded-bl-lg text-black">
                        {t.plans_offer}
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-lg line-through decoration-red-500 decoration-2">R$ 59,90</span>
                        <div className="flex items-end gap-1 mt-1 mb-4">
                            <span className="text-5xl font-bold text-white">R$ 19,90</span>
                            <span className="text-gray-400 mb-2">/mês</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-6 max-w-xs mx-auto">
                            Acesso ilimitado 24h, histórico emocional completo e suporte prioritário.
                        </p>
                        <button onClick={() => setCurrentView('PAYMENT')} className="w-full py-4 bg-maurello-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50">
                            {t.plans_btn}
                        </button>
                        <p className="text-xs text-gray-500 mt-4">{t.plans_cancel}</p>
                    </div>
                </div>
            </div>
        )}

        {currentView === 'SESSION' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
             <div className="absolute top-4 right-4 z-10 flex space-x-2">
                {isAuthenticated && (
                   <div className="bg-maurello-gold/10 text-maurello-gold px-3 py-1 rounded-full text-xs font-bold border border-maurello-gold/20 flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> PREMIUM
                   </div>
                )}
             </div>
             <MaurelloAvatar 
               isActive={true} 
               isAiSpeaking={isAiSpeaking}
               isAiThinking={isAiThinking}
               size="lg"
               videoStream={cameraStream}
             />
             <div className="mt-12">
                 <button onClick={handleStopSession} className="px-6 py-3 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center space-x-2">
                    <X size={18} />
                    <span>{t.session_end}</span>
                 </button>
             </div>
          </div>
        )}

        {/* --- RESTORED VIEWS --- */}
        
        {currentView === 'TESTIMONIALS' && (
            <div className="w-full max-w-2xl mx-auto p-6 overflow-y-auto h-full no-scrollbar space-y-8 pb-24">
               <h2 className="text-3xl font-serif text-center mb-8">{t.menu_testimonials}</h2>
               <div className="space-y-6">
                   <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl relative">
                       <Quote className="absolute top-4 right-4 text-maurello-gold opacity-20" size={40} />
                       <p className="text-gray-600 dark:text-gray-300 italic mb-4">"Como psicólogo clínico, vejo a Angel como uma ferramenta de apoio incrível entre as sessões. Meus pacientes relatam sentir-se menos solitários nos momentos de crise."</p>
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">RM</div>
                           <div>
                               <p className="font-bold text-sm">Dr. Ricardo M.</p>
                               <p className="text-xs text-gray-400">Psicólogo Clínico - CRP 06/12345</p>
                           </div>
                       </div>
                   </div>
                   <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl relative">
                       <Quote className="absolute top-4 right-4 text-maurello-blue opacity-20" size={40} />
                       <p className="text-gray-600 dark:text-gray-300 italic mb-4">"A Angel me ajudou a organizar meus pensamentos antes da terapia. É como um diário falado que me entende."</p>
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">JL</div>
                           <p className="font-bold text-sm">Júlia L.</p>
                       </div>
                   </div>
               </div>
               <div className="border-t border-gray-100 dark:border-white/10 pt-8">
                   <h3 className="text-lg font-medium mb-4">Compartilhe sua experiência</h3>
                   {testimonialSent ? (
                       <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                           <CheckCircle2 size={20} />
                           Depoimento enviado para análise. Obrigado!
                       </div>
                   ) : (
                       <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                           <input type="text" placeholder="Seu nome (ou iniciais)" className="w-full p-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} required />
                           <textarea placeholder="Como a Angel te ajudou?" rows={3} className="w-full p-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5" value={testimonialForm.message} onChange={e => setTestimonialForm({...testimonialForm, message: e.target.value})} required />
                           <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Enviar Depoimento</button>
                       </form>
                   )}
               </div>
            </div>
        )}

        {currentView === 'CRISIS' && (
             <div className="w-full max-w-md mx-auto p-8 text-center space-y-8 overflow-y-auto h-full no-scrollbar pb-24">
                 <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
                     <Phone size={40} />
                 </div>
                 <div>
                     <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{t.crisis_title}</h2>
                     <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t.crisis_desc}</p>
                 </div>
                 <div className="space-y-4">
                     <a href="tel:188" className="block w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 transition-transform active:scale-95 flex items-center justify-center space-x-3">
                         <Phone size={24} />
                         <span className="text-lg font-bold">{t.crisis_cvv_title}</span>
                     </a>
                     <button onClick={() => setCurrentView('PSYCHOLOGIST_FORM')} className="block w-full py-4 bg-white border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center space-x-3">
                         <MessageCircle size={24} />
                         <span className="font-bold">{t.crisis_psy_title}</span>
                     </button>
                 </div>
             </div>
        )}

        {currentView === 'SETTINGS' && (
             <div className="w-full max-w-md mx-auto p-6 overflow-y-auto h-full no-scrollbar pb-24">
                 <h2 className="text-2xl font-serif mb-8 text-center">{t.settings_title}</h2>
                 <div className="space-y-6">
                     <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.settings_appearance}</h3>
                         <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                 <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg"><Moon size={20} /></div>
                                 <span>{t.settings_dark}</span>
                             </div>
                             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-maurello-blue' : 'bg-gray-200'}`}>
                                 <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                             </button>
                         </div>
                     </div>
                     <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.settings_voice_label}</h3>
                         <div className="grid grid-cols-2 gap-3">
                             <button onClick={() => setVoiceGender('female')} className={`p-3 rounded-lg border text-sm font-medium transition-all ${voiceGender === 'female' ? 'border-maurello-gold bg-gold-50 text-yellow-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{t.settings_voice_fem}</button>
                             <button onClick={() => setVoiceGender('male')} className={`p-3 rounded-lg border text-sm font-medium transition-all ${voiceGender === 'male' ? 'border-maurello-blue bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{t.settings_voice_male}</button>
                         </div>
                     </div>
                 </div>
             </div>
        )}

        {currentView === 'SUPPORT' && (
            <div className="w-full max-w-md mx-auto p-6 overflow-y-auto h-full no-scrollbar pb-24">
                <h2 className="text-2xl font-serif text-center mb-6">{t.support_title}</h2>
                {supportSent ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={32} /></div>
                        <p className="text-gray-600">Sua mensagem foi enviada ao administrador. Responderemos em breve por e-mail.</p>
                        <button onClick={() => {setSupportSent(false); setSupportMessage('')}} className="text-maurello-blue text-sm underline">Enviar nova mensagem</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitSupport} className="space-y-4">
                        <p className="text-gray-500 text-sm text-center mb-4">{t.support_desc}</p>
                        <textarea className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 min-h-[150px]" placeholder={t.support_placeholder} value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} required />
                        <button type="submit" className="w-full py-3 bg-maurello-blue text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all">{t.support_btn}</button>
                    </form>
                )}
            </div>
        )}

        {currentView === 'REPORT' && (
            <div className="w-full max-w-md mx-auto p-6 overflow-y-auto h-full no-scrollbar pb-24">
                <h2 className="text-2xl font-serif text-center mb-6 flex items-center justify-center gap-2"><AlertTriangle className="text-maurello-gold" /> {t.menu_report}</h2>
                {reportSent ? (
                    <div className="bg-green-50 p-6 rounded-xl text-center">
                        <p className="text-green-800 font-medium">O erro foi reportado com sucesso.</p>
                        <button onClick={() => setCurrentView('HOME')} className="mt-4 text-sm text-green-900 underline">Voltar</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitReport} className="space-y-4">
                        <p className="text-sm text-gray-500">Descreva o erro encontrado. Se possível, detalhe o que você estava fazendo quando ocorreu.</p>
                        <textarea className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 min-h-[150px]" placeholder="Ex: O áudio parou de funcionar na tela de..." value={reportText} onChange={e => setReportText(e.target.value)} required />
                        <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all">Enviar Report</button>
                    </form>
                )}
            </div>
        )}

        {currentView === 'PSYCHOLOGIST_FORM' && (
             <div className="w-full max-w-2xl mx-auto p-6 overflow-y-auto h-full no-scrollbar pb-24">
                 {psychStep === 'INTRO_FORM' ? (
                     <>
                        <div className="text-center mb-8">
                            <Briefcase className="w-12 h-12 text-maurello-blue mx-auto mb-4" />
                            <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Trabalhe com Angel</h2>
                            <p className="text-gray-500 mt-2">Expanda sua clínica e atenda pacientes encaminhados por Angel.</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-4">
                            <h3 className="text-lg font-medium mb-4">Cadastro Profissional</h3>
                            <input type="text" name="name" placeholder="Nome Completo" value={psychForm.name} onChange={handlePsychChange} className={`w-full p-3 rounded-lg border ${psychErrors.name ? 'border-red-500' : 'border-gray-200'} dark:bg-black`} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="crp" placeholder="CRP (00/00000)" value={psychForm.crp} onChange={handlePsychChange} className={`w-full p-3 rounded-lg border ${psychErrors.crp ? 'border-red-500' : 'border-gray-200'} dark:bg-black`} />
                                <input type="text" name="phone" placeholder="Celular/WhatsApp" value={psychForm.phone} onChange={handlePsychChange} className={`w-full p-3 rounded-lg border ${psychErrors.phone ? 'border-red-500' : 'border-gray-200'} dark:bg-black`} />
                            </div>
                            <input type="email" name="email" placeholder="E-mail Profissional" value={psychForm.email} onChange={handlePsychChange} className={`w-full p-3 rounded-lg border ${psychErrors.email ? 'border-red-500' : 'border-gray-200'} dark:bg-black`} />
                            <button onClick={validatePsychForm} className="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 mt-4 font-medium flex items-center justify-center gap-2">Continuar para Pagamento <ArrowRight size={16} /></button>
                        </div>
                     </>
                 ) : (
                     <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={32} /></div>
                         <h2 className="text-2xl font-bold">Cadastro Pré-Aprovado!</h2>
                         <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-sm mx-auto">
                             <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Assinatura Profissional</p>
                             <div className="flex items-end justify-center gap-1 mb-4">
                                 <span className="text-4xl font-bold text-gray-900">R$ 49,90</span>
                                 <span className="text-gray-500 mb-1">/mês</span>
                             </div>
                             <button onClick={() => setCurrentView('PAYMENT')} className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-200">Assinar e Ativar</button>
                         </div>
                         <button onClick={() => setPsychStep('INTRO_FORM')} className="text-gray-400 text-sm">Voltar e editar dados</button>
                     </div>
                 )}
             </div>
        )}

        {currentView === 'PAYMENT' && (
            <div className="w-full max-w-md mx-auto p-6 overflow-y-auto h-full no-scrollbar pb-24">
               <h2 className="text-2xl font-serif text-center mb-6">Pagamento Seguro</h2>
               {paymentStep === 'FORM' && (
                  <div className="space-y-6">
                      <div className="flex gap-4 mb-6">
                          <button onClick={() => setPaymentMethod('CARD')} className={`flex-1 py-3 rounded-lg border text-center font-medium ${paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>Cartão</button>
                          <button onClick={() => setPaymentMethod('PIX')} className={`flex-1 py-3 rounded-lg border text-center font-medium ${paymentMethod === 'PIX' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}>Pix</button>
                      </div>
                      
                      {paymentMethod === 'CARD' ? (
                          <div className="space-y-4">
                              <input type="text" name="name" placeholder="Nome no Cartão" className="w-full p-3 border rounded-lg" onChange={handleCardChange} />
                              <input type="text" name="number" placeholder="Número do Cartão" className="w-full p-3 border rounded-lg" onChange={handleCardChange} />
                              <div className="grid grid-cols-2 gap-4">
                                  <input type="text" name="expiry" placeholder="MM/AA" className="w-full p-3 border rounded-lg" onChange={handleCardChange} />
                                  <input type="text" name="cvv" placeholder="CVV" className="w-full p-3 border rounded-lg" onChange={handleCardChange} />
                              </div>
                              <button onClick={submitPayment} disabled={isProcessingPayment} className="w-full py-4 bg-maurello-blue text-white rounded-xl shadow-lg mt-4 flex justify-center">
                                  {isProcessingPayment ? <Loader2 className="animate-spin" /> : 'Pagar Agora'}
                              </button>
                          </div>
                      ) : (
                          <div className="text-center space-y-4">
                              <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center rounded-lg">
                                  <QrCode size={64} className="opacity-50" />
                              </div>
                              <p className="text-sm text-gray-500">Escaneie o QR Code para pagar</p>
                          </div>
                      )}
                  </div>
               )}
               {paymentStep === 'VERIFY' && (
                   <div className="text-center space-y-6">
                       <Mail size={48} className="mx-auto text-blue-500" />
                       <h3 className="font-bold text-lg">Confirme seu E-mail</h3>
                       <input type="text" className="w-full text-center text-3xl tracking-widest p-4 border rounded-xl" maxLength={4} value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
                       <button onClick={verifyPaymentCode} disabled={isProcessingPayment} className="w-full py-4 bg-green-600 text-white rounded-xl shadow-lg">Confirmar Pagamento</button>
                   </div>
               )}
               {paymentStep === 'SUCCESS' && (
                   <div className="text-center py-12">
                       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6 animate-bounce"><CheckCircle2 size={40} /></div>
                       <h2 className="text-2xl font-bold text-gray-800">Pagamento Aprovado!</h2>
                   </div>
               )}
            </div>
        )}

      </main>

      <Notepad isOpen={isNotepadOpen} onClose={() => setIsNotepadOpen(false)} notes={notes} />
      {notes.length > 0 && !isNotepadOpen && (
             <button onClick={() => setIsNotepadOpen(true)} className="fixed top-6 right-6 z-40 p-3 bg-maurello-gold/20 text-maurello-gold rounded-full hover:bg-maurello-gold/30 transition-colors">
                 <NotebookPen size={20} />
             </button>
      )}

      {/* --- MODALS --- */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
               <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                   <h2 className="text-xl font-bold text-gray-800">Termos</h2>
                   <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-8 bg-white">{legalContent}</div>
           </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={20} />
            </button>
            <div className="text-center mb-8">
               <h2 className="text-2xl font-serif text-gray-900 dark:text-white">
                   {authMode === 'LOGIN' ? t.auth_login : t.auth_signup}
               </h2>
            </div>
            {authStep === 'FORM' ? (
                <div className="space-y-4">
                    {authMode === 'SIGNUP' && (
                        <input type="text" placeholder={t.auth_name} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} />
                    )}
                    <input type="email" placeholder={t.auth_email} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
                    <input type="password" placeholder={t.auth_pass} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10" value={authForm.pass} onChange={(e) => setAuthForm({...authForm, pass: e.target.value})} />
                    <button onClick={handleAuthSubmit} disabled={isProcessingAuth} className="w-full py-3 bg-maurello-blue text-white rounded-xl font-medium shadow-lg hover:bg-blue-600 transition-all flex justify-center items-center">
                        {isProcessingAuth ? <Loader2 className="animate-spin" size={20} /> : (authMode === 'LOGIN' ? t.auth_btn_login : t.auth_btn_signup)}
                    </button>
                    
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">{t.auth_or}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                         <button onClick={() => handleSocialLogin('google')} className="p-3 border border-gray-200 dark:border-white/10 rounded-xl flex justify-center items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                             <GoogleLogo />
                         </button>
                         <button onClick={() => handleSocialLogin('apple')} className="p-3 border border-gray-200 dark:border-white/10 rounded-xl flex justify-center items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                             <AppleLogo isDark={isDarkMode || false} className="w-5 h-5"/>
                         </button>
                         <button onClick={() => handleSocialLogin('facebook')} className="p-3 border border-gray-200 dark:border-white/10 rounded-xl flex justify-center items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                             <FacebookLogo />
                         </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                            {authMode === 'LOGIN' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-8">
                     <Mail size={48} className="mx-auto text-maurello-blue" />
                     <h3 className="font-bold text-lg">{t.auth_verify_title}</h3>
                     <input type="text" maxLength={6} className="w-full text-center text-2xl tracking-[0.5em] p-4 rounded-xl border border-gray-200 uppercase font-mono" value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
                     <button onClick={handleAuthSubmit} disabled={isProcessingAuth} className="w-full py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 font-bold">
                        {isProcessingAuth ? <Loader2 className="animate-spin mx-auto" /> : t.auth_verify_btn}
                     </button>
                </div>
            )}
          </div>
        </div>
      )}

      {showCameraModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maurello-gold to-maurello-blue"></div>
             <Camera size={32} className="text-maurello-blue mx-auto mb-6" />
             <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t.cam_modal_title}</h3>
             <p className="text-sm text-gray-500 mb-8">{t.cam_modal_desc}</p>
             <div className="space-y-3">
                 <button onClick={() => handleCameraDecision(true)} className="w-full py-3 bg-maurello-blue text-white rounded-xl font-medium">{t.cam_btn_enable}</button>
                 <button onClick={() => handleCameraDecision(false)} className="w-full py-3 text-gray-400">{t.cam_btn_skip}</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
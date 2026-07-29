import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, X, Volume2, VolumeX, Video, Sparkles, CheckCircle2, Film, Tv, ShieldCheck, Cpu, Globe, Database } from 'lucide-react';

interface VideoPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  duration: number; // in seconds
  narration: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: "Traducteur Neuronal Fongbe–Français",
    subtitle: "Présentation du Projet FFR-v1 • Traitement Automatique du Langage Naturel",
    duration: 7,
    narration: "Bienvenue dans la présentation de notre projet de Traduction Neuronale Fongbe-Français, conçu pour les langues à faibles ressources."
  },
  {
    id: 2,
    title: "Contexte & Problématique Linguistique",
    subtitle: "2.2M Locuteurs • Langue à Tonalité Complexe • Rareté des Corpus Numériques",
    duration: 8,
    narration: "Le Fongbe compte plus de deux millions de locuteurs en Afrique de l'Ouest. La rareté des corpus parallèles et la complexité des tons diacritiques posaient jusqu'ici un verrou scientifique majeur."
  },
  {
    id: 3,
    title: "Méthodologie & Architecture IA",
    subtitle: "Data Augmentation • Fine-Tuning LoRA (r=8, α=32) • Garde-fous Éthiques",
    duration: 8,
    narration: "Pour résoudre ce problème, nous combinons l'augmentation de données synthétiques, le fine-tuning léger par LoRA et un filtrage éthique contre les hallucinations."
  },
  {
    id: 4,
    title: "Démonstration de Traduction en Direct",
    subtitle: "Précision Diacritique & Conservation de la Structure Tonale",
    duration: 8,
    narration: "Le système traduit avec fidélité les expressions Fongbe en préservant la richesse sémantique, les tons et les accents essentiels à la compréhension."
  },
  {
    id: 5,
    title: "Résultats & Impact Numérique",
    subtitle: "Score BLEU > 15.2 • Exactitude Tonale 88% • Inclusion Digitale",
    duration: 7,
    narration: "Avec un score BLEU supérieur à 15 et une précision tonale de 88 %, ce projet offre une solution concrète pour l'inclusion linguistique et numérique."
  }
];

export default function VideoPresentationModal({ isOpen, onClose }: VideoPresentationModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 1
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  // --- VOICE OVER SYNTHESIS ---
  const speakNarration = (text: string) => {
    if (isAudioMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // --- CANVAS RENDERING ENGINE (1080p HD Canvas) ---
  const drawCanvasScene = (ctx: CanvasRenderingContext2D, scene: Scene, progress: number, totalTime: number) => {
    const width = 1280;
    const height = 720;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#09090b'); // zinc-950
    bgGrad.addColorStop(0.5, '#18181b'); // zinc-900
    bgGrad.addColorStop(1, '#052e16'); // dark emerald tint
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Animated Tech Grid Lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    const offset = (totalTime * 20) % gridSize;
    for (let x = offset; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = offset; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Top Header Banner
    ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
    ctx.fillRect(40, 30, width - 80, 60);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.15)';
    ctx.strokeRect(40, 30, width - 80, 60);

    // Badge FFR-v1
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(60, 43, 100, 34, 6);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('FFR-v1 TALN', 72, 65);

    // Header Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('PRÉSENTATION VIDÉO DU PROJET • TRADUCTION FONGBE', 180, 65);

    // Scene Counter Indicator
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Chapitre ${scene.id} / ${SCENES.length}`, width - 180, 65);

    // --- MAIN SCENE CONTENT AREA ---
    ctx.save();
    const alpha = Math.min(1, Math.sin(progress * Math.PI)); // Fade in and out effect
    ctx.globalAlpha = Math.max(0.2, alpha);

    // Large Animated Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(scene.title, 80, 170);

    // Subtitle
    ctx.fillStyle = '#10b981';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillText(scene.subtitle, 80, 210);

    // Scene-specific visual graphics
    if (scene.id === 1) {
      // Intro Logo & Waveform Graphic
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.beginPath();
      ctx.roundRect(80, 260, 1120, 320, 16);
      ctx.fill();

      // Giant Symbol
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 120px Inter, serif';
      ctx.fillText('Fɔ́', 140, 420);

      ctx.fillStyle = '#e4e4e7';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('Plateforme Interactive de Traduction & Analyse de Langue Fongbe', 320, 360);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Projet d\'inclusion numérique par le Traitement Automatique des Langues à Faibles Ressources', 320, 400);

      // Animated Soundwave
      ctx.fillStyle = '#10b981';
      for (let i = 0; i < 30; i++) {
        const barHeight = 20 + Math.sin(totalTime * 5 + i * 0.4) * 35;
        ctx.fillRect(320 + i * 16, 450 - barHeight / 2, 8, barHeight);
      }
    } else if (scene.id === 2) {
      // Contexte cards
      const cards = [
        { title: "2.2+ Millions", desc: "Locuteurs de Fongbe en Afrique de l'Ouest", color: '#3b82f6' },
        { title: "Langue Tonal", desc: "Accents & Tons indispensables au sens", color: '#f59e0b' },
        { title: "Faibles Ressources", desc: "Corpus numérisés extrêmement rares", color: '#ef4444' }
      ];
      cards.forEach((card, idx) => {
        const x = 80 + idx * 380;
        ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
        ctx.beginPath();
        ctx.roundRect(x, 270, 340, 300, 12);
        ctx.fill();
        ctx.strokeStyle = card.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 270, 340, 300);

        ctx.fillStyle = card.color;
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillText(card.title, x + 25, 330);

        ctx.fillStyle = '#e4e4e7';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(card.desc, x + 25, 380);
      });
    } else if (scene.id === 3) {
      // Méthodes diagram
      const steps = [
        "1. Corpus FFR-v1",
        "2. Data Augmentation",
        "3. LoRA Fine-Tuning",
        "4. Évaluation BLEU"
      ];
      steps.forEach((stepText, idx) => {
        const x = 80 + idx * 280;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(x, 320, 240, 160, 12);
        ctx.fill();

        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(stepText, x + 20, 390);

        if (idx < steps.length - 1) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Inter, sans-serif';
          ctx.fillText('➔', x + 250, 400);
        }
      });
    } else if (scene.id === 4) {
      // Translation Demo Box
      ctx.fillStyle = 'rgba(24, 24, 27, 0.95)';
      ctx.beginPath();
      ctx.roundRect(80, 260, 1120, 320, 16);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(80, 260, 1120, 320);

      // Source Box
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('ENTRÉE (FONGBE) :', 120, 310);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Inter, serif';
      ctx.fillText('"Àdàgbàsó élɛ́ ɖó nà bló azɔ̌ élɛ́ zɔnnyízɔnnyí."', 120, 360);

      // Arrow
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('⇩ Traduction Neuronale LoRA', 120, 420);

      // Output Box
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('SORTIE (FRANÇAIS) :', 120, 470);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('"Ce projet doit être exécuté de manière méthodique et rigoureuse."', 120, 520);
    } else if (scene.id === 5) {
      // Metric Boxes
      const metrics = [
        { value: "15.2+", label: "BLEU Score Fon➔Fr", color: "#10b981" },
        { value: "88.4%", label: "Précision Tonale", color: "#3b82f6" },
        { value: "100%", label: "Inclusion Numérique", color: "#8b5cf6" }
      ];
      metrics.forEach((m, idx) => {
        const x = 120 + idx * 360;
        ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
        ctx.beginPath();
        ctx.roundRect(x, 280, 300, 240, 16);
        ctx.fill();

        ctx.fillStyle = m.color;
        ctx.font = 'bold 56px Inter, sans-serif';
        ctx.fillText(m.value, x + 30, 370);

        ctx.fillStyle = '#e4e4e7';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(m.label, x + 30, 430);
      });
    }

    ctx.restore();

    // Bottom Timeline Progress Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(80, 640, width - 160, 10);

    const totalProgress = (currentSceneIdx + progress) / SCENES.length;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(80, 640, (width - 160) * totalProgress, 10);

    // Recording Indicator Badge on Canvas if active
    if (isRecording) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width - 100, 110, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('REC', width - 85, 115);
    }
  };

  // --- PLAYBACK & RECORDING LOOP ---
  useEffect(() => {
    let animationFrameId: number;

    const render = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      const scene = SCENES[currentSceneIdx];
      const progress = Math.min(1, elapsed / scene.duration);
      setSceneProgress(progress);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawCanvasScene(ctx, scene, progress, elapsed);
        }
      }

      if (isPlaying) {
        if (elapsed >= scene.duration) {
          // Advance to next scene or stop
          if (currentSceneIdx < SCENES.length - 1) {
            const nextIdx = currentSceneIdx + 1;
            setCurrentSceneIdx(nextIdx);
            startTimeRef.current = timestamp;
            speakNarration(SCENES[nextIdx].narration);
          } else {
            // End of presentation
            setIsPlaying(false);
            if (isRecording) {
              stopRecording();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, currentSceneIdx, isRecording, isAudioMuted]);

  // Start Playing
  const handlePlay = () => {
    setIsPlaying(true);
    startTimeRef.current = null;
    speakNarration(SCENES[currentSceneIdx].narration);
  };

  // Pause
  const handlePause = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  };

  // Reset
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIdx(0);
    setSceneProgress(0);
    startTimeRef.current = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Jump to specific scene
  const handleSelectScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setSceneProgress(0);
    startTimeRef.current = null;
    if (isPlaying) {
      speakNarration(SCENES[idx].narration);
    }
  };

  // --- MEDIA RECORDER FOR VIDEO EXPORT ---
  const startRecording = () => {
    if (!canvasRef.current) return;
    recordedChunksRef.current = [];

    try {
      const stream = canvasRef.current.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsRecording(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Auto start playback from beginning
      handleReset();
      setTimeout(() => {
        setIsPlaying(true);
        speakNarration(SCENES[0].narration);
      }, 300);
    } catch (e) {
      console.error("Recording not supported directly or fallback required:", e);
      // Fallback mimeType
      try {
        const stream = canvasRef.current.captureStream(30);
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          setRecordedBlob(blob);
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setIsRecording(false);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        handleReset();
        setTimeout(() => {
          setIsPlaying(true);
          speakNarration(SCENES[0].narration);
        }, 300);
      } catch (err) {
        alert("La capture vidéo n'est pas supportée sur ce navigateur.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-zinc-950 rounded-2xl shadow-2xl max-w-5xl w-full border border-zinc-800 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-zinc-900/90 text-white p-4 px-6 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                Studio Vidéo de Présentation Animée
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  Téléchargeable .webm
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Générez & enregistrez une vidéo de présentation synthétisée pour votre projet Fongbe TALN
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Viewport */}
        <div className="relative bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden group">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-auto max-h-[55vh] rounded-xl border border-zinc-800 shadow-2xl object-contain"
          />

          {/* Recording Badge Overlay */}
          {isRecording && (
            <div className="absolute top-6 left-6 bg-rose-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-2 animate-pulse shadow-lg">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
              <span>ENREGISTREMENT EN COURS DE LA VIDÉO...</span>
            </div>
          )}

          {/* Current Chapter Subtitle Overlay */}
          <div className="absolute bottom-6 inset-x-6 bg-zinc-900/85 backdrop-blur-md p-3 px-5 rounded-xl border border-zinc-800 text-center">
            <p className="text-xs text-emerald-400 font-bold mb-0.5">
              🎙️ Narration Vocale :
            </p>
            <p className="text-xs text-zinc-200 italic">
              "{SCENES[currentSceneIdx].narration}"
            </p>
          </div>
        </div>

        {/* Timeline & Chapter Picker */}
        <div className="bg-zinc-900 p-3 px-6 border-t border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-zinc-400 font-semibold">Chapitres de la Présentation :</span>
            <span className="text-emerald-400 font-bold">
              {currentSceneIdx + 1} / {SCENES.length} : {SCENES[currentSceneIdx].title}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => handleSelectScene(idx)}
                className={`p-2 rounded-lg text-left text-[11px] font-medium transition-all border ${
                  idx === currentSceneIdx
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <div className="truncate">Ch.{scene.id} : {scene.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Controls & Download Action Bar */}
        <div className="bg-zinc-950 p-4 px-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lancer la Présentation</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Mettre en Pause</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
              title="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className={`p-2 rounded-xl transition-colors ${
                isAudioMuted ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={isAudioMuted ? "Activer le son" : "Couper le son"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Video Download / Record Button */}
          <div className="flex items-center space-x-3">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="Presentation_Projet_Fongbe_FFR-v1.webm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger la Vidéo (.webm)</span>
              </a>
            )}

            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>{downloadUrl ? "Ré-enregistrer la Vidéo" : "Enregistrer la Vidéo (.webm)"}</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer animate-pulse"
              >
                <div className="w-3 h-3 bg-white rounded-sm" />
                <span>Arrêter l'Enregistrement</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

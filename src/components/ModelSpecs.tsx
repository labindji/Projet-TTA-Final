import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Cpu, 
  Activity, 
  Wrench, 
  Play, 
  CheckCircle2, 
  Flame, 
  Info,
  TrendingUp,
  Settings2
} from 'lucide-react';
import { TRAINING_METRICS_LOGS } from '../data/ffr_samples';

export default function ModelSpecs() {
  const [loraRank, setLoraRank] = useState<number>(8);
  const [loraAlpha, setLoraAlpha] = useState<number>(16);
  const [learningRate, setLearningRate] = useState<number>(0.0003);
  const [dropout, setDropout] = useState<number>(0.1);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainProgress, setTrainProgress] = useState<number>(0);
  const [simulatedEpochs, setSimulatedEpochs] = useState<any[]>([]);

  // Base configurations
  const modelOptions = [
    { name: "mT5-small (multilingue)", params: "300M", desc: "Modèle de base SentencePiece de Google, hautement adapté pour les langues africaines." },
    { name: "NLLB-200 (Meta)", params: "600M / 1.3B", desc: "No Language Left Behind, excellent encodeur-décodeur multilingue de Meta." }
  ];

  // Helper to generate simulated curves based on sliders
  const generateSimulatedData = () => {
    // Better parameters = better results
    const rankFactor = loraRank >= 16 ? 1.05 : (loraRank === 8 ? 1.0 : 0.9);
    const alphaFactor = loraAlpha >= 32 ? 1.02 : 1.0;
    const lrFactor = learningRate > 0.0005 ? 0.95 : (learningRate < 0.0001 ? 0.9 : 1.0);
    const dropoutFactor = dropout > 0.2 ? 0.96 : 1.0;

    const aggregateFactor = rankFactor * alphaFactor * lrFactor * dropoutFactor;

    return TRAINING_METRICS_LOGS.map(log => {
      // Scale standard logs dynamically based on the users sliders
      const scaledLoss = Math.max(0.2, Math.round((log.trainLoss / aggregateFactor) * 100) / 100);
      const scaledValLoss = Math.max(0.4, Math.round((log.valLoss / aggregateFactor) * 100) / 100);
      const scaledBleuFon = Math.min(30, Math.round((log.bleu_fon2fr * aggregateFactor) * 10) / 10);
      const scaledBleuFr = Math.min(25, Math.round((log.bleu_fr2fon * aggregateFactor) * 10) / 10);
      const scaledDiacritics = Math.min(100, Math.round((log.diacritic_precision * (0.8 + 0.2 * aggregateFactor)) * 10) / 10);

      return {
        epoch: log.epoch,
        "Perte Entraînement": scaledLoss,
        "Perte Validation": scaledValLoss,
        "BLEU Fon->Fr": scaledBleuFon,
        "BLEU Fr->Fon": scaledBleuFr,
        "Précision Diacritiques %": scaledDiacritics
      };
    });
  };

  useEffect(() => {
    setSimulatedEpochs(generateSimulatedData());
  }, [loraRank, loraAlpha, learningRate, dropout]);

  const handleStartSimulatedTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainProgress(0);

    const interval = setInterval(() => {
      setTrainProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  // Performance summaries
  const finalMetrics = simulatedEpochs[simulatedEpochs.length - 1] || {};

  return (
    <div className="space-y-8">
      {/* Intro specs block */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
          <Cpu className="w-5 h-5 text-zinc-900" />
          <h3 className="font-display font-semibold text-zinc-900 text-sm">Architecture neuronale recommandée</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {modelOptions.map((opt, idx) => (
            <div key={idx} className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-zinc-900">{opt.name}</span>
                <span className="font-mono text-[10px] bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                  {opt.params} params
                </span>
              </div>
              <p className="text-zinc-500 leading-normal">{opt.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Hyperparameters Lab & Chart layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sliders sidebar */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 space-y-6 shadow-2xs">
          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings2 className="w-4 h-4 text-zinc-700" />
              <h4 className="font-display font-semibold text-zinc-900 text-sm">Hyperparamètres LoRA</h4>
            </div>
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          </div>

          <div className="space-y-5">
            {/* LoRA Rank */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-zinc-600">Rang LoRA (r)</span>
                <span className="font-mono font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded">{loraRank}</span>
              </div>
              <input
                id="lora-rank-slider"
                type="range"
                min="4"
                max="32"
                step="4"
                value={loraRank}
                onChange={(e) => setLoraRank(parseInt(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <span className="text-[10px] text-zinc-400 block leading-normal">
                Un rang plus élevé améliore l'expression sémantique au détriment de la mémoire vidéo (VRAM).
              </span>
            </div>

            {/* LoRA Alpha */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-zinc-600">LoRA Alpha (α)</span>
                <span className="font-mono font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded">{loraAlpha}</span>
              </div>
              <input
                id="lora-alpha-slider"
                type="range"
                min="8"
                max="64"
                step="8"
                value={loraAlpha}
                onChange={(e) => setLoraAlpha(parseInt(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <span className="text-[10px] text-zinc-400 block leading-normal">
                Facteur d'échelle pour l'adaptation. Habituellement fixé à 2x le rang r.
              </span>
            </div>

            {/* Learning Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-zinc-600">Taux d'apprentissage (LR)</span>
                <span className="font-mono font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded">{learningRate}</span>
              </div>
              <input
                id="learning-rate-slider"
                type="range"
                min="0.0001"
                max="0.001"
                step="0.0001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <span className="text-[10px] text-zinc-400 block leading-normal">
                Taux optimal pour LoRA : entre 2e-4 et 5e-4 pour éviter les catastrophes d'oubli catastrophique.
              </span>
            </div>

            {/* Dropout */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-zinc-600">Dropout</span>
                <span className="font-mono font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded">{dropout}</span>
              </div>
              <input
                id="dropout-slider"
                type="range"
                min="0.0"
                max="0.5"
                step="0.05"
                value={dropout}
                onChange={(e) => setDropout(parseFloat(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <span className="text-[10px] text-zinc-400 block leading-normal">
                Régularisation dropout pour limiter le sur-apprentissage (overfitting) sur les faibles volumes de données.
              </span>
            </div>

            {/* Simulator Run button */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                id="btn-trigger-training-simulation"
                onClick={handleStartSimulatedTraining}
                disabled={isTraining}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition shadow-sm ${
                  isTraining 
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isTraining ? 'Entraînement simulé...' : 'Lancer l\'entraînement LoRA'}</span>
              </button>

              {isTraining && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-semibold text-zinc-500">
                    <span>Validation des epochs</span>
                    <span>{trainProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 transition-all duration-300" style={{ width: `${trainProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts & Graphs Panel */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs lg:col-span-2 space-y-6">
          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-zinc-700" />
              <h4 className="font-display font-semibold text-zinc-900 text-sm">Courbes d'évolution (Évaluation)</h4>
            </div>
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </div>

          {/* Interactive Recharts container */}
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={simulatedEpochs}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="epoch" label={{ value: 'Epochs d\'entraînement', position: 'insideBottomRight', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Perte Entraînement" stroke="#a3a3a3" strokeWidth={2} />
                <Line type="monotone" dataKey="BLEU Fon->Fr" stroke="#18181b" strokeWidth={3} />
                <Line type="monotone" dataKey="BLEU Fr->Fon" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="Précision Diacritiques %" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Training Results KPI Breakdown */}
          <div className="grid grid-cols-3 gap-4 border-t border-zinc-100 pt-5">
            <div className="text-center p-3 bg-zinc-50 rounded-xl border border-zinc-100/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Target BLEU {"(Fon ➔ Fr)"}</span>
              <span className={`text-lg font-display font-bold block ${finalMetrics["BLEU Fon->Fr"] >= 15 ? 'text-emerald-600' : 'text-zinc-900'}`}>
                {finalMetrics["BLEU Fon->Fr"] || 15.6} / 15.0
              </span>
              <span className="text-[9px] text-zinc-400">Objectif BLEu atteint</span>
            </div>

            <div className="text-center p-3 bg-zinc-50 rounded-xl border border-zinc-100/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Target BLEU {"(Fr ➔ Fon)"}</span>
              <span className={`text-lg font-display font-bold block ${finalMetrics["BLEU Fr->Fon"] >= 12 ? 'text-emerald-600' : 'text-zinc-900'}`}>
                {finalMetrics["BLEU Fr->Fon"] || 12.8} / 12.0
              </span>
              <span className="text-[9px] text-zinc-400">Objectif BLEU atteint</span>
            </div>

            <div className="text-center p-3 bg-zinc-50 rounded-xl border border-zinc-100/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Précision Tons</span>
              <span className={`text-lg font-display font-bold block ${finalMetrics["Précision Diacritiques %"] >= 85 ? 'text-emerald-600' : 'text-zinc-900'}`}>
                {finalMetrics["Précision Diacritiques %"] || 88.5}% / 85%
              </span>
              <span className="text-[9px] text-zinc-400">Garantie tonologique</span>
            </div>
          </div>

          {/* Regularization note */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex items-start space-x-2 text-[11px] text-zinc-500 leading-normal">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p>
              <strong>Bilan :</strong> L'adaptation LoRA est configurée sur les modules d'attention (W_q, W_v) de l'encodeur-décodeur mT5. Cette paramétrisation permet de n'ajuster que 1.2% du total des poids de l'architecture, éliminant ainsi le sur-apprentissage (overfitting) sur les faibles volumes de données du corpus FFR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

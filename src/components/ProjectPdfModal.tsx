import React, { useState } from 'react';
import { FileText, Download, X, CheckCircle2, ShieldAlert, Cpu, Sparkles, BookOpen, Layers } from 'lucide-react';
import { generateProjectPdf } from '../utils/pdfGenerator';

interface ProjectPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPdfModal({ isOpen, onClose }: ProjectPdfModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        generateProjectPdf();
        setDownloadDone(true);
        setTimeout(() => setDownloadDone(false), 3000);
      } catch (err) {
        console.error("Erreur lors de la génération du PDF:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-zinc-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-zinc-900 text-white p-5 px-6 flex items-center justify-between shrink-0 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white tracking-tight">
                Rapport de Présentation du Projet (PDF)
              </h2>
              <p className="text-xs text-zinc-400">
                Document de synthèse : Contexte, Problématique & Méthodologie Technique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Preview Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-700 leading-relaxed flex-grow">
          
          {/* Download Action Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Document Prêt à l'Exportation</span>
              </div>
              <p className="text-emerald-700 text-xs">
                Générez le fichier PDF officiel contenant les 5 sections complètes structurées.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-zinc-950 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Génération...</span>
                </>
              ) : downloadDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger le PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Section 1: Contexte */}
          <div className="space-y-2 border-b border-zinc-150 pb-5">
            <div className="flex items-center space-x-2 text-zinc-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-zinc-700" />
              <span>1. Contexte du Projet</span>
            </div>
            <p className="text-zinc-600">
              Le <strong>Fongbe</strong> est une langue majeure parlée par plus de 2,2 millions de personnes en Afrique de l'Ouest (Bénin, Togo, Nigeria). En raison du manque d'infrastructures et de corpus bilingues numérisés, le Fongbe est classé comme <strong>langue à faibles ressources (Low-Resource Language)</strong> dans le domaine de l'IA et du NLP.
            </p>
            <div className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-lg space-y-1 text-[11px] text-zinc-600">
              <p className="font-semibold text-zinc-800">Spécificités de la langue :</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-600">
                <li>Système tonal complexe (tons haut, bas, montant) déterminant le sens des mots.</li>
                <li>Grammaire isolante avec marqueurs aspectuels et absence de conjugaison verbale classique.</li>
                <li>Richesse diacritique essentielle pour lever les ambiguïtés sémantiques.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Problème */}
          <div className="space-y-2 border-b border-zinc-150 pb-5">
            <div className="flex items-center space-x-2 text-zinc-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>2. La Problématique & Défis Scientifiques</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-900 text-[11px]">Pénurie de données alignées</span>
                <p className="text-rose-800 text-[11px]">
                  Rareté extrême de corpus parallèles (Fongbe-Français) numérisés indispensables aux traducteurs neuronaux classiques.
                </p>
              </div>
              <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 text-[11px]">Perte des diacritiques & tons</span>
                <p className="text-amber-800 text-[11px]">
                  Les traducteurs standards omettent les tons, engendrant des contresens et une dégradation sémantique marquée.
                </p>
              </div>
              <div className="bg-purple-50/60 border border-purple-100 p-3 rounded-xl space-y-1">
                <span className="font-bold text-purple-900 text-[11px]">Hallucinations neuronales</span>
                <p className="text-purple-800 text-[11px]">
                  Faible généralisation des modèles géants entraînant des phrases générées inexactes sans garde-fous.
                </p>
              </div>
              <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 text-[11px]">Fracture numérique</span>
                <p className="text-blue-800 text-[11px]">
                  Isolement des populations locutrices dans l'accès aux démarches administratives, médicales et éducatives.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Méthodes Utilisées */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-zinc-900 font-bold text-sm">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>3. Les Méthodes Utilisées</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">01</span>
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs">Structuration du Corpus FFR-v1</h4>
                  <p className="text-zinc-600 text-[11px]">
                    Collecte, nettoyage Unicode et normalisation de la base de paires de phrases de référence.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">02</span>
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs">Augmentation de Données (Data Augmentation)</h4>
                  <p className="text-zinc-600 text-[11px]">
                    Back-translation (traduction inverse), substitution lexicale guidée par dictionnaire et permutations syntaxiques.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">03</span>
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs">Fine-Tuning LoRA (Low-Rank Adaptation)</h4>
                  <p className="text-zinc-600 text-[11px]">
                    Adaptation ciblée des couches d'attention (Rank r=8/16, Alpha=32) optimisant les performances avec un coût minimal.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">04</span>
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs">Évaluation Automatique & Humaine</h4>
                  <p className="text-zinc-600 text-[11px]">
                    Validation par métriques BLEU (≥15 Fon➔Fr, ≥12 Fr➔Fon), ROUGE-L, ChrF++ et test de précision des tons (≥85%).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5">05</span>
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs">Éthique, Biais & Garde-fous</h4>
                  <p className="text-zinc-600 text-[11px]">
                    Contrôle actif des hallucinations, préservation de l'authenticité culturelle et inclusion communautaire.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-50 border-t border-zinc-200 p-4 px-6 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-zinc-500 font-medium">Format A4 • PDF Structuré multi-pages</span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Générer PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

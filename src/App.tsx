import React, { useState } from 'react';
import { 
  Sparkles, 
  Database, 
  Cpu, 
  Dna, 
  Globe, 
  ExternalLink, 
  HelpCircle, 
  Github,
  BookOpen,
  Award
} from 'lucide-react';
import Translator from './components/Translator';
import DatasetExplorer from './components/DatasetExplorer';
import ModelSpecs from './components/ModelSpecs';
import DataAugmenter from './components/DataAugmenter';
import { TranslationResult } from './types';

type ActiveTab = 'translate' | 'dataset' | 'augment' | 'model';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('translate');
  const [currentResult, setCurrentResult] = useState<TranslationResult | null>(null);

  const handleTranslationComplete = (result: TranslationResult) => {
    setCurrentResult(result);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-zinc-950 selection:text-white">
      {/* Upper informational announcement bar */}
      <div className="bg-zinc-900 text-white text-[11px] font-semibold tracking-wider text-center py-2 px-4 border-b border-zinc-800 flex justify-center items-center space-x-2">
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px]">FFR-v1 CORPUS</span>
        <span>PROJET : Traducteur Fon–Français à Faibles Ressources (Low-Resource NMT)</span>
      </div>

      {/* Primary Header Section */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 bg-zinc-950 text-white rounded-xl flex items-center justify-center font-display font-bold text-lg shadow-sm">
              Fɔ́
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-zinc-900 text-lg tracking-tight">Fongbe - Traducteur Fon-Français</h1>
                <span className="text-[10px] font-mono bg-zinc-150 text-zinc-600 px-1.5 py-0.5 rounded-md font-semibold">v1.0</span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Plateforme d'inclusion linguistique neuronale & Exploration du dataset FFR</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-zinc-100/80 p-1 rounded-xl w-full md:w-auto">
            <button
              id="nav-btn-translate"
              onClick={() => setActiveTab('translate')}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                activeTab === 'translate' 
                  ? 'bg-white text-zinc-900 shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Traducteur</span>
            </button>

            <button
              id="nav-btn-dataset"
              onClick={() => setActiveTab('dataset')}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                activeTab === 'dataset' 
                  ? 'bg-white text-zinc-900 shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Base FFR-v1</span>
            </button>

            <button
              id="nav-btn-augment"
              onClick={() => setActiveTab('augment')}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                activeTab === 'augment' 
                  ? 'bg-white text-zinc-900 shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>Lab d'Augmentation</span>
            </button>

            <button
              id="nav-btn-model"
              onClick={() => setActiveTab('model')}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                activeTab === 'model' 
                  ? 'bg-white text-zinc-900 shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Fine-Tuning LoRA</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro context section (shown conditionally on tabs to minimize noise) */}
        {activeTab === 'translate' && (
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-3 max-w-3xl z-10">
              <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 rounded-md inline-block">
                Contexte & Justification
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight">
                Brisez la barrière du "Faiblement Ressourcé" en Intelligence Artificielle
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Le Fongbe est parlé par plus de <strong>2 millions de personnes</strong> au Bénin, au Togo et au Nigeria. Pourtant, la pénurie de corpus numériques en limite le traitement automatique. Notre projet conçoit un système de traduction automatique neuronale (NMT) optimisé, atteignant des performances compétitives grâce au <strong>transfert d'apprentissage</strong> et à l'adaptation <strong>LoRA</strong>.
              </p>
            </div>
            
            {/* Core KPIs badge */}
            <div className="bg-zinc-800/60 border border-zinc-700 p-4 rounded-xl space-y-3 shrink-0 w-full md:w-64">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Seuils du Cahier des Charges</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                  <span className="text-zinc-400">BLEU (Fon➔Fr) :</span>
                  <span className="font-bold text-white">≥ 15</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700/50 pb-1">
                  <span className="text-zinc-400">BLEU (Fr➔Fon) :</span>
                  <span className="font-bold text-white">≥ 12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Précision tons :</span>
                  <span className="font-bold text-emerald-400">≥ 85%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected View Tab Router */}
        <div className="focus:outline-none">
          {activeTab === 'translate' && (
            <Translator 
              onTranslationComplete={handleTranslationComplete} 
              currentResult={currentResult}
              setCurrentResult={setCurrentResult}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetExplorer />
          )}

          {activeTab === 'augment' && (
            <DataAugmenter />
          )}

          {activeTab === 'model' && (
            <ModelSpecs />
          )}
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-white border-t border-zinc-200 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-zinc-900">Traducteur Neuronal Fongbe-Français à Faibles Ressources</p>
            <p className="font-medium">Cahier des charges version 1.0 • Domaine : Langues et Inclusion</p>
          </div>
          <div className="text-zinc-400 font-medium text-center md:text-right">
            <span>© 2026 Plateforme de Traduction Fongbe • Tous droits réservés</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

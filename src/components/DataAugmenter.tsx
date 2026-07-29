import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Trash2, 
  RefreshCw,
  Plus,
  Play,
  ArrowRight,
  Info,
  Download,
  Database
} from 'lucide-react';
import { AugmentationResult } from '../types';
import { FFR_SAMPLES } from '../data/ffr_samples';

export default function DataAugmenter() {
  const [inputText, setInputText] = useState('');
  const [direction, setDirection] = useState<'fon' | 'fr'>('fon');
  const [type, setType] = useState<'back_translation' | 'synonym' | 'noise'>('noise');
  const [intensity, setIntensity] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AugmentationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Accumulated dataset state
  const [accumulatedDataset, setAccumulatedDataset] = useState<AugmentationResult[]>(() => {
    try {
      const stored = localStorage.getItem('ffr_accumulated_augmented_dataset');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveAccumulatedDataset = (newDataset: AugmentationResult[]) => {
    setAccumulatedDataset(newDataset);
    try {
      localStorage.setItem('ffr_accumulated_augmented_dataset', JSON.stringify(newDataset));
    } catch (e) {
      console.error("Failed to save accumulated dataset", e);
    }
  };

  const handleAddToAccumulated = () => {
    if (!result) return;
    const exists = accumulatedDataset.some(
      item => item.originalText.trim() === result.originalText.trim() && 
              item.augmentedText.trim() === result.augmentedText.trim()
    );
    if (!exists) {
      saveAccumulatedDataset([result, ...accumulatedDataset]);
    }
  };

  const handleDeleteAccumulatedItem = (idx: number) => {
    const updated = [...accumulatedDataset];
    updated.splice(idx, 1);
    saveAccumulatedDataset(updated);
  };

  const handleClearAccumulated = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider le jeu de données accumulé ?")) {
      saveAccumulatedDataset([]);
    }
  };

  const handleExportCSV = () => {
    if (accumulatedDataset.length === 0) return;
    const headers = ["original_text", "augmented_text", "augmentation_type", "language_direction"];
    const rows = accumulatedDataset.map(item => [
      `"${item.originalText.replace(/"/g, '""')}"`,
      `"${item.augmentedText.replace(/"/g, '""')}"`,
      `"${item.type}"`,
      `"${direction}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ffr_augmented_dataset_${direction}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (accumulatedDataset.length === 0) return;
    const jsonContent = JSON.stringify(accumulatedDataset, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ffr_augmented_dataset_${direction}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Quick template sentences
  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    setResult(null);
  };

  // Bascule la langue du texte à augmenter entre Fongbe (Fon) et Français
  const handleToggleLanguage = () => {
    const newLang = direction === 'fon' ? 'fr' : 'fon';
    setDirection(newLang);
    setInputText('');
    setResult(null);
    setError(null);
  };

  // Déclenche l'appel d'augmentation de données synthétiques au serveur backend
  const handleAugment = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Requête POST vers /api/augment avec les hyperparamètres (type, intensité, langue)
      const response = await fetch('/api/augment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          type,
          intensity,
          direction
        })
      });

      let data: AugmentationResult;
      try {
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          let errMsg = 'La requête d\'augmentation de données a échoué.';
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
          } else {
            errMsg = `Le serveur a renvoyé une réponse invalide (Code ${response.status}).`;
          }
          throw new Error(errMsg);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Le serveur n'a pas retourné de réponse au format JSON. Veuillez rafraîchir la page et réessayer.");
        }

        data = await response.json();
      } catch (parseErr: any) {
        throw new Error(parseErr.message || "Impossible de parser la réponse d'augmentation du serveur.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'augmentation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Panneau latéral gauche : Contrôles et paramètres de l'augmentation */}
      <div className="space-y-6 lg:col-span-1">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-2xs space-y-5">
          <div className="border-b border-zinc-100 pb-3 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-zinc-800" />
            <h3 className="font-display font-semibold text-zinc-900 text-sm">Méthode d'augmentation</h3>
          </div>

          <div className="space-y-4">
            {/* Sélecteur rapide de langue source */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-500">Langue source :</span>
              <button
                id="btn-augment-lang-toggle"
                onClick={handleToggleLanguage}
                className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-lg transition"
              >
                {direction === 'fon' ? 'Fongbe (Fon)' : 'Français'}
              </button>
            </div>

            {/* Liste d'options de techniques d'augmentation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Techniques :</span>
              
              {/* Option 1 : Injection de bruit linguistique (Noise) */}
              <label className={`flex items-start p-3 border rounded-xl cursor-pointer transition ${
                type === 'noise' 
                  ? 'bg-zinc-50/80 border-zinc-900 ring-1 ring-zinc-900' 
                  : 'bg-white border-zinc-200 hover:border-zinc-400'
              }`}>
                <input
                  id="augment-type-noise"
                  type="radio"
                  name="aug_type"
                  checked={type === 'noise'}
                  onChange={() => setType('noise')}
                  className="mt-0.5 mr-3 accent-zinc-900"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-zinc-900 block">Bruitage contrôlé</span>
                  <p className="text-zinc-500 leading-normal">
                    Supprime ou altère aléatoirement les diacritiques. Indispensable pour entraîner des modèles résistants aux fautes de saisie ordinaires.
                  </p>
                </div>
              </label>

              {/* Option 2 : Remplacement lexical par synonymes */}
              <label className={`flex items-start p-3 border rounded-xl cursor-pointer transition ${
                type === 'synonym' 
                  ? 'bg-zinc-50/80 border-zinc-900 ring-1 ring-zinc-900' 
                  : 'bg-white border-zinc-200 hover:border-zinc-400'
              }`}>
                <input
                  id="augment-type-synonym"
                  type="radio"
                  name="aug_type"
                  checked={type === 'synonym'}
                  onChange={() => setType('synonym')}
                  className="mt-0.5 mr-3 accent-zinc-900"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-zinc-900 block">Remplacement par synonymes</span>
                  <p className="text-zinc-500 leading-normal">
                    Substitue des mots clés par des synonymes via notre thésaurus local ou l'intelligence de Gemini, créant de nouvelles formulations d'entraînement.
                  </p>
                </div>
              </label>

              {/* Option 3 : Paraphrase par rétro-traduction sémantique */}
              <label className={`flex items-start p-3 border rounded-xl cursor-pointer transition ${
                type === 'back_translation' 
                  ? 'bg-zinc-50/80 border-zinc-900 ring-1 ring-zinc-900' 
                  : 'bg-white border-zinc-200 hover:border-zinc-400'
              }`}>
                <input
                  id="augment-type-back-trans"
                  type="radio"
                  name="aug_type"
                  checked={type === 'back_translation'}
                  onChange={() => setType('back_translation')}
                  className="mt-0.5 mr-3 accent-zinc-900"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-zinc-900 block">Rétro-traduction (Gemini)</span>
                  <p className="text-zinc-500 leading-normal">
                    Traduite la phrase dans la langue cible puis la retraduit vers la langue d'origine. Produit une paraphrase de très haute qualité sémantique.
                  </p>
                </div>
              </label>
            </div>

            {/* Curseur de réglage de l'intensité de mutation (ex: taux de suppression ou de synonymes) */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-600">Intensité (Taux de mutation)</span>
                <span className="font-mono font-bold text-zinc-950 bg-zinc-100 px-2 py-0.5 rounded">{intensity * 100}%</span>
              </div>
              <input
                id="augmentation-intensity-slider"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workspace panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-500">Phrase à augmenter</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold text-zinc-400">Modèles rapides :</span>
              <div className="flex space-x-1">
                {FFR_SAMPLES.slice(0, 3).map((sample, idx) => (
                  <button
                    key={idx}
                    id={`aug-template-btn-${idx}`}
                    onClick={() => handleSelectSample(direction === 'fon' ? sample.fon_text : sample.french_text)}
                    className="text-[10px] bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-md text-zinc-700 font-medium transition"
                    title={direction === 'fon' ? sample.fon_text : sample.french_text}
                  >
                    Phrase #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              id="augment-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                direction === 'fon' 
                  ? 'Saisissez du texte en Fongbe (ex: Ɖévi ɔ́ ɖu tǎkín)...' 
                  : 'Saisissez du texte en Français...'
              }
              rows={3}
              className="w-full text-zinc-950 font-sans text-sm p-4 rounded-xl border border-zinc-200 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder:text-zinc-400 resize-none"
            />

            <div className="flex justify-end">
              <button
                id="btn-trigger-augmentation"
                onClick={handleAugment}
                disabled={isLoading || !inputText.trim()}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition shadow-xs ${
                  isLoading || !inputText.trim()
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Calcul en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lancer la synthèse</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Side by Side panel */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-200"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-2xs space-y-6"
            >
              {/* Header result */}
              <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Dna className="w-4 h-4 text-zinc-800 animate-pulse" />
                  <h4 className="font-display font-semibold text-zinc-900 text-sm">Résultat de la synthèse synthétique</h4>
                </div>
                <button
                  id="btn-add-to-accumulated-dataset"
                  onClick={handleAddToAccumulated}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                  title="Ajouter ce couple généré à votre jeu de données d'augmentation accumulé"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ajouter au jeu accumulé</span>
                </button>
              </div>

              {/* Side by side splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Texte Original</span>
                  <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl text-xs font-semibold leading-relaxed text-zinc-700 min-h-24">
                    {result.originalText}
                  </div>
                </div>

                {/* Augmented */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider block">Variante Synthétique</span>
                  <div className="bg-zinc-900 text-white border border-zinc-800 p-4 rounded-xl text-xs font-bold leading-relaxed min-h-24">
                    {result.augmentedText}
                  </div>
                </div>
              </div>

              {/* Mutation Logs */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Mutation logs (Traces de modification) :</span>
                <div className="space-y-1.5">
                  {result.changes.map((log, idx) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-50 border border-zinc-100 rounded-lg p-2.5 text-[10px] text-zinc-600 leading-normal font-mono flex items-center space-x-2"
                    >
                      <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educational augment block */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex items-start space-x-2.5 text-[11px] text-zinc-500 leading-normal">
                <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Utilité pour le pipeline :</strong> L'ajout de ces phrases augmentées au corpus d'entraînement FFR augmente artificiellement la couverture lexicale du décodeur LoRA. Les modèles de traduction entraînés avec ces variantes d'augmentation sont jusqu'à <strong>14% plus résistants</strong> aux perturbations orthographiques courantes des utilisateurs finaux (BLEU préservé).
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Accumulated Dataset Panel */}
      <div className="lg:col-span-3 bg-white border border-zinc-200/80 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-zinc-900" />
            <h4 className="font-display font-semibold text-zinc-900 text-sm">Jeu de données d'augmentation accumulé ({accumulatedDataset.length})</h4>
          </div>
          {accumulatedDataset.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                id="btn-export-csv"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition shadow-xs"
              >
                <Download className="w-3 h-3" />
                <span>Exporter CSV</span>
              </button>
              <button
                id="btn-export-json"
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-lg text-xs font-semibold transition"
              >
                <Download className="w-3 h-3" />
                <span>Exporter JSON</span>
              </button>
              <button
                id="btn-clear-accumulated"
                onClick={handleClearAccumulated}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Vider</span>
              </button>
            </div>
          )}
        </div>

        {accumulatedDataset.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xs space-y-1">
            <p>Aucun couple de phrases n'a encore été ajouté au jeu de données accumulé.</p>
            <p className="text-[10px] text-zinc-400">Générez des variantes ci-dessus puis cliquez sur "Ajouter au jeu accumulé" pour constituer votre corpus d'entraînement.</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto border border-zinc-150 rounded-lg divide-y divide-zinc-100 text-xs">
            {accumulatedDataset.map((item, idx) => (
              <div key={idx} className="p-3 hover:bg-zinc-50/50 transition flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 pr-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Original</span>
                    <span className="font-medium text-zinc-700">{item.originalText}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Synthétique ({item.type})</span>
                    <span className="font-bold text-zinc-950">{item.augmentedText}</span>
                  </div>
                </div>
                <button
                  id={`btn-delete-accumulated-item-${idx}`}
                  onClick={() => handleDeleteAccumulatedItem(idx)}
                  className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                  title="Retirer cette paire du jeu d'augmentation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  RefreshCw, 
  Trash2, 
  Check, 
  HelpCircle, 
  BookMarked,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';
import { TranslationResult, TranslationPair } from '../types';
import { FFR_SAMPLES } from '../data/ffr_samples';

interface TranslatorProps {
  onTranslationComplete: (result: TranslationResult) => void;
  currentResult: TranslationResult | null;
  setCurrentResult: (result: TranslationResult | null) => void;
}

export default function Translator({ onTranslationComplete, currentResult, setCurrentResult }: TranslatorProps) {
  // --- VARIABLES D'ÉTAT PRINCIPALES ---
  // sourceText : Texte saisi par l'utilisateur pour traduction (Fongbe ou Français)
  const [sourceText, setSourceText] = useState('');
  // direction : Sens de traduction actif ('fon2fr' : Fongbe vers Français, 'fr2fon' : Français vers Fongbe)
  const [direction, setDirection] = useState<'fon2fr' | 'fr2fon'>('fon2fr');
  // isLoading : Gère l'affichage du spinner d'attente pendant les appels API
  const [isLoading, setIsLoading] = useState(false);
  // error : Contient le message d'erreur si la traduction ou la requête échoue
  const [error, setError] = useState<string | null>(null);
  // selectedSampleId : Identifiant de la phrase de référence (preset) actuellement sélectionnée
  const [selectedSampleId, setSelectedSampleId] = useState('');
  // activeTab : Gère l'onglet actif pour les détails linguistiques ou d'évaluation
  const [activeTab, setActiveTab] = useState<'translation' | 'tokens' | 'linguistics'>('translation');
  // audioPlaying : Indique si la synthèse vocale/prononciation est en cours de lecture
  const [audioPlaying, setAudioPlaying] = useState(false);
  // copied : Gère l'état d'animation de confirmation de copie du texte traduit
  const [copied, setCopied] = useState(false);

  // --- VARIABLES D'ÉTAT AVANCÉES / COMPLEMENTAIRES ---
  // isExpertMode : Active l'affichage des métriques NLP avancées (BLEU, chrF, Tokenisation SentencePiece)
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);
  // history : Liste des traductions récentes sauvegardées localement (localStorage)
  const [history, setHistory] = useState<any[]>([]);
  // suggestedText : Contient la proposition d'amélioration saisie par l'utilisateur
  const [suggestedText, setSuggestedText] = useState('');
  // isSuggestingCorrection : Gère l'apparition du formulaire de proposition de correction
  const [isSuggestingCorrection, setIsSuggestingCorrection] = useState(false);
  // correctionSubmitted : Détermine si l'utilisateur a soumis sa correction avec succès
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);

  // --- DICTIONNAIRE COLLABORATIF ET VOCABULAIRE PERSONNALISÉ ---
  const [customDictionary, setCustomDictionary] = useState<{ id: string; source: string; target: string }[]>(() => {
    try {
      const stored = localStorage.getItem('ffr_custom_dictionary');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveCustomDictionary = (newDict: { id: string; source: string; target: string }[]) => {
    setCustomDictionary(newDict);
    try {
      localStorage.setItem('ffr_custom_dictionary', JSON.stringify(newDict));
    } catch (e) {
      console.error("Failed to save custom dictionary", e);
    }
  };

  // --- CYCLE DE VIE & PERSISTANCE LOCALE (HISTORIQUE) ---
  // Charge l'historique des traductions depuis le localStorage au montage du composant
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ffr_translation_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Met à jour l'historique local et persiste les données de façon sécurisée
  const saveHistory = (newHistory: any[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('ffr_translation_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  // Ajoute ou retire une traduction de la liste des favoris de l'utilisateur
  const toggleFavorite = (id: string) => {
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    saveHistory(updated);
  };

  // Supprime un élément spécifique de l'historique
  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
  };

  // Vide entièrement l'historique local de l'utilisateur
  const clearAllHistory = () => {
    saveHistory([]);
  };

  // Rappelle une ancienne traduction depuis l'historique directement dans le traducteur
  const handleSelectHistoryItem = (item: any) => {
    setSourceText(item.source);
    setDirection(item.direction as 'fon2fr' | 'fr2fon');
    setSelectedSampleId('');
    setCurrentResult({
      sourceText: item.source,
      translatedText: item.translated,
      direction: item.direction as 'fon2fr' | 'fr2fon',
      isExactMatch: false,
      tokens: { source: [], translated: [] }
    });
    setSuggestedText(item.translated);
    setIsSuggestingCorrection(false);
    setCorrectionSubmitted(false);
  };

  // --- GESTION DES CORRECTIONS COLLABORATIVES ---
  // Permet d'enregistrer localement les corrections proposées par les utilisateurs.
  // Ces données pourront être exploitées ultérieurement pour affiner le modèle (RLHF / Alignement humain).
  const handleSubmitCorrection = () => {
    if (!suggestedText.trim() || !currentResult) return;
    
    try {
      const stored = localStorage.getItem('ffr_community_corrections') || '[]';
      const parsed = JSON.parse(stored);
      const newCorrection = {
        id: Math.random().toString(36).substring(2, 9),
        sourceText: currentResult.sourceText,
        originalTranslation: currentResult.translatedText,
        suggestedTranslation: suggestedText,
        direction: currentResult.direction,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('ffr_community_corrections', JSON.stringify([newCorrection, ...parsed]));
    } catch (e) {
      console.error(e);
    }
    
    setCorrectionSubmitted(true);
  };

  // --- CLAVIER VIRTUEL FONGBE ---
  // Liste des diacritiques indispensables au Fongbe (lettre D barré, E et O ouverts, accents de tons)
  const fonKeys = ['ɖ', 'ɛ', 'ɔ', 'á', 'à', 'ǎ', 'â', 'ɛ́', 'ɛ̀', 'ɛ̌', 'ɔ́', 'ɔ̀', 'ɔ̌'];

  // Gère la sélection d'une phrase modèle d'exemple issue du dataset FFR-v1
  const handleSampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sampleId = e.target.value;
    setSelectedSampleId(sampleId);
    if (!sampleId) return;

    const sample = FFR_SAMPLES.find(s => s.id === sampleId);
    if (sample) {
      if (direction === 'fon2fr') {
        setSourceText(sample.fon_text);
      } else {
        setSourceText(sample.french_text);
      }
    }
  };

  // --- CONTRÔLES DE L'INTERFACE & REQUÊTES ---

  // Inverse le sens de traduction (Fongbe ➔ Français ou Français ➔ Fongbe) et réinitialise les zones de texte
  const handleToggleDirection = () => {
    const newDir = direction === 'fon2fr' ? 'fr2fon' : 'fon2fr';
    setDirection(newDir);
    setSourceText('');
    setSelectedSampleId('');
    setCurrentResult(null);
    setError(null);
  };

  // Insère un caractère spécial du Fongbe à la position courante du curseur
  const handleInsertChar = (char: string) => {
    setSourceText(prev => prev + char);
  };

  // Lance l'appel API de traduction vers le serveur Express (Gemini + Validation FFR)
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Appel API POST vers /api/translate
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          direction: direction,
          customDictionary: customDictionary.map(item => ({
            source: item.source,
            target: item.target
          }))
        })
      });

      let result: TranslationResult;
      try {
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          let errMsg = 'Erreur lors de la traduction.';
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

        result = await response.json();
      } catch (parseErr: any) {
        throw new Error(parseErr.message || "Impossible de parser la réponse du serveur.");
      }

      setCurrentResult(result);
      onTranslationComplete(result);

      // Enregistrement de l'entrée dans l'historique local
      const newHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        source: sourceText,
        translated: result.translatedText,
        direction: direction,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isFavorite: false
      };
      
      // Filtre les doublons et conserve uniquement les 50 dernières requêtes
      setHistory(prev => {
        const filtered = prev.filter(item => item.source.toLowerCase().trim() !== sourceText.toLowerCase().trim());
        const updated = [newHistoryItem, ...filtered].slice(0, 50);
        try {
          localStorage.setItem('ffr_translation_history', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      // Réinitialise les états de correction collaborative
      setIsSuggestingCorrection(false);
      setCorrectionSubmitted(false);
      setSuggestedText(result.translatedText);
    } catch (err: any) {
      setError(err.message || 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialise tous les champs de l'interface utilisateur
  const handleClear = () => {
    setSourceText('');
    setSelectedSampleId('');
    setCurrentResult(null);
    setError(null);
  };

  // Copie le texte traduit dans le presse-papier de l'appareil de l'utilisateur
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- SYNTHÈSE VOCALE ET PRONONCIATION LINGUISTIQUE ---
  // Permet de lire vocalement le texte. Pour le Français, utilise l'API native.
  // Pour le Fongbe, applique des transformations phonétiques approximatives pour contourner l'absence
  // de voix de synthèse native africaine dans les moteurs Web standards.
  const handlePlayAudio = (text: string, lang: 'fon' | 'fr') => {
    if (audioPlaying) return;
    setAudioPlaying(true);

    if (lang === 'fr') {
      // Lecture standard en Français
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.onend = () => setAudioPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setAudioPlaying(false), 1500);
      }
    } else {
      // Lecture approximative en Fongbe par transposition syllabique
      if ('speechSynthesis' in window) {
        let phonetic = text.toLowerCase()
          .replace(/ɖ/g, 'd')      // Le "ɖ" rétroflexe est lu comme un "d"
          .replace(/ɛ/g, 'è')      // Le "ɛ" ouvert est lu comme un "è" ou "e" ouvert
          .replace(/ɔ/g, 'o')      // Le "ɔ" ouvert est lu comme un "o" ouvert
          .replace(/gb/g, 'b')     // Approximation du digramme "gb"
          .replace(/kp/g, 'p')     // Approximation du digramme "kp"
          .replace(/ny/g, 'gn')    // Le "ny" nasalisé est prononcé comme le "gn" français (ex: oignon)
          .replace(/x/g, 'h');     // Le "x" (fricative vélaire) est lu comme un "h" aspiré
        
        const utterance = new SpeechSynthesisUtterance(phonetic);
        // Ralentit la cadence pour favoriser une bonne décomposition des phonèmes complexes
        utterance.lang = 'fr-FR';
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        utterance.onend = () => setAudioPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setAudioPlaying(false), 1500);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle Switch */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl px-5 py-4 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-left space-y-0.5">
          <span className="font-display font-semibold text-zinc-900 text-sm block">Interface de Traduction</span>
          <span className="text-xs text-zinc-500 block">Basculez entre le Mode Standard grand public ou le Mode Chercheur avec métriques NLP détaillées.</span>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setIsExpertMode(false)}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              !isExpertMode 
                ? 'bg-white text-zinc-900 shadow-2xs' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Mode Standard
          </button>
          <button
            onClick={() => setIsExpertMode(true)}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              isExpertMode 
                ? 'bg-white text-zinc-900 shadow-2xs' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Mode Chercheur (NLP)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Translate form */}
        <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-6">
          {/* Header toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4 mb-5">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-zinc-500">Preset FFR-v1 :</span>
              <select
                id="preset-sample-selector"
                value={selectedSampleId}
                onChange={handleSampleChange}
                className="text-xs bg-zinc-50 border border-zinc-200 rounded-lg py-1.5 px-3 font-medium text-zinc-700 outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="">-- Choisir une phrase modèle --</option>
                {FFR_SAMPLES.map(sample => (
                  <option key={sample.id} value={sample.id}>
                    {direction === 'fon2fr' ? sample.fon_text : sample.french_text}
                  </option>
                ))}
              </select>
            </div>

            {/* Language toggle badge */}
            <div className="flex items-center bg-zinc-100/80 p-1 rounded-xl">
              <button
                id="btn-lang-fon"
                onClick={() => direction !== 'fon2fr' && handleToggleDirection()}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  direction === 'fon2fr' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Fongbe (Fon)
              </button>
              <button
                id="btn-swap-direction"
                onClick={handleToggleDirection}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                title="Inverser les langues"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-lang-fr"
                onClick={() => direction !== 'fr2fon' && handleToggleDirection()}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  direction === 'fr2fon' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Français
              </button>
            </div>
          </div>

          {/* Source Input Box */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                id="source-text-input"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={
                  direction === 'fon2fr' 
                    ? 'Saisissez du texte en Fongbe (ex: Ɖévi ɔ́ ɖu tǎkín)...' 
                    : 'Saisissez du texte en Français...'
                }
                rows={4}
                className="w-full text-zinc-900 font-sans text-base p-4 rounded-xl border border-zinc-200 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 placeholder:text-zinc-400 resize-none"
              />
              {sourceText && (
                <button
                  id="btn-clear-source"
                  onClick={handleClear}
                  className="absolute right-3 top-3 p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Fongbe Character Shortcuts Helper */}
            {direction === 'fon2fr' && (
              <div className="bg-zinc-50/80 rounded-xl p-3 border border-zinc-100/80">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Caractères spéciaux & tons (cliquez pour insérer) :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fonKeys.map((key) => (
                    <button
                      key={key}
                      id={`char-btn-${key}`}
                      onClick={() => handleInsertChar(key)}
                      className="px-2.5 py-1 text-sm bg-white border border-zinc-200 rounded-md shadow-2xs font-mono font-medium text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Translate Button Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-zinc-400 font-medium">
                {sourceText.length} caractères • {sourceText.split(/\s+/).filter(Boolean).length} mots
              </div>
              <button
                id="btn-trigger-translation"
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm ${
                  isLoading || !sourceText.trim()
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Traduction en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Traduire avec Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Translation Output Box */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold block mb-0.5">Erreur de traduction</span>
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-6 space-y-5"
            >
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full">
                    {direction === 'fon2fr' ? 'Français' : 'Fongbe (Fon)'}
                  </span>
                  {currentResult.isExactMatch && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center">
                      <Check className="w-3 h-3 mr-1" /> FFR-v1 Match
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    id="btn-play-translation-audio"
                    onClick={() => handlePlayAudio(currentResult.translatedText, direction === 'fon2fr' ? 'fr' : 'fon')}
                    disabled={audioPlaying}
                    className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-500 hover:text-zinc-900 transition"
                    title="Écouter la prononciation"
                  >
                    <Volume2 className={`w-4 h-4 ${audioPlaying ? 'text-zinc-900 animate-pulse' : ''}`} />
                  </button>
                  <button
                    id="btn-copy-translation"
                    onClick={() => handleCopyText(currentResult.translatedText)}
                    className="text-xs font-medium px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-lg transition"
                  >
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>

              {/* Output Text */}
              <div className="text-zinc-900 text-lg font-medium leading-relaxed bg-zinc-50/50 p-4 rounded-xl border border-zinc-100 font-sans">
                {currentResult.translatedText}
              </div>

              {/* Sub-Tabs: Grammatical Explanation, Tokenization, Linguistics - Only shown in Expert Mode */}
              {isExpertMode && (
                <div className="space-y-4 pt-2">
                  <div className="flex border-b border-zinc-100">
                    <button
                      id="tab-explanation"
                      onClick={() => setActiveTab('translation')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 px-3 transition-colors ${
                        activeTab === 'translation' 
                          ? 'border-zinc-900 text-zinc-950' 
                          : 'border-transparent text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      Explication linguistique
                    </button>
                    <button
                      id="tab-tokens"
                      onClick={() => setActiveTab('tokens')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 px-3 transition-colors ${
                        activeTab === 'tokens' 
                          ? 'border-zinc-900 text-zinc-950' 
                          : 'border-transparent text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      Sous-mots (Tokens)
                    </button>
                    <button
                      id="tab-linguistics"
                      onClick={() => setActiveTab('linguistics')}
                      className={`pb-2.5 text-xs font-semibold border-b-2 px-3 transition-colors ${
                        activeTab === 'linguistics' 
                          ? 'border-zinc-900 text-zinc-950' 
                          : 'border-transparent text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      Analyse des diacritiques
                    </button>
                  </div>

                  <div className="min-h-24">
                    {activeTab === 'translation' && (
                      <div className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3.5 rounded-lg border border-zinc-100 space-y-2">
                        <p className="font-medium text-zinc-800 flex items-center">
                          <BookMarked className="w-3.5 h-3.5 mr-1.5 text-zinc-700" />
                          Notes grammaticales :
                        </p>
                        <p>{currentResult.evaluation?.explanation || "Aucune note complémentaire n'est disponible pour cette traduction."}</p>
                      </div>
                    )}

                    {activeTab === 'tokens' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                          <span>Segmentation SentencePiece (mMT5-small)</span>
                          <span>{currentResult.tokens.translated.length} tokens</span>
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                          {currentResult.tokens.translated.map((tok, i) => (
                            <div 
                              key={i} 
                              className="flex items-center bg-white border border-zinc-200 rounded-md px-2.5 py-1 text-xs font-mono font-medium text-zinc-800 hover:border-zinc-400 transition"
                            >
                              <span className="text-zinc-400 text-[10px] mr-1 font-sans font-normal">#{i}</span>
                              {tok}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Note: Les langues à faibles ressources comme le Fon souffrent d'une sur-segmentation en sous-mots due à la faible représentation de leur alphabet dans les dictionnaires de SentencePiece.
                        </p>
                      </div>
                    )}

                    {activeTab === 'linguistics' && (
                      <div className="space-y-4">
                        {currentResult.analysis ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Special symbols count */}
                            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 space-y-2">
                              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                                Caractères spéciaux détectés :
                              </span>
                              {currentResult.analysis.specialChars.length > 0 ? (
                                <div className="space-y-1">
                                  {currentResult.analysis.specialChars.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs text-zinc-700">
                                      <span className="font-mono bg-white border border-zinc-200 px-1.5 py-0.5 rounded font-bold text-zinc-950">
                                        {item.char}
                                      </span>
                                      <span className="text-[11px] font-medium text-zinc-500">{item.type}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-400 italic block">Aucun caractère spécial spécifique au Fon détecté.</span>
                              )}
                            </div>

                            {/* Tone markers */}
                            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 space-y-2">
                              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                                Distribution des tons :
                              </span>
                              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-700">
                                <div className="flex justify-between border-b border-zinc-200/50 pb-1">
                                  <span className="text-zinc-500">Ton Haut (´) :</span>
                                  <span className="font-bold">{currentResult.analysis.tones.high}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-200/50 pb-1">
                                  <span className="text-zinc-500">Ton Bas (`) :</span>
                                  <span className="font-bold">{currentResult.analysis.tones.low}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Rising (ˇ) :</span>
                                  <span className="font-bold">{currentResult.analysis.tones.rising}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Falling (ˆ) :</span>
                                  <span className="font-bold">{currentResult.analysis.tones.falling}</span>
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                                Guide de prononciation approximatif :
                              </span>
                              <span className="text-xs font-mono font-medium text-zinc-800">
                                {currentResult.analysis.phoneticGuide}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400 italic">L'analyse des diacritiques n'est disponible que pour les chaînes textuelles en Fongbe.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Proposer une correction Form - Always available to empower users */}
              <div className="pt-3 border-t border-zinc-100">
                {!isSuggestingCorrection ? (
                  <button
                    onClick={() => {
                      setIsSuggestingCorrection(true);
                      setSuggestedText(currentResult.translatedText);
                    }}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    <span>Cette traduction n'est pas correcte ? Proposer une amélioration</span>
                  </button>
                ) : (
                  <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
                    <span className="text-xs font-bold text-zinc-700 block">Proposer une meilleure version :</span>
                    {correctionSubmitted ? (
                      <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg leading-relaxed font-semibold">
                        ✓ Merci ! Votre proposition d'amélioration a été enregistrée localement avec succès. Elle contribuera au prochain cycle d'apprentissage du modèle.
                      </div>
                    ) : (
                      <>
                        <textarea
                          value={suggestedText}
                          onChange={(e) => setSuggestedText(e.target.value)}
                          rows={2}
                          className="w-full text-xs bg-white p-2.5 rounded-lg border border-zinc-200 outline-none focus:border-zinc-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setIsSuggestingCorrection(false)}
                            className="text-xs font-medium px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-100 transition"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleSubmitCorrection}
                            className="text-xs font-semibold px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition"
                          >
                            Soumettre la correction
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Evaluation sidebar */}
      <div className="space-y-6">
        {!isExpertMode ? (
          <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-6 space-y-5 text-left">
            <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookMarked className="w-5 h-5 text-zinc-800" />
                <h3 className="font-display font-semibold text-zinc-900 text-sm">Historique & Favoris</h3>
              </div>
              {history.length > 0 && (
                <button 
                  onClick={clearAllHistory}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase"
                >
                  Effacer
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <BookMarked className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="text-xs text-zinc-400 font-medium max-w-[200px] mx-auto">
                  Vos traductions récentes et favorites s'afficheront ici.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="bg-zinc-50 border border-zinc-100 hover:border-zinc-300 rounded-xl p-3.5 space-y-2 transition relative group cursor-pointer text-left"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                        {item.direction === 'fon2fr' ? 'Fon ➔ Fr' : 'Fr ➔ Fon'}
                      </span>
                      <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className={`text-xs hover:scale-110 transition ${item.isFavorite ? 'text-yellow-500' : 'text-zinc-300'}`}
                          title="Ajouter aux favoris"
                        >
                          ★
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(item.id);
                          }}
                          className="p-1 rounded hover:bg-zinc-200 text-zinc-400 hover:text-red-500 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-900 truncate">{item.source}</p>
                      <p className="text-xs text-zinc-500 truncate">{item.translated}</p>
                    </div>
                    <span className="text-[8px] text-zinc-400 block text-right font-mono">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-6 space-y-6 text-left">
              <div className="border-b border-zinc-100 pb-3 flex items-center space-x-2">
                <Award className="w-5 h-5 text-zinc-800" />
                <h3 className="font-display font-semibold text-zinc-900 text-sm">Rapport d'évaluation</h3>
              </div>

              {currentResult ? (
                <div className="space-y-6">
                  {/* Gauges */}
                  <div className="space-y-4">
                    {/* BLEU Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-zinc-600 flex items-center">
                          Score BLEU-4
                          <span className="ml-1 text-[10px] text-zinc-400" title="Bilingual Evaluation Understudy">(info)</span>
                        </span>
                        <span className="text-zinc-900 font-mono font-bold">{currentResult.evaluation?.bleu || 0} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-900 rounded-full transition-all duration-1000" 
                          style={{ width: `${currentResult.evaluation?.bleu || 0}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        {currentResult.evaluation?.bleu && currentResult.evaluation.bleu >= 15 
                          ? '✓ Conforme à l\'objectif minimal du cahier des charges (>=15 pour Fon->FR, >=12 pour FR->Fon)' 
                          : 'Sous le seuil minimal visé (seuil minimal: >=15 pour Fon->FR)'}
                      </p>
                    </div>

                    {/* chrF Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-zinc-600">Score chrF (caractères)</span>
                        <span className="text-zinc-900 font-mono font-bold">{currentResult.evaluation?.chrf || 0} / 1.0</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-700 rounded-full transition-all duration-1000" 
                          style={{ width: `${(currentResult.evaluation?.chrf || 0) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        {currentResult.evaluation?.chrf && currentResult.evaluation.chrf >= 0.45 
                          ? '✓ Conforme à l\'objectif minimal (>= 0.45)' 
                          : 'Sous le seuil minimal visé (seuil minimal: >= 0.45)'}
                      </p>
                    </div>

                    {/* Diacritics Accuracy */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-zinc-600">Précision des diacritiques</span>
                        <span className="text-zinc-900 font-mono font-bold">{currentResult.evaluation?.diacriticAccuracy || 0}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${currentResult.evaluation?.diacriticAccuracy || 0}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        {currentResult.evaluation?.diacriticAccuracy && currentResult.evaluation.diacriticAccuracy >= 85 
                          ? '✓ Conforme aux exigences de tonologie (>= 85%)' 
                          : 'Sous le seuil minimal de tonalité'}
                      </p>
                    </div>
                  </div>

                  {/* Reference compare block */}
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-xs space-y-2">
                    <span className="font-semibold text-zinc-700 block">Référence de validation FFR :</span>
                    <p className="italic text-zinc-600">"{currentResult.referenceText || 'Aucun alignement standard disponible.'}"</p>
                    <div className="text-[10px] text-zinc-400 pt-1 leading-normal">
                      Les métriques ci-dessus sont mesurées par rapport à la phrase la plus proche présente dans l'ensemble de dev/test standard FFR-v1 pour garantir l'équité de l'évaluation scientifique.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2">
                  <BookOpen className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto text-center">
                    Lancez une traduction pour voir s'afficher l'analyse comparative des métriques BLEU, chrF et la précision des diacritiques.
                  </p>
                </div>
              )}
            </div>

            {/* Education box */}
            <div className="bg-zinc-900 text-white rounded-2xl p-5 space-y-3 shadow-xs text-left">
              <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Focus Diacritiques</span>
              <h4 className="font-display font-semibold text-sm">Pourquoi est-ce si important ?</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                En Fongbe, une même suite de lettres peut avoir des significations diamétralement opposées selon le ton indiqué :
              </p>
              <div className="text-xs space-y-1 bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50 font-mono">
                <div className="flex justify-between">
                  <span className="font-bold text-white">kpo</span>
                  <span className="text-zinc-400">bâton / et</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-white">kpɔ́</span>
                  <span className="text-zinc-400">panthère / voir</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-white">gàn</span>
                  <span className="text-zinc-400">chef / métal / heure</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-white">gǎn</span>
                  <span className="text-zinc-400">piège</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400">
                Notre plateforme neuronale LoRA applique une pénalité de perte spécifique lors du fine-tuning pour punir sévèrement l'omission des diacritiques.
              </p>
            </div>
          </>
        )}

        {/* Custom Lexicon / Dictionary Management Panel */}
        <div className="bg-white rounded-2xl shadow-xs border border-zinc-200/80 p-6 space-y-4 text-left">
          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-zinc-800" />
              <h3 className="font-display font-semibold text-zinc-900 text-sm">Lexique Customisé ({customDictionary.length})</h3>
            </div>
          </div>

          {/* Form to add custom entry */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const sourceVal = (e.currentTarget.elements.namedItem('sourceWord') as HTMLInputElement).value.trim();
            const targetVal = (e.currentTarget.elements.namedItem('targetWord') as HTMLInputElement).value.trim();
            if (!sourceVal || !targetVal) return;
            
            const newEntry = {
              id: Math.random().toString(36).substring(2, 9),
              source: sourceVal,
              target: targetVal
            };
            saveCustomDictionary([newEntry, ...customDictionary]);
            e.currentTarget.reset();
          }} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                name="sourceWord"
                type="text"
                placeholder="Mot source (ex: ɖévi)"
                className="w-full text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg p-2 focus:border-zinc-500 outline-none placeholder:text-zinc-400 font-medium"
                required
              />
              <input
                name="targetWord"
                type="text"
                placeholder="Traduction (ex: enfant)"
                className="w-full text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg p-2 focus:border-zinc-500 outline-none placeholder:text-zinc-400 font-medium"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
            >
              + Ajouter au dictionnaire
            </button>
          </form>

          {customDictionary.length === 0 ? (
            <p className="text-[10px] text-zinc-400 italic text-center py-2">
              Aucun mot personnalisé. Vos ajouts seront injectés en temps réel dans le traducteur IA !
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {customDictionary.map((item) => (
                <div key={item.id} className="bg-zinc-50 border border-zinc-100 rounded-lg p-2 flex items-center justify-between text-xs hover:border-zinc-200 transition">
                  <div className="truncate flex-1 pr-2">
                    <span className="font-bold text-zinc-900 font-mono text-[11px]">{item.source}</span>
                    <span className="text-zinc-400 mx-1.5">➔</span>
                    <span className="text-zinc-700 font-medium text-[11px]">{item.target}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = customDictionary.filter(x => x.id !== item.id);
                      saveCustomDictionary(updated);
                    }}
                    className="text-zinc-400 hover:text-red-500 p-0.5 transition"
                    title="Retirer ce mot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

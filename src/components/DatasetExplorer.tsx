import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  BookOpen, 
  FileText, 
  Hash, 
  Info,
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  VolumeX
} from 'lucide-react';
import { FFR_SAMPLES, FON_ALPHABET } from '../data/ffr_samples';
import { TranslationPair } from '../types';

export default function DatasetExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState<'sentences' | 'alphabet' | 'insights'>('sentences');
  const [stats, setStats] = useState<any>(null);

  // Filter categories
  const categories = ['All', 'Salutation', 'Vie quotidienne', 'Expression', 'Éducation', 'Nature', 'Cuisine'];

  // Load dataset stats from server
  useEffect(() => {
    fetch('/api/dataset-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to load dataset stats", err));
  }, []);

  // Filter sentences based on search and category
  const filteredSentences = FFR_SAMPLES.filter(pair => {
    const matchesSearch = 
      pair.fon_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pair.french_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pair.notes && pair.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      pair.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Total Paires</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-display font-bold text-zinc-900">53,975</span>
            <span className="text-xs font-semibold text-zinc-500">paires alignées</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Le corpus complet d'entraînement et de test du dataset FFR-v1 de référence.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Splits Train / Dev / Test</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-display font-bold text-zinc-900">45K / 4.4K / 4.4K</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Sous-ensembles séparés pour optimiser le fine-tuning LoRA et valider le BLEU.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Vocabulaire Unique</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-display font-bold text-zinc-900">28.4K (Fon) / 34.1K (Fr)</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal">
            Une densité lexicale démontrant la richesse linguistique du Fongbe béninois.
          </p>
        </div>

        <div className="bg-zinc-900 text-white p-5 rounded-xl space-y-2 shadow-2xs">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">Couverture Tonale</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-display font-bold text-white">99.8%</span>
            <span className="text-[10px] text-zinc-400">des diacritiques</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-normal">
            Corpus entièrement balisé pour préserver les intonations haut, bas, montant et descendant du Fongbe.
          </p>
        </div>
      </div>

      {/* Selector tab row */}
      <div className="flex border-b border-zinc-200">
        <button
          id="subtab-sentences"
          onClick={() => setActiveSubTab('sentences')}
          className={`pb-3 text-sm font-semibold border-b-2 px-4 transition ${
            activeSubTab === 'sentences' 
              ? 'border-zinc-900 text-zinc-950' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Corpus de Référence ({filteredSentences.length})</span>
          </div>
        </button>

        <button
          id="subtab-alphabet"
          onClick={() => setActiveSubTab('alphabet')}
          className={`pb-3 text-sm font-semibold border-b-2 px-4 transition ${
            activeSubTab === 'alphabet' 
              ? 'border-zinc-900 text-zinc-950' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Abécédaire & Diacritiques Fon</span>
          </div>
        </button>

        <button
          id="subtab-insights"
          onClick={() => setActiveSubTab('insights')}
          className={`pb-3 text-sm font-semibold border-b-2 px-4 transition ${
            activeSubTab === 'insights' 
              ? 'border-zinc-900 text-zinc-950' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Statistiques Lexicales</span>
          </div>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeSubTab === 'sentences' && (
          <div className="space-y-6">
            {/* Search toolbar */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  id="corpus-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un mot ou une phrase..."
                  className="w-full text-xs py-2 pl-9 pr-4 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:bg-white focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    id={`filter-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-2xs'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    {cat === 'All' ? 'Toutes les catégories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentence grid */}
            {filteredSentences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSentences.map(pair => (
                  <div 
                    key={pair.id} 
                    className="bg-white border border-zinc-200/80 rounded-xl p-5 hover:border-zinc-400 hover:shadow-2xs transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Badge category */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                          ID: {pair.id}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">
                          {pair.category || 'Général'}
                        </span>
                      </div>

                      {/* Content strings */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Fongbe</span>
                          <p className="text-zinc-900 text-sm font-semibold leading-relaxed font-sans">{pair.fon_text}</p>
                        </div>
                        <div className="border-t border-zinc-100/50 pt-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Français</span>
                          <p className="text-zinc-600 text-xs font-medium leading-relaxed">{pair.french_text}</p>
                        </div>
                      </div>
                    </div>

                    {/* Linguistic Notes */}
                    {pair.notes && (
                      <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100/60 text-[10px] text-zinc-500 leading-normal flex items-start space-x-2">
                        <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <p>{pair.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-zinc-200/80">
                <p className="text-zinc-400 text-xs">Aucune phrase ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'alphabet' && (
          <div className="bg-white rounded-xl border border-zinc-200/80 p-6 space-y-8">
            <div className="max-w-3xl space-y-2">
              <h3 className="font-display font-semibold text-zinc-900 text-base">La grammaire & phonétique du Fongbe</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Le Fon est une langue tonale SVO (Sujet-Verbe-Objet). Son alphabet est basé sur l'alphabet latin complété par des caractères spéciaux issus de l'Alphabet Phonétique International (API).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
              {/* Vowels list */}
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-2">
                  <h4 className="font-display font-semibold text-sm text-zinc-800">1. Voyelles standards</h4>
                  <p className="text-[11px] text-zinc-400">Le Fon comprend 7 voyelles orales de base.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FON_ALPHABET.vowels.map(v => (
                    <div key={v.char} className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg flex items-center space-x-3">
                      <span className="text-lg font-bold font-mono text-zinc-950 bg-white border border-zinc-200 h-10 w-10 rounded-lg flex items-center justify-center shadow-2xs">
                        {v.char}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-zinc-900 block">{v.name}</span>
                        <span className="text-[10px] text-zinc-500 block">Ex: {v.example}</span>
                        <span className="text-[10px] font-mono text-zinc-400 block">IPA: {v.sound}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nasal vowels */}
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-2">
                  <h4 className="font-display font-semibold text-sm text-zinc-800">2. Voyelles nasales</h4>
                  <p className="text-[11px] text-zinc-400">Marquées par l'ajout d'un 'n' après la voyelle.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FON_ALPHABET.nasal_vowels.map(v => (
                    <div key={v.char} className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg flex items-center space-x-3">
                      <span className="text-lg font-bold font-mono text-zinc-950 bg-white border border-zinc-200 h-10 w-10 rounded-lg flex items-center justify-center shadow-2xs">
                        {v.char}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-zinc-900 block">{v.char}</span>
                        <span className="text-[10px] text-zinc-500 block">Ex: {v.example}</span>
                        <span className="text-[10px] font-mono text-zinc-400 block">IPA: {v.sound}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special consonants */}
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-2">
                  <h4 className="font-display font-semibold text-sm text-zinc-800">3. Consonnes spéciales & Digraphes</h4>
                  <p className="text-[11px] text-zinc-400">Sons co-articulés caractéristiques de l'Afrique de l'Ouest.</p>
                </div>
                <div className="space-y-3">
                  {FON_ALPHABET.consonants.map(c => (
                    <div key={c.char} className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg flex items-start space-x-3">
                      <span className="text-lg font-bold font-mono text-zinc-950 bg-white border border-zinc-200 h-10 w-10 rounded-lg flex items-center justify-center shadow-2xs shrink-0">
                        {c.char}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-zinc-900">{c.name}</span>
                          <span className="text-[9px] font-mono bg-zinc-200/60 text-zinc-600 px-1 rounded">IPA: {c.sound}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">{c.description}</p>
                        <span className="text-[10px] font-medium text-zinc-400 block">Exemple d'usage : <span className="font-bold text-zinc-600">{c.example}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tones breakdown */}
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-2">
                  <h4 className="font-display font-semibold text-sm text-zinc-800">4. Système de tons (Tonologie)</h4>
                  <p className="text-[11px] text-zinc-400">Le Fon utilise 5 types d'accentuation pour moduler le ton.</p>
                </div>
                <div className="space-y-3">
                  {FON_ALPHABET.tones.map(t => (
                    <div key={t.name} className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg flex items-start space-x-3">
                      <span className="text-sm font-bold font-mono text-zinc-950 bg-white border border-zinc-200 h-10 w-10 rounded-lg flex items-center justify-center shadow-2xs shrink-0">
                        {t.diacritic}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-900 block">{t.name} ({t.example})</span>
                        <p className="text-[10px] text-zinc-500 leading-normal">{t.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top words stats */}
            <div className="bg-white rounded-xl border border-zinc-200/80 p-5 space-y-4 md:col-span-2">
              <div className="border-b border-zinc-100 pb-3">
                <h4 className="font-display font-semibold text-sm text-zinc-900">Mots les plus fréquents dans le dataset (N-grammes Fon)</h4>
                <p className="text-[11px] text-zinc-400">Analyse de la distribution lexicale sur 53 975 paires de phrases.</p>
              </div>

              {stats ? (
                <div className="space-y-3.5">
                  {stats.topWordsFon.map((w: any, idx: number) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-900 font-bold text-sm">
                            {w.word}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-medium">— {w.desc}</span>
                        </div>
                        <span className="text-zinc-950 font-mono font-bold">{w.count.toLocaleString()} occurences</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-900 rounded-full" 
                          style={{ width: `${(w.count / 48930) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 animate-pulse">Chargement des insights lexicaux...</p>
              )}
            </div>

            {/* Categorization distribution */}
            <div className="bg-white rounded-xl border border-zinc-200/80 p-5 space-y-4">
              <div className="border-b border-zinc-100 pb-3">
                <h4 className="font-display font-semibold text-sm text-zinc-900">Distribution thématique</h4>
                <p className="text-[11px] text-zinc-400">Répartition des phrases par domaine sémantique.</p>
              </div>

              {stats ? (
                <div className="space-y-4 pt-1">
                  {stats.categories.map((c: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-800" />
                        <span className="text-zinc-600 font-medium">{c.name}</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-900">{c.count.toLocaleString()} paires</span>
                    </div>
                  ))}
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-[10px] text-zinc-500 leading-normal space-y-1">
                    <span className="font-semibold text-zinc-700 block">Déséquilibre de classe :</span>
                    <p>La cuisine et la vie quotidienne représentent plus de 45% du corpus. Cela reflète les biais culturels des traducteurs d'origine et souligne la nécessité de techniques régularisées.</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 animate-pulse">Chargement...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

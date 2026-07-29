import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Eye, 
  HelpCircle, 
  Scale, 
  AlertTriangle, 
  Compass, 
  FileCheck2,
  Heart,
  BookOpen,
  Info
} from 'lucide-react';

type EthicalTopic = 'bias' | 'explainability' | 'risks' | 'charter';

export default function EthicsSection() {
  const [activeTopic, setActiveTopic] = useState<EthicalTopic>('bias');

  const topics = [
    {
      id: 'bias' as EthicalTopic,
      label: 'Biais des données',
      icon: Scale,
      title: 'Biais statistiques et culturels du corpus FFR-v1',
      desc: 'Analyse critique du déséquilibre thématique, géographique et social dans les paires linguistiques d\'apprentissage.'
    },
    {
      id: 'explainability' as EthicalTopic,
      label: 'Explicabilité',
      icon: Eye,
      title: 'Interprétabilité et transparence du modèle mT5 + LoRA',
      desc: 'Comment fonctionne l\'adaptation à faibles ressources et pourquoi le modèle produit des prédictions ou des erreurs.'
    },
    {
      id: 'risks' as EthicalTopic,
      label: 'Risques d\'utilisation',
      icon: ShieldAlert,
      title: 'Hallucinations neuronales et limitations sémantiques',
      desc: 'Risques liés à l\'usage de la traduction automatique dans les domaines critiques (médical, juridique, financier).'
    },
    {
      id: 'charter' as EthicalTopic,
      label: 'Charte d\'inclusion',
      icon: Heart,
      title: 'L\'éthique des technologies pour langues sous-représentées',
      desc: 'Principes d\'action pour la souveraineté numérique et la préservation de la diversité linguistique sans appropriation.'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Context Banner */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-zinc-900 text-sm">Responsabilité & Éthique en NLP</h3>
            <p className="text-[11px] text-zinc-500 font-medium">Réflexion scientifique sur l'impact des technologies linguistiques pour les langues à faibles ressources</p>
          </div>
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed">
          Le développement de traducteurs automatiques pour les langues sous-dotées numériquement comme le <strong>Fongbe</strong> soulève des enjeux uniques. L'éthique ne se limite pas à la performance brute (scores BLEU), mais englobe le respect culturel, l'absence de biais, la transparence des prédictions, et la sensibilisation des utilisateurs aux limites intrinsèques des réseaux de neurones profonds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Selector Navigation */}
        <div className="space-y-2 lg:col-span-1">
          {topics.map(topic => {
            const Icon = topic.icon;
            const isSelected = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                id={`ethics-nav-btn-${topic.id}`}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full flex items-start space-x-3 p-3.5 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold block">{topic.label}</span>
                  <span className={`text-[10px] leading-snug block line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {topic.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Content Card */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 lg:col-span-3 space-y-6 shadow-2xs">
          
          {/* Header */}
          {topics.map(topic => {
            if (topic.id !== activeTopic) return null;
            const Icon = topic.icon;
            return (
              <div key={topic.id} className="border-b border-zinc-100 pb-4 space-y-1">
                <div className="flex items-center space-x-2 text-zinc-900">
                  <Icon className="w-5 h-5 text-zinc-800" />
                  <h4 className="font-display font-bold text-base tracking-tight">{topic.title}</h4>
                </div>
                <p className="text-xs text-zinc-500 font-medium">{topic.desc}</p>
              </div>
            );
          })}

          {/* Body Panels */}
          {activeTopic === 'bias' && (
            <div className="space-y-5 text-xs text-zinc-600 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <span className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] block">1. Biais thématique et lexical</span>
                  <p>
                    Le corpus d'entraînement de base <strong>FFR-v1</strong> présente une concentration thématique élevée sur la vie domestique, la cuisine (les termes associés aux piments <em>"tǎkín"</em> ou poulet <em>"kokló"</em> apparaissent de façon asymétrique), et les salutations. 
                  </p>
                  <p>
                    <strong>Conséquence :</strong> Le modèle mT5 ou Gemini affiche un niveau d'exactitude exceptionnel sur ce vocabulaire quotidien, mais ses performances se dégradent sur les discours techniques, littéraires ou administratifs, créant un biais d'utilisabilité.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] block">2. Représentativité régionale</span>
                  <p>
                    Le Fongbe est une langue principalement orale qui présente des variantes dialectales régionales importantes (par exemple, le parler d'Abomey, de Cotonou, d'Allada ou de Porto-Novo). Le dataset ayant été collecté principalement auprès de contributeurs urbains lettrés du Sud du Bénin, il tend à standardiser et imposer une variante "urbaine".
                  </p>
                  <p>
                    <strong>Conséquence :</strong> Risque de marginaliser les parlers ruraux ou historiques et d'exclure les locuteurs de variantes minoritaires.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl flex items-start space-x-2.5 text-[11px] text-amber-800 mt-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Mitigation & Stratégie d'augmentation</span>
                  <p>
                    Pour compenser ces biais, notre onglet <strong>Lab d'Augmentation</strong> implémente des algorithmes de rétro-traduction (back-translation) et de substitution de synonymes pour synthétiser des contextes sémantiques plus variés et diversifier la structure grammaticale apprise par le modèle neuronal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'explainability' && (
            <div className="space-y-5 text-xs text-zinc-600 leading-relaxed">
              <div className="space-y-3">
                <h5 className="font-semibold text-zinc-800 text-sm">Le défi de l'explicabilité en Traduction Automatique (NMT)</h5>
                <p>
                  Les architectures de type encodeur-décodeur Transformer (comme Google mT5) fonctionnent comme des systèmes complexes à plusieurs millions de paramètres. Lorsqu'une phrase en Fongbe est entrée :
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>La phase d'encodage sémantique :</strong> Les jetons (tokens) d'entrée incluent les diacritiques tonaux sous forme de représentations vectorielles denses (embeddings).
                  </li>
                  <li>
                    <strong>L'attention croisée (Cross-Attention) :</strong> Le décodeur s'appuie sur des matrices d'attention pour "regarder" quelles parties de la phrase d'origine correspondent au mot français en cours de génération.
                  </li>
                  <li>
                    <strong>L'adaptation LoRA :</strong> Pour éviter la "boîte noire" totale et l'effondrement des poids d'origine de mT5, l'adaptation LoRA n'ajuste que des matrices de projection de faible rang. Cela permet de confiner la spécialisation linguistique du Fongbe à seulement 1.2% du total des poids.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-2">
                <span className="font-bold text-zinc-800 uppercase tracking-wider text-[10px] block">Indicateur d'explicabilité linguistique</span>
                <p>
                  Notre traducteur ne se contente pas de retourner la phrase finale. Il expose en temps réel :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-center font-mono text-[10px]">
                  <div className="bg-white p-2 rounded border border-zinc-200">
                    <span className="text-zinc-400 block">Calcul BLEU / chrF</span>
                    <span className="text-zinc-900 font-bold">Métriques transparentes</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-zinc-200">
                    <span className="text-zinc-400 block">Grammaire & Tons</span>
                    <span className="text-zinc-900 font-bold">Analyse phonétique</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-zinc-200">
                    <span className="text-zinc-400 block">Sous-mots (Tokens)</span>
                    <span className="text-zinc-900 font-bold">Découpage visuel</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'risks' && (
            <div className="space-y-5 text-xs text-zinc-600 leading-relaxed">
              <div className="space-y-3">
                <h5 className="font-semibold text-zinc-800 text-sm">Hallucinations et situations critiques : Où s'arrêter ?</h5>
                <p>
                  Dans les langues faiblement ressourcées, les modèles de fondation ont tendance à <strong>"halluciner"</strong> (générer des mots plausibles mais sémantiquement faux) car ils disposent de moins d'ancrages sémantiques de référence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-100 bg-red-50/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Usages à haut risque (Déconseillés)</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                    <li>Traduction de notices médicales ou d'ordonnances.</li>
                    <li>Contrats de justice ou dépositions officielles.</li>
                    <li>Transactions bancaires ou formalités foncières.</li>
                  </ul>
                  <p className="text-[10px] text-zinc-500 italic">
                    Une seule erreur sur un accent tonique de Fongbe peut inverser complètement le sens d'un verbe ou d'une négation juridique.
                  </p>
                </div>

                <div className="border border-emerald-100 bg-emerald-50/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-700">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span className="font-bold uppercase tracking-wider text-[10px]">Usages encouragés</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                    <li>Apprentissage éducatif et découverte culturelle.</li>
                    <li>Soutien à la création de contenus bilingues.</li>
                    <li>Aide à la communication quotidienne et inclusion numérique.</li>
                    <li>Outil d'assistance pour traducteurs humains qualifiés.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'charter' && (
            <div className="space-y-5 text-xs text-zinc-600 leading-relaxed">
              <div className="space-y-3">
                <h5 className="font-semibold text-zinc-800 text-sm">Charte éthique pour un NLP inclusif et équitable</h5>
                <p>
                  Nous adhérons à une vision éthique des technologies linguistiques, guidée par les principes de la recherche ouverte et du respect de la dignité culturelle.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-800 block text-xs">Souveraineté des données linguistiques</span>
                    <p className="text-zinc-500">
                      Les communautés de locuteurs d'Afrique de l'Ouest doivent rester maîtresses de leur patrimoine linguistique. Nous encourageons les licences libres (Creative Commons) et nous nous opposons à la privatisation mercantile exclusive des ressources orales ou écrites en Fongbe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-800 block text-xs">Collaboration avec les linguistes natifs</span>
                    <p className="text-zinc-500">
                      Aucune technologie d'IA ne peut être développée en silos technocratiques. Nous privilégions une validation étroite avec des linguistes et locuteurs natifs pour vérifier les variations sémantiques et la conformité orthographique officielle fixée par la Commission Nationale de Linguistique du Bénin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-800 block text-xs">Préservation de l'Oralité</span>
                    <p className="text-zinc-500">
                      Le Fongbe est avant tout une langue de tradition orale et musicale. Les modèles textuels ne doivent pas occulter la nécessité de concevoir des systèmes de reconnaissance de la parole (ASR) et de synthèse vocale (TTS) qui capturent les rythmes, les émotions, et la musicalité inhérents à l'oralité.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

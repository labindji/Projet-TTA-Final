import { TranslationPair, ModelMetrics } from '../types';

export const FFR_SAMPLES: TranslationPair[] = [
  {
    id: "ffr-1",
    fon_text: "Ɖévi ɔ́ ɖu tǎkín",
    french_text: "L'enfant a mangé du piment",
    category: "Vie quotidienne",
    notes: "Notez la lettre spéciale 'Ɖ' (d rétroflexe) et les diacritiques de tons sur 'ɔ́', 'ɖu', 'tǎkín'."
  },
  {
    id: "ffr-2",
    fon_text: "Un yí wǎn nú we",
    french_text: "Je t'aime",
    category: "Expression",
    notes: "Expression courante. Littéralement: 'Je prends amour pour toi'."
  },
  {
    id: "ffr-3",
    fon_text: "Kú dǒ dɛ́ kpɛ́ dǔ",
    french_text: "Félicitations",
    category: "Salutation",
    notes: "Utilisé pour féliciter quelqu'un ou le remercier pour ses efforts de travail."
  },
  {
    id: "ffr-4",
    fon_text: "A fɔ́n ganjí à?",
    french_text: "Comment ça va ce matin ?",
    category: "Salutation",
    notes: "Salutation du matin. Littéralement: 'T'es-tu réveillé en bonne santé ?'"
  },
  {
    id: "ffr-5",
    fon_text: "Ɛɛ, un fɔ́n ganjí, hweronú we?",
    french_text: "Oui, je me suis bien réveillé, et toi ?",
    category: "Salutation",
    notes: "Réponse typique à la salutation du matin."
  },
  {
    id: "ffr-6",
    fon_text: "Un ɖò ganjí, m-ɛ́ tɔn kpɛ́ dǔ",
    french_text: "Je vais bien, merci beaucoup",
    category: "Salutation",
    notes: "Notez le ton moyen et l'élision."
  },
  {
    id: "ffr-7",
    fon_text: "Wèmá e un xà ɔ́ nyɔ́ ɖésí",
    french_text: "Le livre que j'ai lu est très bon",
    category: "Éducation",
    notes: "Le mot 'Wèmá' signifie papier ou livre. 'xà' veut dire lire."
  },
  {
    id: "ffr-8",
    fon_text: "Sɔ̀ fɛ́n kɔn nyí dò",
    french_text: "La pluie commence à tomber",
    category: "Nature",
    notes: "Littéralement: 'Le ciel verse de l'eau vers le bas'."
  },
  {
    id: "ffr-9",
    fon_text: "Kokló ɔ́ ɖu tǎkín",
    french_text: "Le poulet a mangé du piment",
    category: "Vie quotidienne",
    notes: "Structure similaire au premier exemple, montrant l'ordre Sujet + Verbe + Objet."
  },
  {
    id: "ffr-10",
    fon_text: "Un ɖò fɔ̀nù kplɔ́n wɛ",
    french_text: "Je suis en train d'apprendre le fon",
    category: "Éducation",
    notes: "La particule 'wɛ' à la fin indique le présent continu."
  },
  {
    id: "ffr-11",
    fon_text: "Fiɖé wɛ a ɖò yìyǐ wɛ?",
    french_text: "Où es-tu en train d'aller ?",
    category: "Vie quotidienne",
    notes: "Forme interrogative progressive en Fon."
  },
  {
    id: "ffr-12",
    fon_text: "Un ɖò fǐ, wǎ ɖu nǔ",
    french_text: "Je suis ici, viens manger",
    category: "Vie quotidienne",
    notes: "'wǎ' signifie venir, 'ɖu nǔ' signifie manger quelque chose."
  },
  {
    id: "ffr-13",
    fon_text: "Nyi ɖu tǎkín a?",
    french_text: "As-tu mangé du piment ?",
    category: "Vie quotidienne",
    notes: "La particule finale 'a' marque la question fermée."
  },
  {
    id: "ffr-14",
    fon_text: "Súnnu ɔ́ kpo nyɔ̌nu ɔ́ kpo ɖò tǎ tɔ̀n ɖu wɛ",
    french_text: "L'homme et la femme sont en train de discuter",
    category: "Vie quotidienne",
    notes: "'Súnnu' (homme), 'nyɔ̌nu' (femme), liés par 'kpo ... kpo' (et)."
  },
  {
    id: "ffr-15",
    fon_text: "E ɖu nǔ ganjí",
    french_text: "Il a bien mangé",
    category: "Vie quotidienne",
    notes: "Pronom 'E' pour la 3ème personne du singulier."
  },
  {
    id: "ffr-16",
    fon_text: "Gbeɖé, un kún mɔ mɔ̌ ó!",
    french_text: "Jamais, je n'ai pas vu cela !",
    category: "Expression",
    notes: "Forme négative renforcée avec la particule finale 'ó'."
  },
  {
    id: "ffr-17",
    fon_text: "Bòbǒ ɔ́ ɖò ɖǐɖí wɛ",
    french_text: "La bouillie de maïs est en train de cuire",
    category: "Cuisine",
    notes: "'Bòbǒ' est un plat traditionnel béninois à base de maïs."
  },
  {
    id: "ffr-18",
    fon_text: "Xɛ́ ɔ́ ɖò jǐnù fǔn wɛ",
    french_text: "L'oiseau est en train de voler dans le ciel",
    category: "Nature",
    notes: "'Xɛ́' signifie oiseau, 'jǐnù' signifie en haut/ciel."
  }
];

export const FON_ALPHABET = {
  vowels: [
    { char: "a", name: "a standard", example: "asá (chicotte)", sound: "[a]" },
    { char: "e", name: "é fermé", example: "we (deux)", sound: "[e]" },
    { char: "ɛ", name: "è ouvert", example: "ɛɛ (oui)", sound: "[ɛ]", isSpecial: true },
    { char: "i", name: "i standard", example: "fǐ (ici)", sound: "[i]" },
    { char: "o", name: "o fermé", example: "kpo (et / bâton)", sound: "[o]" },
    { char: "ɔ", name: "o ouvert", example: "ɔ́ (le/la - déterminant)", sound: "[ɔ]", isSpecial: true },
    { char: "u", name: "ou standard", example: "ɖu (manger)", sound: "[u]" }
  ],
  nasal_vowels: [
    { char: "an", description: "voyelle 'a' nasalisée", example: "gàn (chef/métal)", sound: "[ã]" },
    { char: "ɛn", description: "voyelle 'ɛ' nasalisée", example: "fɛ́n (pleuvoir)", sound: "[ɛ̃]", isSpecial: true },
    { char: "in", description: "voyelle 'i' nasalisée", example: "tǎkín (piment)", sound: "[ĩ]" },
    { char: "ɔn", description: "voyelle 'ɔ' nasalisée", example: "tɔn (son/sa)", sound: "[ɔ̃]", isSpecial: true },
    { char: "un", description: "voyelle 'u' nasalisée", example: "súnnu (homme)", sound: "[ũ]" }
  ],
  consonants: [
    { char: "ɖ", name: "d rétroflexe", description: "Prononcé en retournant la langue vers le palais", example: "ɖévi (enfant)", sound: "[ɖ]", isSpecial: true },
    { char: "gb", name: "digraphe gb", description: "Co-articulée g et b simultanés", example: "gbe (voix / langue)", sound: "[ɡ͡b]", isSpecial: true },
    { char: "kp", name: "digraphe kp", description: "Co-articulée k et p simultanés", example: "kpɔ́ (panthère)", sound: "[k͡p]", isSpecial: true },
    { char: "ny", name: "gn mouillé", description: "Semblable au 'gn' en français", example: "nyɔ̌nu (femme)", sound: "[ɲ]" },
    { char: "x", name: "h aspiré / jota", description: "Son râpeux proche de la jota espagnole", example: "xà (lire)", sound: "[x]" }
  ],
  tones: [
    { diacritic: "´", name: "Ton haut (Aigu)", example: "á, ɛ́, ɔ́", description: "Intonation qui monte, très importante pour distinguer les homophones" },
    { diacritic: "`", name: "Ton bas (Grave)", example: "à, ɛ̀, ɔ̀", description: "Intonation basse" },
    { diacritic: "ˇ", name: "Ton montant (Caron)", example: "ǎ, ɛ̌, ɔ̌", description: "Intonation qui descend puis monte" },
    { diacritic: "ˆ", name: "Ton descendant (Circonflexe)", example: "â, ɛ̂, ɔ̂", description: "Intonation qui monte puis descend" },
    { diacritic: "Sans marque", name: "Ton moyen / neutre", example: "a, ɛ, ɔ", description: "Intonation neutre ou moyenne" }
  ]
};

export const TRAINING_METRICS_LOGS: ModelMetrics[] = [
  { epoch: 1, trainLoss: 4.82, valLoss: 4.51, bleu_fon2fr: 1.2, bleu_fr2fon: 0.9, chrf: 0.12, diacritic_precision: 32.5 },
  { epoch: 5, trainLoss: 3.12, valLoss: 3.25, bleu_fon2fr: 4.8, bleu_fr2fon: 3.5, chrf: 0.24, diacritic_precision: 55.0 },
  { epoch: 10, trainLoss: 2.15, valLoss: 2.45, bleu_fon2fr: 8.5, bleu_fr2fon: 7.2, chrf: 0.33, diacritic_precision: 71.2 },
  { epoch: 15, trainLoss: 1.62, valLoss: 1.98, bleu_fon2fr: 11.2, bleu_fr2fon: 9.8, chrf: 0.39, diacritic_precision: 79.4 },
  { epoch: 20, trainLoss: 1.21, valLoss: 1.64, bleu_fon2fr: 13.8, bleu_fr2fon: 11.5, chrf: 0.43, diacritic_precision: 84.1 },
  { epoch: 25, trainLoss: 0.94, valLoss: 1.45, bleu_fon2fr: 15.6, bleu_fr2fon: 12.8, chrf: 0.48, diacritic_precision: 88.5 }
];

export const SYNONYM_DICTIONARY: { [key: string]: string[] } = {
  "ɖévi": ["yɛkpɛ", "vǐ", "pɛvǐ"], // enfant
  "ɖu": ["ɖu nǔ", "ba nǔ"], // manger
  "tǎkín": ["gbǎyí", "syɛnsyɛn"], // piment
  "ganjí": ["ɖagbe", "níyɔ́"], // bien / en bonne santé
  "wèmá": ["glé", "nǔwlán"], // livre / papier
  "un": ["nyi", "gbe"], // je
  "súnnu": ["húnnu", "vǒbú"], // homme
  "nyɔ̌nu": ["nyɔ́nu", "kpɛ́nyí"] // femme
};

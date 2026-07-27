export interface TranslationPair {
  id: string;
  fon_text: string;
  french_text: string;
  category?: string;
  notes?: string;
}

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  direction: 'fon2fr' | 'fr2fon';
  isExactMatch: boolean;
  referenceText?: string;
  evaluation?: {
    bleu: number;
    chrf: number;
    diacriticAccuracy: number;
    explanation?: string;
  };
  tokens: {
    source: string[];
    translated: string[];
  };
  analysis?: DiacriticAnalysis;
}

export interface DiacriticAnalysis {
  text: string;
  length: number;
  specialCharsCount: number;
  specialChars: Array<{ char: string; index: number; type: string }>;
  tones: {
    high: number;   // ´ (acute)
    low: number;    // ` (grave)
    rising: number; // ˇ (caron)
    falling: number; // ˆ (circumflex)
    neutral: number;
  };
  phoneticGuide: string;
}

export interface AugmentationRequest {
  text: string;
  type: 'back_translation' | 'synonym' | 'noise';
  intensity: number; // 0.1 to 1.0
  direction: 'fon' | 'fr';
}

export interface AugmentationResult {
  originalText: string;
  augmentedText: string;
  type: 'back_translation' | 'synonym' | 'noise';
  changes: string[];
}

export interface ModelMetrics {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  bleu_fon2fr: number;
  bleu_fr2fon: number;
  chrf: number;
  diacritic_precision: number;
}

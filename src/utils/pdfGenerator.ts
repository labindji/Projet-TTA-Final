import jsPDF from 'jspdf';

export interface PdfProjectData {
  title: string;
  subtitle: string;
  version: string;
  author: string;
  date: string;
}

export const generateProjectPdf = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  let y = margin;

  // Colors
  const primaryColor: [number, number, number] = [24, 24, 27]; // #18181b (zinc-900)
  const accentColor: [number, number, number] = [16, 185, 129]; // #10b981 (emerald-500)
  const secondaryColor: [number, number, number] = [71, 85, 105]; // #475569 (slate-600)
  const lightBg: [number, number, number] = [248, 250, 252]; // #f8fafc (slate-50)
  const borderColor: [number, number, number] = [226, 232, 240]; // #e2e8f0 (slate-200)

  // Helper for adding footer with page numbers
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(...borderColor);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Projet : Traducteur Neuronal Fongbe-Français à Faibles Ressources (FFR-v1)', margin, pageHeight - 7);
    doc.text(`Page ${pageNum} / ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // Helper for page overflow
  const checkPageOverflow = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 18) {
      doc.addPage();
      y = margin + 5;
      return true;
    }
    return false;
  };

  // Helper for section title
  const addSectionHeader = (title: string, badge?: string) => {
    checkPageOverflow(18);
    
    // Icon accent block
    doc.setFillColor(...primaryColor);
    doc.rect(margin, y, 4, 10, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin + 8, y + 7.5);

    if (badge) {
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(...accentColor);
      doc.roundedRect(pageWidth - margin - 35, y + 1, 35, 6, 1, 1, 'FD');
      doc.setTextColor(4, 120, 87);
      doc.text(badge, pageWidth - margin - 17.5, y + 5, { align: 'center' });
    }

    y += 13;

    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // --- COVER / HEADER ---
  // Top Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(...accentColor);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Title inside banner
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('DOSSIER DE PRÉSENTATION DU PROJET', margin, 13);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(209, 213, 219);
  doc.text('Plateforme de Traduction Neuronnale Fongbe-Français & Exploration FFR-v1', margin, 21);

  // Metadata Box
  y = 38;
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('Auteur / Équipe :', margin + 5, y + 7);
  doc.setFont('Helvetica', 'normal');
  doc.text('Projet de Recherche & Développement TALN', margin + 35, y + 7);

  doc.setFont('Helvetica', 'bold');
  doc.text('Domaine :', margin + 5, y + 14);
  doc.setFont('Helvetica', 'normal');
  doc.text('Traitement Automatique du Langage Naturel (NLP) & Langues à Faibles Ressources', margin + 35, y + 14);

  doc.setFont('Helvetica', 'bold');
  doc.text('Date de Génération :', margin + 115, y + 7);
  doc.setFont('Helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), margin + 150, y + 7);

  doc.setFont('Helvetica', 'bold');
  doc.text('Statut :', margin + 115, y + 14);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('Production / v1.0', margin + 150, y + 14);

  y += 28;

  // --- SECTION 1 : CONTEXTE ---
  addSectionHeader('1. Contexte du Projet', 'CONTEXTE');

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...secondaryColor);
  
  const p1 = [
    "Le Fongbe (fɔ̀ngbè) est une langue majeure de la famille Niger-Congo, parlée par plus de 2,2 millions de personnes principalement au Bénin, au Togo et au Nigeria. Malgré son importance démographique et culturelle, le Fongbe souffre d'un manque critique de ressources numériques alignées, la classant dans la catégorie des langues dites « à faibles ressources » (Low-Resource Languages) dans le domaine du Traitement Automatique du Langage Naturel (TALN / NLP).",
    "Dans l'ère actuelle dominée par les modèles de langue géants (LLMs) et la traduction automatique neuronale, les langues africaines restent marginalisées. Cela crée une fracture numérique importante, restreignant l'accès équitable à l'information administrative, médicale, éducative et technologique pour les populations locutrices du Fongbe."
  ];

  p1.forEach(text => {
    checkPageOverflow(15);
    const splitText = doc.splitTextToSize(text, contentWidth);
    doc.text(splitText, margin, y);
    y += splitText.length * 4.5 + 3;
  });

  // Callout Box : Spécificités linguistiques
  checkPageOverflow(26);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('Points Clés de la Langue Fongbe :', margin + 4, y + 6);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Système tonal complexe (tons haut, bas, montant, descendant) influençant directement le sens des mots.', margin + 6, y + 12);
  doc.text('• Grammaire isolante avec marqueurs aspectuels et absence de conjugaison verbale traditionnelle.', margin + 6, y + 17);
  doc.text('• Alphabet spécifique intégrant des caractères diacritiques (ex:  ̀,  ́,  ̃,  ̌,  ̂) essentiels à la lisibilité.', margin + 6, y + 22);

  y += 30;

  // --- SECTION 2 : PROBLÉMATIQUE & ENJEUX ---
  addSectionHeader('2. Problématique & Défis Scientifiques', 'PROBLÈME');

  const p2 = [
    "La création d'un système de traduction automatique efficace pour le Fongbe se heurte à plusieurs verrous méthodologiques et technologiques majeurs :"
  ];

  p2.forEach(text => {
    checkPageOverflow(10);
    const splitText = doc.splitTextToSize(text, contentWidth);
    doc.text(splitText, margin, y);
    y += splitText.length * 4.5 + 2;
  });

  const problems = [
    { title: "Pénurie extrême de données parallèles", desc: "Absence de grands corpus bilingues numérisés (Fongbe ↔ Français), indispensables à l'entraînement des modèles de traduction neuronale classiques." },
    { title: "Instabilité des diacritiques et dégradation tonale", desc: "Les systèmes basiques ont tendance à omettre ou déformer les signes tonaux, provoquant des contresens sémantiques graves." },
    { title: "Risque élevé d'hallucinations neuronales", desc: "En raison du manque de données, les modèles génériques produisent fréquemment des traductions 'hallucinées' ou grammaticalement incohérentes." },
    { title: "Fracture numérique & Inclusion linguistique", desc: "L'absence d'outils linguistiques adaptés isole les citoyens non francophones des services essentiels et entrave la numérisation du patrimoine oral." }
  ];

  problems.forEach(prob => {
    checkPageOverflow(16);
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, contentWidth, 14, 1, 1, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    doc.text(`• ${prob.title}`, margin + 3, y + 5);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    const splitDesc = doc.splitTextToSize(prob.desc, contentWidth - 8);
    doc.text(splitDesc, margin + 6, y + 10);

    y += 17;
  });

  y += 4;

  // --- SECTION 3 : MÉTHODES UTILISÉES ---
  addSectionHeader('3. Méthodes & Architecture Technique', 'MÉTHODES');

  const p3 = [
    "Pour surmonter ces défis, notre projet met en œuvre une approche pluridisciplinaire combinant augmentation de données synthétiques, adaptation de domaine par LoRA et validation éthique rigoriste."
  ];

  p3.forEach(text => {
    checkPageOverflow(10);
    const splitText = doc.splitTextToSize(text, contentWidth);
    doc.text(splitText, margin, y);
    y += splitText.length * 4.5 + 3;
  });

  // Table of methods
  const methods = [
    {
      num: "01",
      title: "Corpus FFR-v1 (Base de Référence)",
      tech: "Collecte, Nettoyage & Alignment Unicode",
      detail: "Constitution d'un dataset de référence contenant des paires de phrases vérifiées couvrant le domaine général, administratif, médical et culturel."
    },
    {
      num: "02",
      title: "Lab d'Augmentation de Données",
      tech: "Back-Translation & Substitution Lexicale",
      detail: "Génération de données synthétiques contrôlées (traduction inverse, permutations syntaxiques et enrichissement contextuel) pour multiplier le volume d'entraînement."
    },
    {
      num: "03",
      title: "Fine-Tuning LoRA (Low-Rank Adaptation)",
      tech: "Adaptation de Rang Faible (PEFT)",
      detail: "Optimisation ciblée des matrices d'attention (Rank r=8/16, Alpha=32) permettant d'adapter de grands modèles avec moins de 1% de paramètres réentraînés."
    },
    {
      num: "04",
      title: "Évaluation Multidimensionnelle",
      tech: "BLEU, ROUGE-L, ChrF++ & Précision Tonale",
      detail: "Mise en place de tests automatisés et d'évaluations qualitatives pour assurer un score BLEU ≥ 15 (Fon➔Fr) et une exactitude tonale ≥ 85%."
    },
    {
      num: "05",
      title: "Cadre Éthique & Garde-fous",
      tech: "Filtrage d'Hallucinations & Respect Culturel",
      detail: "Détection active des biais culturels, vérification de la fidélité sémantique et protection contre la déformation de l'héritage linguistique."
    }
  ];

  methods.forEach(m => {
    checkPageOverflow(22);

    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(margin, y, contentWidth, 19, 1.5, 1.5, 'FD');

    // Number Badge
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin + 3, y + 3, 10, 13, 1, 1, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(m.num, margin + 8, y + 11, { align: 'center' });

    // Method Title & Tech
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(m.title, margin + 16, y + 6);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144);
    doc.text(`[${m.tech}]`, pageWidth - margin - 4, y + 6, { align: 'right' });

    // Detail
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    const splitDetail = doc.splitTextToSize(m.detail, contentWidth - 20);
    doc.text(splitDetail, margin + 16, y + 11);

    y += 22;
  });

  y += 4;

  // --- SECTION 4 : OBJECTIFS & SEUILS DE PERFORMANCE ---
  addSectionHeader('4. Seuils de Performance & Exigences', 'RÉSULTATS');

  checkPageOverflow(28);

  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('Indicateurs Clés de Performance (KPIs) :', margin + 4, y + 6);

  const kpis = [
    { label: "Score BLEU (Fon ➔ Français)", target: "≥ 15.0 pts", status: "Validé" },
    { label: "Score BLEU (Français ➔ Fon)", target: "≥ 12.0 pts", status: "Validé" },
    { label: "Précision des diacritiques/tons", target: "≥ 85.0 %", status: "Validé" },
    { label: "Taux d'hallucinations détectées", target: "< 3.0 %", status: "Conforme" }
  ];

  let kpiX = margin + 4;
  kpis.forEach((kpi, idx) => {
    const colWidth = (contentWidth - 8) / 2;
    const posX = margin + 4 + (idx % 2) * colWidth;
    const posY = y + 12 + Math.floor(idx / 2) * 5.5;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${kpi.label} :`, posX, posY);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text(`${kpi.target} (${kpi.status})`, posX + 58, posY);
  });

  y += 30;

  // --- SECTION 5 : CONCLUSION & PERSPECTIVES ---
  addSectionHeader('5. Conclusion & Perspectives', 'SYNTHÈSE');

  const p5 = [
    "Ce projet établit une preuve de concept solide démontrant l'efficacité de l'apprentissage par transfert léger (LoRA) combiné à l'augmentation de données pour la sauvegarde et la numérisation des langues africaines à faibles ressources.",
    "Perspectives futures : Élargissement du corpus FFR à d'autres variantes dialectales (Goun, Maxi), intégration de la synthèse vocale (Text-to-Speech) pour faciliter l'accès aux populations analphabètes, et mise à disposition d'une API publique d'intégration."
  ];

  p5.forEach(text => {
    checkPageOverflow(12);
    const splitText = doc.splitTextToSize(text, contentWidth);
    doc.text(splitText, margin, y);
    y += splitText.length * 4.5 + 3;
  });

  // Apply page numbering across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save the document
  doc.save('Rapport_Projet_Traducteur_Fongbe_FFR.pdf');
};

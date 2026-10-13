/** Distinct, locally hosted editorial card photos for research explainers.
 *
 * These are Pexels editorial metaphors, not scientific data, study participants,
 * diagnostic tests, or substitutes for the correctly credited primary-study
 * images retained inside the articles. Sources: docs/editorial-image-sources.md.
 */
export interface ResearchCardVisual {
  src: string;
  alt: string;
}

const researchCardVisuals: Record<string, ResearchCardVisual> = {
  'kak-menyaetsya-razvitie-autichnyh-lyudey-s-vozrastom': {
    src: 'images/editorial/photos/research-development-life-paths.jpg',
    alt: 'Группа людей разговаривает на мосту: иллюстрация разнообразия жизненных путей, не участники исследования.',
  },
  'pochemu-autizm-u-vseh-proyavlyaetsya-po-raznomu': {
    src: 'images/editorial/photos/research-profiles-diverse-samples.jpg',
    alt: 'Разноцветные пробирки в лаборатории: метафора научного изучения разнообразия, не образцы участников исследования.',
  },
  'autichnym-lyudyam-trudnee-obshchatsya-issledovanie': {
    src: 'images/editorial/photos/research-communication-people-conversing.jpg',
    alt: 'Группа молодых людей общается на открытом воздухе: повседневная коммуникация, без предположений о нейротипе участников.',
  },
  'chto-proishodit-v-mozge-pri-autizme-kletki': {
    src: 'images/editorial/photos/research-brain-cells-microscope.jpg',
    alt: 'Исследователь рассматривает образец в микроскоп: научная иллюстрация изучения клеток, не реальный материал исследования мозга при аутизме.',
  },
  'pochemu-autizm-u-devochek-i-zhenshchin-vyyavlyayut-pozzhe': {
    src: 'images/editorial/photos/research-girls-diagnosis-conversation.jpg',
    alt: 'Женщина-врач беседует с девочкой на приёме: общая медицинская консультация, не диагностика аутизма у ребёнка на фото.',
  },
  'mozhet-li-rannyaya-podderzhka-izmenit-razvitie-rebenka': {
    src: 'images/editorial/photos/research-early-parent-child-play.jpg',
    alt: 'Мать с младенцем играют с деревянными игрушками на полу: пример семейного взаимодействия, не изображение участника клинического исследования.',
  },
  'mozhet-li-otslezhivanie-vzglyada-pomoch-vyyavit-autizm': {
    src: 'images/editorial/photos/research-eye-tracking-closeup-eye.jpg',
    alt: 'Крупный план человеческого глаза: иллюстрация направления взгляда, не оборудование для айтрекинга и не диагностический тест.',
  },
  'geny-i-autizm-102-gena-riska': {
    src: 'images/editorial/photos/research-genetics-lab-pipette.jpg',
    alt: 'Исследователь работает с лабораторными образцами и пипеткой: иллюстрация генетического исследования, не материалы исходной работы.',
  },
  'vyzyvayut-li-privivki-autizm-issledovanie': {
    src: 'images/editorial/photos/research-vaccination-medical-syringe.jpg',
    alt: 'Медработник держит шприц перед вакцинацией: общая иллюстрация прививок, не участники и не препараты изучавшегося исследования.',
  },
  'pochemu-zvuki-svet-i-prikosnoveniya-oshchushchayutsya-inache': {
    src: 'images/editorial/photos/research-sensory-colorful-fidget.jpg',
    alt: 'Разноцветная силиконовая игрушка на крупном плане: предмет с тактильными характеристиками, не измерение сенсорных особенностей человека.',
  },
};

export function getResearchCardVisual(slug: string): ResearchCardVisual | undefined {
  return researchCardVisuals[slug];
}

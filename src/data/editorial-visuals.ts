import type { Section } from '../site.config';

export interface EditorialVisual {
  src: string;
  alt: string;
}

const VISUALS = {
  communication: {
    src: 'images/editorial/technology-tablet.jpg',
    alt: 'Планшет с пустым экраном, блокнот и канцелярские принадлежности на столе.',
  },
  learning: {
    src: 'images/editorial/who-cst-cards-books.jpg',
    alt: 'Иллюстрированные карточки и открытые книги на столе.',
  },
  sensory: {
    src: 'images/editorial/sensory-hands.jpg',
    alt: 'Детские руки исследуют световую поверхность с тактильным материалом.',
  },
  movement: {
    src: 'images/editorial/children-stretching.jpg',
    alt: 'Дети выполняют упражнения на растяжку в помещении.',
  },
  conversation: {
    src: 'images/editorial/psychological-support-room.jpg',
    alt: 'Спокойная комната с креслами для беседы и консультации.',
  },
  reading: {
    src: 'images/editorial/who-cst-cards-books.jpg',
    alt: 'Иллюстрированные карточки и открытые книги на столе.',
  },
  feeding: {
    src: 'images/editorial/family-meal.jpg',
    alt: 'Семья сидит за столом во время совместного приёма пищи.',
  },
  research: {
    src: 'images/editorial/research-lab.jpg',
    alt: 'Исследователь работает за компьютером в лаборатории.',
  },
} satisfies Record<string, EditorialVisual>;

export function getEditorialVisual(
  section: Section,
  topic: string,
  title: string,
): EditorialVisual | undefined {
  const normalized = title.toLocaleLowerCase('ru');

  if (topic === 'feeding-nutrition') return VISUALS.feeding;
  if (section === 'research') return VISUALS.research;

  if (
    /aac|коммуникац|реч|язык|communication/.test(normalized)
  ) {
    return VISUALS.communication;
  }

  if (/сенсор|sensory|тактил/.test(normalized)) {
    return VISUALS.sensory;
  }

  if (
    /физичес|двигател|движен|афк|лфк|упражнен|movement|physical/.test(normalized)
  ) {
    return VISUALS.movement;
  }

  if (
    /оценк|диагност|специалист|психолог|кпт|терап|поддержк/.test(normalized)
  ) {
    return VISUALS.conversation;
  }

  if (
    topic === 'child-development' ||
    topic === 'development-concerns' ||
    /развит|обуч|навык|игр|рисован/.test(normalized)
  ) {
    return VISUALS.learning;
  }

  if (section === 'learning') return VISUALS.reading;
  if (section === 'help-kazakhstan') return VISUALS.conversation;
  if (section === 'professionals') return VISUALS.reading;

  return undefined;
}

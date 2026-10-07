import type { Section } from '../site.config';

export interface EditorialVisual {
  src: string;
  alt: string;
}

const VISUALS = {
  communication: {
    src: 'images/editorial/family-tablet.jpg',
    alt: 'Родители и ребёнок вместе смотрят на экран планшета.',
  },
  learning: {
    src: 'images/editorial/parent-child-drawing.jpg',
    alt: 'Взрослый помогает ребёнку рисовать за столом.',
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
    src: 'images/editorial/parent-child-conversation.jpg',
    alt: 'Родитель и ребёнок разговаривают на скамейке в парке.',
  },
  reading: {
    src: 'images/editorial/family-reading.jpg',
    alt: 'Родители читают книгу вместе с ребёнком.',
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

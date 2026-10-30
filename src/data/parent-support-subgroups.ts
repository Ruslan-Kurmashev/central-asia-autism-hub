// Navigation taxonomy for published parent articles about support.
// The keys are stable translationKey values, not language-specific slugs.
// primaryKeys identify parent-facing core resources. Older duplicate pages are preserved
// via Astro static redirects, not shown as standalone resources.
export const PARENT_SUPPORT_SUBGROUPS = [
  {
    "id": "choosing",
    "label": {
      "ru": "Выбор и оценка помощи",
      "kk": "Қолдауды таңдау және бағалау",
      "en": "Choosing and evaluating support"
    },
    "description": {
      "ru": "С чего начать, как проверить метод и специалиста, как оценивать результаты.",
      "kk": "Неден бастау, әдіс пен маманды қалай тексеру және нәтижені қалай бағалау.",
      "en": "Where to start, how to check methods and professionals, and how to assess outcomes."
    },
    "translationKeys": [
      "parents-types-of-autism-support",
      "parents-choosing-support-by-goal",
      "parents-choosing-autism-support",
      "parents-risky-unproven-autism-methods",
      "parents-monitoring-autism-support",
      "parents-how-to-read-evidence"
    ],
    "primaryKeys": [
      "parents-types-of-autism-support",
      "parents-choosing-support-by-goal",
      "parents-how-to-read-evidence"
    ]
  },
  {
    "id": "communication",
    "label": {
      "ru": "Коммуникация и речь",
      "kk": "Коммуникация және сөйлеу",
      "en": "Communication and language"
    },
    "description": {
      "ru": "Доступное общение, AAC, логопедическая поддержка и функциональная коммуникация.",
      "kk": "Қолжетімді қарым-қатынас, AAC, сөйлеу тіліне қолдау және функционалдық коммуникация.",
      "en": "Accessible communication, AAC, language support and functional communication."
    },
    "translationKeys": [
      "parents-aac",
      "parents-speech-language-therapy",
      "parents-communication-partner-training",
      "parents-pecs",
      "parents-functional-communication-training"
    ],
    "primaryKeys": [
      "parents-aac",
      "parents-speech-language-therapy",
      "parents-pecs",
      "parents-functional-communication-training"
    ]
  },
  {
    "id": "behaviour",
    "label": {
      "ru": "Поведение и обучение",
      "kk": "Мінез-құлық және үйрену",
      "en": "Behaviour and learning"
    },
    "description": {
      "ru": "Понимание причин поведения, адаптация условий и этичные способы обучения.",
      "kk": "Мінез-құлық себептерін түсіну, жағдайды бейімдеу және этикалық оқыту тәсілдері.",
      "en": "Understanding behaviour, adjusting situations and using ethical learning strategies."
    },
    "translationKeys": [
      "parents-behavior-learning",
      "parents-functional-behavior-assessment",
      "parents-reinforcement",
      "parents-differential-reinforcement"
    ],
    "primaryKeys": [
      "parents-behavior-learning",
      "parents-functional-behavior-assessment"
    ]
  },
  {
    "id": "play",
    "label": {
      "ru": "Игра, развитие и взаимодействие",
      "kk": "Ойын, даму және өзара әрекет",
      "en": "Play, development and interaction"
    },
    "description": {
      "ru": "Игра, совместное внимание, обучение в естественных ситуациях и поддержка сверстников.",
      "kk": "Ойын, бірлескен назар, күнделікті жағдайларда үйрену және құрдастар қолдауы.",
      "en": "Play, joint attention, learning in everyday activities and peer support."
    },
    "translationKeys": [
      "parents-development-interaction-play",
      "parents-naturalistic-intervention",
      "parents-ndbi",
      "parents-imitation-reciprocal-imitation",
      "parents-peer-mediated-intervention"
    ],
    "primaryKeys": [
      "parents-development-interaction-play",
      "parents-naturalistic-intervention",
      "parents-ndbi",
      "parents-peer-mediated-intervention"
    ]
  },
  {
    "id": "sensory",
    "label": {
      "ru": "Сенсорная поддержка",
      "kk": "Сенсорлық қолдау",
      "en": "Sensory support"
    },
    "description": {
      "ru": "Адаптация среды, сенсорная перегрузка и оценка отдельных сенсорных подходов.",
      "kk": "Ортаны бейімдеу, сенсорлық шамадан тыс жүктеме және сенсорлық тәсілдерді бағалау.",
      "en": "Environmental adjustments, sensory overload and evaluation of sensory approaches."
    },
    "translationKeys": [
      "parents-sensory-environmental-support",
      "parents-sensory-overload-environmental-adaptations",
      "parents-ayres-sensory-integration",
      "parents-weighted-items"
    ],
    "primaryKeys": [
      "parents-sensory-environmental-support",
      "parents-sensory-overload-environmental-adaptations",
      "parents-ayres-sensory-integration",
      "parents-weighted-items"
    ]
  },
  {
    "id": "daily",
    "label": {
      "ru": "Самостоятельность и повседневные навыки",
      "kk": "Дербестік және күнделікті дағдылар",
      "en": "Independence and everyday skills"
    },
    "description": {
      "ru": "Самообслуживание, бытовые навыки, эрготерапия и способы обучения действиям.",
      "kk": "Өзін-өзі күту, тұрмыстық дағдылар, эрготерапия және іс-әрекеттерді үйрету.",
      "en": "Self-care, daily living skills, occupational therapy and practical teaching strategies."
    },
    "translationKeys": [
      "parents-daily-living-skills-training",
      "parents-occupational-therapy",
      "parents-toileting-interventions",
      "parents-prompting-and-prompt-fading",
      "parents-video-modeling",
      "parents-self-management",
      "parents-special-pedagog-defectologist"
    ],
    "primaryKeys": [
      "parents-daily-living-skills-training",
      "parents-occupational-therapy",
      "parents-toileting-interventions",
      "parents-self-management",
      "parents-special-pedagog-defectologist"
    ]
  },
  {
    "id": "movement",
    "label": {
      "ru": "Движение и физическая активность",
      "kk": "Қозғалыс және дене белсенділігі",
      "en": "Movement and physical activity"
    },
    "description": {
      "ru": "АФК, ЛФК и физическая терапия: разные задачи и критерии выбора.",
      "kk": "Бейімделген дене шынықтыру, емдік жаттығулар және физикалық терапия.",
      "en": "Adapted physical activity, therapeutic exercise and physical therapy."
    },
    "translationKeys": [
      "parents-movement-physical-activity",
      "parents-adaptive-physical-activity",
      "parents-physical-therapy-physiotherapy",
      "parents-therapeutic-exercise-lfk"
    ],
    "primaryKeys": [
      "parents-movement-physical-activity",
      "parents-adaptive-physical-activity",
      "parents-physical-therapy-physiotherapy"
    ]
  },
  {
    "id": "psychological",
    "label": {
      "ru": "Психологическая помощь",
      "kk": "Психологиялық көмек",
      "en": "Psychological support"
    },
    "description": {
      "ru": "Психическое здоровье, КПТ и необходимые адаптации психологической помощи.",
      "kk": "Психикалық денсаулық, когнитивті-мінез-құлық терапиясы және оны бейімдеу.",
      "en": "Mental health, cognitive behavioural therapy and adaptations to care."
    },
    "translationKeys": [
      "parents-psychological-mental-health-support",
      "parents-cognitive-behavioral-therapy"
    ],
    "primaryKeys": [
      "parents-psychological-mental-health-support",
      "parents-cognitive-behavioral-therapy"
    ]
  },
  {
    "id": "family",
    "label": {
      "ru": "Поддержка родителей и семьи",
      "kk": "Ата-аналар мен отбасын қолдау",
      "en": "Support for parents and families"
    },
    "description": {
      "ru": "Благополучие семьи, передышка и программы участия родителей.",
      "kk": "Отбасының әл-ауқаты, уақытша демалыс және ата-аналарға арналған бағдарламалар.",
      "en": "Family wellbeing, respite and parent-involved programmes."
    },
    "translationKeys": [
      "parents-caregiver-wellbeing-support",
      "parents-respite-short-breaks",
      "parents-parent-mediated-intervention",
      "parents-who-caregiver-skills-training",
      "parents-rubi-parent-training"
    ],
    "primaryKeys": [
      "parents-caregiver-wellbeing-support",
      "parents-respite-short-breaks",
      "parents-parent-mediated-intervention",
      "parents-who-caregiver-skills-training",
      "parents-rubi-parent-training"
    ]
  },
  {
    "id": "other",
    "label": {
      "ru": "Дополнительные методы и их ограничения",
      "kk": "Қосымша әдістер және олардың шектеулері",
      "en": "Other approaches and their limitations"
    },
    "description": {
      "ru": "Цифровые, творческие и коммерческие подходы: возможная польза, ограничения и безопасность.",
      "kk": "Цифрлық, шығармашылық және коммерциялық тәсілдер: мүмкін пайдасы, шектеулері және қауіпсіздігі.",
      "en": "Digital, creative and commercial approaches: possible benefits, limitations and safety."
    },
    "translationKeys": [
      "parents-creative-approaches",
      "parents-technology-support",
      "parents-neuropsychological-correction",
      "parents-auditory-integration-listening-programs"
    ],
    "primaryKeys": [
      "parents-creative-approaches",
      "parents-technology-support",
      "parents-neuropsychological-correction",
      "parents-auditory-integration-listening-programs"
    ]
  }
] as const;

const GROUP_BY_TRANSLATION_KEY = new Map<string, string>();
for (const subgroup of PARENT_SUPPORT_SUBGROUPS) {
  for (const key of subgroup.translationKeys) {
    if (GROUP_BY_TRANSLATION_KEY.has(key)) {
      throw new Error('Repeated support article translationKey: ' + key);
    }
    GROUP_BY_TRANSLATION_KEY.set(key, subgroup.id);
  }
}

export function parentSupportGroupForKey(translationKey: string): string | undefined {
  return GROUP_BY_TRANSLATION_KEY.get(translationKey);
}

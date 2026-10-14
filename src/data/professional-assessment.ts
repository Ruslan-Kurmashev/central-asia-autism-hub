import type { Locale } from '../site.config';

type Localized = Record<Locale, string>;
export type AssessmentGroupId = 'early-identification' | 'instruments' | 'comprehensive-assessment' | 'differential-assessment' | 'reporting-followup';
export type DownloadFormat = 'PDF' | 'DOCX' | 'XLSX' | 'CSV';

export interface AssessmentArticle {
  id: string;
  group: AssessmentGroupId;
  translationKey: string;
  title: Localized;
  description: Localized;
}
export interface AssessmentGroup {
  id: AssessmentGroupId;
  title: Localized;
  description: Localized;
  focus: Localized;
}
export interface AssessmentDownload {
  id: string;
  group: AssessmentGroupId;
  title: Localized;
  description: Localized;
  audience: Localized;
  version: string;
  files: Partial<Record<Locale, { format: DownloadFormat; href: string }[]>>;
}

export const assessmentGroups: AssessmentGroup[] = [
  {
    id: 'early-identification',
    title: { ru: 'Раннее выявление и маршрут ребёнка', kk: 'Ерте анықтау және баланы бағыттау', en: 'Early identification and referral' },
    description: { ru: 'Первые опасения, наблюдение за развитием, подходящий скрининг и направления.', kk: 'Алғашқы алаңдаушылық, дамуды бақылау, скрининг және жолдау.', en: 'Developmental concerns, surveillance, screening and referrals.' },
    focus: { ru: 'От наблюдения к понятному следующему действию', kk: 'Бақылаудан нақты келесі әрекетке дейін', en: 'From observations to an actionable next step' },
  },
  {
    id: 'instruments',
    title: { ru: 'Диагностические инструменты', kk: 'Диагностикалық құралдар', en: 'Assessment and diagnostic instruments' },
    description: { ru: 'Для чего служат инструменты, какие нужны условия и где проходят границы тестов.', kk: 'Құралдардың мақсаты, қолдану шарттары және шектеулері.', en: 'What instruments can do, professional requirements and limitations.' },
    focus: { ru: 'Назначение, возраст, язык, подготовка, лицензия', kk: 'Мақсаты, жасы, тілі, дайындығы, лицензиясы', en: 'Purpose, age, language, training and permissions' },
  },
  {
    id: 'comprehensive-assessment',
    title: { ru: 'Комплексная диагностическая оценка', kk: 'Кешенді диагностикалық бағалау', en: 'Comprehensive diagnostic assessment' },
    description: { ru: 'История развития, клиническое наблюдение и интеграция сведений разных специалистов.', kk: 'Даму тарихы, клиникалық бақылау және мамандардың деректері.', en: 'Developmental history, observations and integrated clinical information.' },
    focus: { ru: 'Не диагноз по одному тесту, а полноценная оценка', kk: 'Бір тест емес, толық бағалау', en: 'Clinical evaluation beyond any single test' },
  },
  {
    id: 'differential-assessment',
    title: { ru: 'Дифференциальная диагностика и сопутствующие состояния', kk: 'Ажырату диагностикасы және қатар жүретін жағдайлар', en: 'Differential diagnosis and co-occurring conditions' },
    description: { ru: 'Другие объяснения признаков, вопросы здоровья и показания к оценке.', kk: 'Белгілердің басқа себептері, денсаулық мәселелері және тексеру көрсетілімдері.', en: 'Alternative explanations, health considerations and referral indications.' },
    focus: { ru: 'Не пропустить медицинские причины и сопутствующие потребности', kk: 'Медициналық себептер мен қатар қажеттіліктерді ескеру', en: 'Consider alternative explanations and co-occurring needs' },
  },
  {
    id: 'reporting-followup',
    title: { ru: 'Заключение и дальнейшее наблюдение', kk: 'Қорытынды және кейінгі бақылау', en: 'Reporting and follow-up' },
    description: { ru: 'Понятное заключение, неопределённость результата и план дальнейших действий.', kk: 'Түсінікті қорытынды, белгісіз нәтиже және кейінгі жоспар.', en: 'Clear reporting, diagnostic uncertainty and follow-up plans.' },
    focus: { ru: 'Результат оценки должен приводить к полезному плану', kk: 'Бағалау нәтижесі іс жүзіндегі жоспарға жеткізуі керек', en: 'Translate evaluation findings into an actionable plan' },
  },
];

const article = (id: string, group: AssessmentGroupId, ru: string, kk: string, en: string, descRu: string): AssessmentArticle => ({
  id, group, translationKey: 'professionals-' + id, title: { ru, kk, en },
  description: { ru: descRu, kk: '', en: '' },
});
export const assessmentArticles: AssessmentArticle[] = [
  article('a01', 'early-identification', 'От первых признаков до направления: алгоритм специалиста', 'Алғашқы белгілерден маманға жолдауға дейін', 'From early signs to referral: a professional pathway', 'Поэтапные действия и границы наблюдения, скрининга и направления.'),
  article('a02', 'early-identification', 'Скрининг РАС: выбор, результат и дальнейшие действия', 'Аутизм скринингі: таңдау, нәтиже және келесі қадамдар', 'Autism screening: selection, interpretation and follow-up', 'Подходящий инструмент, ограничения и действия после результатов.'),
  article('a03', 'instruments', 'Как выбрать инструмент оценки: возраст, задача, язык и валидность', 'Бағалау құралын таңдау: жас, міндет, тіл және валидтілік', 'Selecting assessment instruments: age, purpose, language and validity', 'Сопоставление психометрии, назначения, лицензии и подготовки.'),
  article('a04', 'instruments', 'M-CHAT-R/F: применение, Follow-Up и ограничения', 'M-CHAT-R/F: қолдану, Follow-Up және шектеулер', 'M-CHAT-R/F: use, follow-up and limitations', 'Двухэтапная процедура и последующие действия по авторской инструкции.'),
  article('a05', 'instruments', 'ADOS-2, ADI-R и CARS-2: возможности и ограничения', 'ADOS-2, ADI-R және CARS-2: мүмкіндіктері мен шектеулері', 'ADOS-2, ADI-R and CARS-2: scope and limitations', 'Интервью, наблюдение и рейтинговые инструменты не равны диагнозу.'),
  article('a06', 'comprehensive-assessment', 'Сбор анамнеза развития и интервью с семьёй', 'Даму тарихын жинау және отбасымен сұхбат', 'Developmental history and family interview', 'Структура клинического анамнеза без копирования защищённых шкал.'),
  article('a07', 'comprehensive-assessment', 'Структурированное наблюдение в разных ситуациях', 'Әртүрлі жағдайдағы құрылымдалған бақылау', 'Structured observation across settings', 'Наблюдаемые факты, условия, коммуникация и контекст поведения.'),
  article('a08', 'comprehensive-assessment', 'Комплексная клиническая оценка: критерии, специалисты и этапы', 'Кешенді клиникалық бағалау: өлшемдер, мамандар және кезеңдер', 'Comprehensive clinical assessment: criteria, team and stages', 'Как объединять историю развития, наблюдение и медицинские данные.'),
  article('a09', 'differential-assessment', 'РАС и другие состояния: дифференциальная оценка', 'Аутизм және басқа жағдайлар: ажырату бағалауы', 'Autism and other conditions: differential assessment', 'Альтернативные объяснения и сочетание нескольких состояний.'),
  article('a10', 'differential-assessment', 'Сопутствующие состояния и показания к дополнительной оценке', 'Қатар жүретін жағдайлар мен қосымша тексеру көрсетілімдері', 'Co-occurring conditions and additional assessment', 'Слух, зрение, сон, эпилепсия, питание, психическое здоровье.'),
  article('a11', 'reporting-followup', 'Как подготовить диагностическое заключение', 'Диагностикалық қорытындыны қалай дайындау керек', 'Preparing a diagnostic assessment report', 'Основания вывода, сильные стороны, потребности, ограничения и план.'),
  article('a12', 'reporting-followup', 'Диагностическая неопределённость, второе мнение и повторная оценка', 'Диагностикалық белгісіздік, екінші пікір және қайта бағалау', 'Diagnostic uncertainty, second opinions and reassessment', 'Что фиксировать, когда нужны дополнительные данные и как не задерживать поддержку.'),
];

const dl = (id: string, group: AssessmentGroupId, ru: string, kk: string, en: string, description: string, audience: string, files: AssessmentDownload['files'] = {}): AssessmentDownload => ({
  id, group, title: {ru, kk, en},
  description: {ru: description, kk: '', en: ''},
  audience: {ru: audience, kk: '', en: ''}, version: '1.0 · 14.10.2026', files,
});
const prefix='/central-asia-autism-hub/downloads/assessment/';
export const assessmentDownloads: AssessmentDownload[] = [
  dl('pathway','early-identification','Схема раннего выявления и направления','Ерте анықтау және жолдау схемасы','Early detection and referral pathway','Одна схема для печати: от опасений до профессиональной оценки и помощи по потребностям.','Специалисты первичного звена', {ru:[{format:'PDF',href:prefix+'early-detection-pathway-ru.pdf'}]}),
  dl('tool-comparison','instruments','Сравнительная таблица инструментов','Құралдарды салыстыру кестесі','Instrument comparison table','Назначение, возрастные ограничения, лицензии, требования к подготовке, первоисточники.','Врачи и специалисты оценки', {ru:[{format:'PDF',href:prefix+'diagnostic-instrument-comparison-ru.pdf'},{format:'XLSX',href:prefix+'diagnostic-instrument-comparison-ru.xlsx'},{format:'CSV',href:prefix+'diagnostic-instrument-comparison-ru.csv'}]}),
  dl('history','comprehensive-assessment','Редактируемый бланк истории развития','Даму тарихының өңделетін бланкі','Editable developmental history template','Поля для свободного клинического интервью без диагностического балла и чужих тестовых заданий.','Уполномоченные специалисты', {ru:[{format:'DOCX',href:prefix+'developmental-history-template-ru.docx'},{format:'PDF',href:prefix+'developmental-history-template-ru.pdf'}]}),
  dl('preassessment','comprehensive-assessment','Чек-лист подготовки к диагностической оценке','Диагностикалық бағалауға дайындық тізімі','Pre-assessment preparation checklist','Данные, документы, участники и условия обследования.','Команда оценки'),
  dl('observation','comprehensive-assessment','Лист структурированного наблюдения','Құрылымдалған бақылау парағы','Structured observation sheet','Факты, контекст, поддержка коммуникации, условия наблюдения.','Квалифицированные специалисты'),
  dl('differential-map','differential-assessment','Схема дифференциальной оценки','Ажырату бағалауының схемасы','Differential assessment map','Клинические вопросы и возможные направления без самодиагностики.','Врачи'),
  dl('cooccurrence','differential-assessment','Чек-лист сопутствующих состояний','Қатар жүретін жағдайлар тізімі','Co-occurring conditions checklist','Темы для клинического рассмотрения и профильных консультаций.','Врачи'),
  dl('team-discussion','comprehensive-assessment','Шаблон командного обсуждения случая','Командалық талқылау үлгісі','Team case discussion template','Роли, согласованные наблюдения, расхождения и решения.','Междисциплинарная команда'),
  dl('report','reporting-followup','Структура диагностического отчёта','Диагностикалық есеп құрылымы','Diagnostic report outline','Элементы письменного вывода без замены обязательных форм.','Уполномоченные диагностирующие специалисты'),
  dl('reassessment','reporting-followup','План повторной оценки','Қайта бағалау жоспары','Reassessment and follow-up plan','Неопределённость, недостающие данные, ответственность и сроки связи.','Уполномоченные специалисты'),
];

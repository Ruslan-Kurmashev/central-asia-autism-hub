import type { Locale } from '../site.config';
import type { AssessmentGroupId } from './professional-assessment';

/** Links go to original publisher materials, NOT AutismHub-hosted reproductions.
 * A publisher's free public download is not permission to translate, modify,
 * rehost, incorporate into software, or diagnose outside local competence.
 */
type L = Record<Locale,string>;
export interface OfficialAssessmentResource {
  id: string;
  group: AssessmentGroupId;
  title: L;
  description: L;
  provider: string;
  language: string;
  url: string;
  licenseNote: L;
}
export const officialAssessmentResources: OfficialAssessmentResource[] = [
  {
    id:'autism-crc-pathway',group:'comprehensive-assessment',
    title:{ru:'Маршрут оценки и диагностики аутизма: инфографика',kk:'Аутизмді бағалау және диагностикалау жолы: инфографика',en:'Assessment and diagnosis pathway infographic'},
    description:{ru:'Оригинальная схема Autism CRC (Австралия, 2024). Показывает последовательность обращения, оценки потребностей и клинического решения.',kk:'Autism CRC дайындаған бастапқы австралиялық схема (2024). Қазақстанның міндетті алгоритмі емес.',en:'Original Australian Autism CRC pathway (2024), showing referral, needs assessment and diagnostic evaluation.'},
    provider:'Autism CRC (Australia)',language:'EN',url:'https://www.autismcrc.com.au/best-practice/sites/default/files/resources/Assessment_and_diagnosis_pathway_A3_Assessment_and_Diagnosis_Guideline.pdf',
    licenseNote:{ru:'Авторское право Autism CRC, 2024. Ссылка на оригинал; не воспроизводим и не объявляем протоколом Казахстана.',kk:'© Autism CRC, 2024. Тек түпнұсқаға сілтеме; Қазақстанның міндетті хаттамасы емес.',en:'© Autism CRC, 2024. Original publisher-hosted PDF; not a Kazakhstan clinical protocol.'},
  },
  {
    id:'who-icf-checklist',group:'comprehensive-assessment',
    title:{ru:'ICF Checklist: оценка функционирования',kk:'ICF Checklist: функцияларды бағалау',en:'ICF Checklist: functioning and disability'},
    description:{ru:'Официальная клиническая форма ВОЗ (версия 2.1a, 2003). Применяется вместе с МКФ для оценки функционирования; не диагностирует РАС.',kk:'ДДҰ-ның МКФ бойынша бастапқы клиникалық нысаны (2003). Аутизмді диагностикаламайды.',en:'WHO clinical form, version 2.1a (2003), used alongside the ICF. Not an autism diagnostic test.'},
    provider:'World Health Organization',language:'EN',url:'https://www.who.int/publications/m/item/icf-checklist',
    licenseNote:{ru:'© ВОЗ. Официальная страница скачивания; права на копирование и перевод необходимо проверять отдельно.',kk:'© ДДҰ. Жүктеу баспагер сайтында; көшіру және аудару құқықтарын бөлек тексеру керек.',en:'© WHO. Download from the official publisher; check separate reproduction and translation permissions.'},
  },
  {
    id:'cdc-milestones',group:'early-identification',
    title:{ru:'Чек-листы возрастных этапов развития',kk:'Дамудың жас кезеңдері бойынша тексеру парақтары',en:'Developmental milestone checklists'},
    description:{ru:'Бесплатные материалы CDC для наблюдения за развитием детей раннего возраста и обсуждения тревог семьи; не скрининг и не диагностический тест РАС.',kk:'CDC тегін даму кезеңдерінің парақтары. Бақылау мен әңгімеге арналған, РАС диагностикасы емес.',en:'Free CDC checklists for developmental monitoring and conversations with families. Not autism screening or diagnosis.'},
    provider:'CDC Learn the Signs. Act Early.',language:'EN / other listed languages',url:'https://www.cdc.gov/act-early/resources/',
    licenseNote:{ru:'Материалы CDC размещены у издателя; выбирайте оригинальную языковую версию, проверяйте применимость к контексту Казахстана.',kk:'CDC материалдары бастапқы сайтта. Тіл нұсқасы мен Қазақстанға қолданылуын тексеріңіз.',en:'Use source-hosted materials; check available languages and local applicability.'},
  },
  {
    id:'mchat-official',group:'instruments',
    title:{ru:'Оригинальный M-CHAT-R/F и инструкции',kk:'Түпнұсқа M-CHAT-R/F және нұсқаулықтар',en:'Original M-CHAT-R/F and instructions'},
    description:{ru:'Страница правообладателей со скринингом, Follow-Up и правилами использования. Сам тест защищён авторским правом; не равен диагнозу.',kk:'Құқық иелерінің скрининг, Follow-Up және пайдалану ережелері орналасқан беті. Диагноз емес.',en:'Publisher-hosted screening material, Follow-Up and licensing terms. Protected materials; not a diagnosis.'},
    provider:'M-CHAT developers',language:'Various official translations',url:'https://www.mchatscreen.com/mchat-rf/',
    licenseNote:{ru:'Соблюдайте ограничения правообладателей на копирование, адаптацию и цифровое распространение.',kk:'Көшіру, бейімдеу және цифрлық таратудағы құқық иесінің талаптарын сақтаңыз.',en:'Observe publisher terms for copying, adaptation and digital dissemination.'},
  },
];

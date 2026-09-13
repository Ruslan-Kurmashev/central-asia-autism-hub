import type { Locale } from '../site.config';

interface MilestoneExportCopy {
  pdfButton: string;
  pdfHint: string;
  wordButton: string;
  exportHint: string;
  notAnswered: string;
  completedLabel: string;
  filePrefix: string;
}

export const MILESTONE_EXPORT_UI: Record<Locale, MilestoneExportCopy> = {
  ru: {
    pdfButton: 'Сохранить PDF',
    pdfHint: 'Откроется окно печати. Выберите «Сохранить как PDF».',
    wordButton: 'Скачать для Word (.rtf)',
    exportHint: 'В файл попадут ваши отметки и заметки. Данные обрабатываются только в браузере и не отправляются на сервер.',
    notAnswered: 'Не отмечено',
    completedLabel: 'Дата заполнения',
    filePrefix: 'orientiry-razvitiya',
  },
  kk: {
    pdfButton: 'PDF ретінде сақтау',
    pdfHint: 'Басып шығару терезесі ашылады. «PDF ретінде сақтау» тармағын таңдаңыз.',
    wordButton: 'Word үшін жүктеу (.rtf)',
    exportHint: 'Файлға сіздің белгілеріңіз бен жазбаларыңыз енгізіледі. Деректер тек браузерде өңделеді және серверге жіберілмейді.',
    notAnswered: 'Белгіленбеген',
    completedLabel: 'Толтырылған күні',
    filePrefix: 'damu-kezenderi',
  },
  en: {
    pdfButton: 'Save as PDF',
    pdfHint: 'The print dialog will open. Choose “Save as PDF”.',
    wordButton: 'Download for Word (.rtf)',
    exportHint: 'The file will include your selections and notes. The data are processed only in your browser and are not sent to the server.',
    notAnswered: 'Not answered',
    completedLabel: 'Date completed',
    filePrefix: 'developmental-milestones',
  },
};

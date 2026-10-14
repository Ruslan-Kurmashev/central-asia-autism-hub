# AutismHub: происхождение и границы практических инструментов диагностики

**Дата аудита:** 14 октября 2026 года. **Версия:** 1.0.

## Принцип выбора

Мы предпочитаем существующий качественный оригинал от официального правообладателя, когда он доступен и подходит по назначению. Это **не означает** право повторно размещать документ, переводить, менять пороги тестов или называть зарубежную процедуру протоколом Казахстана. Для скачивания чужих материалов используются **прямые ссылки на сайты первоисточников**.

Когда нужного свободного и пригодного профессионального бланка нет, AutismHub разрабатывает собственный **невалидированный, безбалльный рабочий шаблон**, а не неофициальную копию теста. Шаблоны не содержат данных пациентов. Заполненные бланки хранят только в разрешённых системах организаций.

## Оригинальные авторские ресурсы AutismHub

| Набор | Файлы, форматы | Клиническая основа и границы |
| --- | --- | --- |
| Маршрут раннего выявления | `early-detection-pathway-ru.pdf` | AutismHub; принципы NICE CG128 / CPS; не национальный протокол |
| Сравнение инструментов | `diagnostic-instrument-comparison-ru.pdf`, `.xlsx`, `.csv` | AutismHub; оригинальные описательные категории, без тестовых заданий и порогов |
| История развития | `developmental-history-template-ru.docx`, `.pdf` | AutismHub; не ADI-R и не диагностическая шкала |
| Подготовка к оценке | `preassessment-checklist-ru.pdf`, `.docx` | AutismHub; организационный чек-лист, без медицинского назначения |
| Структурированное наблюдение | `structured-observation-ru.pdf`, `.docx` | AutismHub; NICE CG128, CPS; не ADOS-2 |
| Карта дифференциальной оценки | `differential-assessment-map-ru.pdf`, `.docx` | AutismHub; NICE CG128, CPS; не медицинский алгоритм для самодиагностики |
| Чек-лист сопутствующих состояний | `cooccurring-conditions-checklist-ru.pdf`, `.docx`, `cooccurring-conditions-sleep-log-ru.csv` | AutismHub; NICE CG170; CSV является чистым 14-дневным дневником, не медицинской шкалой |
| Командное обсуждение | `multidisciplinary-team-meeting-ru.pdf`, `.docx` | AutismHub; протокол источников и решений, не заключение команды о диагнозе |
| Структура диагностического отчёта | `diagnostic-report-outline-ru.pdf`, `.docx` | AutismHub; NICE CG128, CPS; не обязательный бланк Казахстана |
| План повторной оценки | `reassessment-action-plan-ru.pdf`, `.docx` | AutismHub; документирование неопределённости и нового вопроса, без универсального срока |

Всего: **10 авторских наборов, 21 файл**, среди них PDF, DOCX, XLSX и CSV. Шесть последних наборов воспроизводимо создаются из `scripts/assessment-practical-tool-specs.json` через `scripts/build-professional-assessment-toolkit-v2.py`. Старые четыре набора создаются через `scripts/build-professional-assessment-downloads.py`. Файлы формируются до сборки Astro на GitHub Actions.

## Чужие инструменты, оставленные на сайтах правообладателей

| Организация | Оригинал | Основание выбора | Ограничение / решение |
| --- | --- | --- | --- |
| Autism CRC (2024) | https://www.autismcrc.com.au/best-practice/sites/default/files/resources/Assessment_and_diagnosis_pathway_A3_Assessment_and_Diagnosis_Guideline.pdf | Готовая инфографика к австралийскому руководству по диагностике 2023 года | © Autism CRC 2024; ссылка без хостинга или переработки; австралийский маршрут не является клиническим протоколом Казахстана |
| World Health Organization (2003) | https://www.who.int/publications/m/item/icf-checklist | ICF Checklist v2.1a: клинические категории функционирования и участия | © WHO; не тест на РАС; использовать вместе с МКФ; размещена ссылка на оригинал, не копия и не перевод |
| CDC Learn the Signs. Act Early. | https://www.cdc.gov/act-early/resources/ | Бесплатные чек-листы развития и коммуникационные материалы | Не диагностический тест на РАС; доступны разные языки; оригинал размещён у CDC |
| M-CHAT-R/F | https://www.mchatscreen.com/mchat-rf/ | Официальные формы, Follow-Up и инструкция правообладателей | Авторские ограничения на изменение, тиражирование, перевод и цифровую публикацию; не воспроизводится на AutismHub |

Источники:
- NICE CG128: https://www.nice.org.uk/guidance/cg128/chapter/Recommendations
- NICE CG170: https://www.nice.org.uk/guidance/cg170/chapter/recommendations
- CPS diagnostic assessment: https://cps.ca/en/documents/position/asd-diagnostic-assessment
- WHO: https://www.who.int/publications/m/item/icf-checklist
- Autism CRC: https://www.autismcrc.com.au/best-practice/assessment-and-diagnosis/second-edition
- Закон РК о персональных данных: https://adilet.zan.kz/rus/docs/Z1300000094

## QA и обновление

При редактировании сначала проверить: доступность оригинального URL, обновления правообладателя, право использования, соответствие клинической цели, язык и доказательства валидности. Не считать бесплатный просмотр разрешением на копирование. Изменения для PDF и DOCX редактировать в спецификациях, а не вручную в готовом файле. Все русские файлы на сайтах kk/en намеренно помечаются как непереведённые и не подменяют локализованные ресурсы.

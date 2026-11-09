# Аудит наличия обложек: восемь статей «Помощь в Казахстане»

Дата: 9 ноября 2026 года. Проверка всех восьми материалов KZ-HLP-001–008 и их RU/KK/EN метаданных.

## Найденная системная ошибка

У статей KZ-HLP-001–006 изображения были указаны в `featuredImage` и зарегистрированы в `docs/editorial-image-sources.md`, но сами JPEG-файлы отсутствовали в `public/images/editorial/photos` в исходном `main`. Существующий `check:kz-help-editorial` сравнивал адреса изображений в HTML, но не проверял существование файлов. Изображения KZ-HLP-007–008 уже были восстановлены в предыдущих PR.

## Восстановление оригинальных зарегистрированных фото

| Материал | Автор и источник | Размер оригинала, загруженного в PR |
| --- | --- | ---: |
| KZ-HLP-001 | [Ron Lach, Pexels 10341112](https://www.pexels.com/photo/close-up-view-of-planner-on-desk-10341112/) | 217769 байт |
| KZ-HLP-002 | [Tara Winstead, Pexels 6692939](https://www.pexels.com/photo/wooden-toys-on-the-corner-of-the-bedroom-6692939/) | 83447 байт |
| KZ-HLP-003 | [Markus Winkler, Pexels 4101416](https://www.pexels.com/photo/an-application-paper-on-a-clipboard-beside-pen-and-laptop-4101416/) | 87599 байт |
| KZ-HLP-004 | [Leeloo The First, Pexels 8970647](https://www.pexels.com/photo/documents-on-desk-by-laptop-8970647/) | 137691 байт |
| KZ-HLP-005 | [Mikhail Nilov, Pexels 8923952](https://www.pexels.com/photo/educational-toys-on-shelves-8923952/) | 163786 байт |
| KZ-HLP-006 | [Katerina Holmes, Pexels 5905445](https://www.pexels.com/photo/school-bench-with-stationery-in-classroom-5905445/) | 90542 байт |

Файлы загружены непосредственно из URL Pexels `images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg`, проверены по JPEG MIME и размеру перед фиксацией в ветке. Временный workflow удаления файлов после не оставил, он удалил только самого себя. Авторство, `featuredImage`, `featuredImageAlt`, оригинальные даты публикации и маршруты не изменены. Не создавались AI-изображения или новые художественные интерпретации.

## Защита от повторения

Скрипт `scripts/check-kz-help-editorial.mjs` дополнен проверкой реального наличия и JPEG-сигнатуры файла на диске, не только соответствия `src` в HTML. Проверка применяется ко всем опубликованным RU/KK/EN материалам раздела и должна проваливаться при исчезновении обложки.

## Граница подтверждения

Наличие бинарного файла, JPEG-подпись и успешный CI не удостоверяют точность визуальной композиции исходного референса. Окончательная проверка публичного изображения должна следовать после успешного GitHub Pages Deploy. Внешняя независимая редакционная/юридическая рецензия этим изменением не заявляется.

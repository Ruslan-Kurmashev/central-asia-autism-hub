import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import remarkRemoveInlineStrong from '../src/lib/remark-remove-inline-strong.mjs';

const text = (value) => ({ type: 'text', value });
const strong = (value) => ({ type: 'strong', children: [text(value)] });
const paragraph = (label, detail) => ({
  type: 'paragraph',
  children: detail === undefined ? [text(label)] : [strong(label), text(detail)],
});

const example = {
  type: 'root',
  children: [
    paragraph('Помимо устной речи используются разные средства.'),
    paragraph('Жесты и движения.', ' Указание, кивок и индивидуальные знаки.'),
    paragraph('Изображения и символы.', ' Карточки, таблицы, пиктограммы.'),
    paragraph('Письмо и набор текста.', ' Сообщения на устройствах.'),
    paragraph('Альтернативная и дополнительная коммуникация (AAC).', ' Средства общения.'),
    paragraph('Не существует одной подходящей всем системы.'),
    paragraph('Обычное выделенное утверждение.', ' Вне перечисления.'),
    { type: 'paragraph', children: [text('Важен '), strong('контекст'), text(' общения.')] },
    { type: 'paragraph', children: [strong('Что важно различать:'), text(' Пример с пояснением.')] },
    { type: 'list', children: [
      { type: 'listItem', children: [paragraph('Устойчивые интересы', ' отражают личные предпочтения.')] },
      { type: 'listItem', children: [{ type: 'paragraph', children: [strong('Только название')] }] },
    ] },
    { type: 'table', children: [{ type: 'tableRow', children: [
      { type: 'tableCell', children: [strong('Коммуникация')] },
      { type: 'tableCell', children: [strong('Это обычный текст')] },
    ] }] },
  ],
};

remarkRemoveInlineStrong()(example);
for (const i of [1, 2, 3, 4, 8]) {
  assert.equal(example.children[i].children[0].type, 'strong',
    `Lead-in label not preserved at ${i}`);
}
assert.equal(example.children[6].children[0].type, 'text',
  'Isolated emphasis must be plain text');
assert.equal(example.children[7].children[1].type, 'text',
  'Mid-sentence emphasis must be plain text');
assert.equal(example.children[9].children[0].children[0].children[0].type, 'strong',
  'List label not preserved');
assert.equal(example.children[9].children[1].children[0].children[0].type, 'strong',
  'Standalone list label not preserved');
assert.equal(example.children[10].children[0].children[0].children[0].type, 'strong',
  'Table term not preserved');
assert.equal(example.children[10].children[0].children[1].children[0].type, 'text',
  'Table detail wrongly emphasized');

const css = readFileSync('src/styles/article-v2.css', 'utf8');
assert.match(css, /\.article-v2__body :is\(p, li, td\) > strong:first-child\s*\{\s*font-weight:\s*700\s*;/,
  'Semantic labels must render with bold type');
const exampleSource = readFileSync('src/content/pages/kz/ru/kak-autichnye-deti-obshchayutsya.md', 'utf8');
assert.ok(exampleSource.includes('**Жесты и движения.**'),
  'The parent-communication example labels must stay in Markdown');
console.log('Article label-emphasis checks passed for grouped paragraphs, lists, tables, CSS and content.');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import remarkRemoveInlineStrong from '../src/lib/remark-remove-inline-strong.mjs';

const text = value => ({ type: 'text', value });
const strong = value => ({ type: 'strong', children: [text(value)] });
const paragraph = (label, detail) => ({
  type: 'paragraph',
  children: detail === undefined ? [text(label)] : [strong(label), text(detail)],
});
const emphasis = nodes => ({ type: 'paragraph', children: nodes });
const example = {
  type: 'root',
  children: [
    paragraph('Помимо устной речи используются разные средства.'),
    paragraph('Жесты и движения.', ' Указание, кивок и индивидуальные знаки.'),
    paragraph('Изображения и символы.', ' Карточки, таблицы и фотографии.'),
    paragraph('Письмо и набор текста.', ' Сообщения на устройствах.'),
    paragraph('Альтернативная и дополнительная коммуникация (AAC).', ' Средства общения.'),
    paragraph('Не существует одной подходящей всем системы.'),
    paragraph('Обычное утверждение нельзя выделять целиком ради визуального акцента в статье.', ' Это длинная фраза вне перечня.'),
    emphasis([text('Важен '), strong('контекст'), text(' общения.')]),
    paragraph('Что важно различать:', ' Пример с пояснением.'),
    paragraph('Эхолалия', ' - повторение услышанных слов и фраз.'),
    { type: 'paragraph', children: [
      strong('Стимминг'), text(' (англ. stimming) - повторяющиеся движения.')
    ] },
    paragraph('Саморегуляция', ' означает способность адаптироваться.'),
    paragraph('Совместная регуляция', ' помогает ребёнку справляться с нагрузкой.'),
    paragraph('Entire claim that should not be bold.', ' This is an unsupported emphasis.'),
    { type: 'list', children: [
      { type: 'listItem', children: [paragraph('Устойчивые интересы', ' отражают предпочтения.')] },
      { type: 'listItem', children: [{ type: 'paragraph', children: [strong('Только название')] }] },
    ] },
    { type: 'table', children: [{ type: 'tableRow', children: [
      { type: 'tableCell', children: [strong('Коммуникация')] },
      { type: 'tableCell', children: [strong('Детали')] },
    ] }] },
    { type: 'blockquote', children: [{ type: 'paragraph', children: [strong('«перерыв»')] }] },
  ],
};

remarkRemoveInlineStrong()(example);
const annotated = child => {
  assert.equal(child.type, 'strong', 'Expected a retained label');
  assert.ok(child.data?.hProperties?.className?.includes('article-key-label'), 'Expected semantic label class');
};
for (const i of [1, 2, 3, 4, 8, 9, 10, 11, 12]) annotated(example.children[i].children[0]);
assert.equal(example.children[6].children[0].type, 'text', 'Isolated sentence should be plain');
assert.equal(example.children[7].children[1].type, 'text', 'Mid-sentence bold should be plain');
assert.equal(example.children[13].children[0].type, 'text', 'Full isolated claim should be plain');
annotated(example.children[14].children[0].children[0].children[0]);
annotated(example.children[14].children[1].children[0].children[0]);
annotated(example.children[15].children[0].children[0].children[0]);
assert.equal(example.children[15].children[0].children[1].children[0].type, 'text', 'Only first-column terms should be bold');
annotated(example.children[16].children[0].children[0]);

const css = readFileSync('src/styles/article-v2.css', 'utf8');
assert.match(css, /\.article-v2__body :is\(p, li, blockquote, td, dd\) strong\.article-key-label\s*\{\s*font-weight:\s*700\s*;/);
assert.ok(!css.includes('> strong:first-child {'), 'Unreviewed HTML cannot acquire automatic bold styling');

const examples = [
  'src/content/pages/kz/ru/kak-autichnye-deti-obshchayutsya.md',
  'src/content/pages/kz/ru/stimming-i-povtoryayushchiesya-deystviya-pri-autizme.md',
  'src/content/pages/kz/ru/child-emotion-regulation-support-at-home.md',
];
for (const file of examples) {
  const source = readFileSync(file, 'utf8');
  assert.ok(source.includes('publishedAt:'), file + ': original publication date missing');
}
assert.ok(readFileSync(examples[0], 'utf8').includes('**Жесты и движения.**'));
assert.ok(readFileSync(examples[1], 'utf8').includes('**Стимминг**'));
assert.ok(readFileSync(examples[2], 'utf8').includes('**Саморегуляция**'));
console.log('Semantic emphasis checks passed for grouped examples, terms, labelled lists, tables and non-decorative formatting.');

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const directory = path.join(process.cwd(), 'src', 'content', 'research');
const errors = [];
let published = 0;
let headingsChecked = 0;

function field(frontmatter, key) {
  const row = frontmatter.match(new RegExp('^' + key + ':[ \t]*(.*)$', 'm'));
  return row?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
}

for (const name of await readdir(directory)) {
  if (!/\.(md|mdx)$/.test(name)) continue;

  const markdown = await readFile(path.join(directory, name), 'utf8');
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    errors.push(name + ': invalid frontmatter');
    continue;
  }

  const [, header, body] = match;
  if (field(header, 'draft') !== 'false') continue;
  published += 1;

  if (field(header, 'section') !== 'research' || field(header, 'language') !== 'ru') {
    errors.push(name + ': published research entry has unexpected section or language');
  }

  // ArticleLayout renders the only H1. Published research prose begins at H2.
  // Exclude fenced code blocks from semantic heading checks.
  let codeFence = null;
  const headings = [];
  for (const [index, line] of body.split(/\r?\n/).entries()) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!codeFence) codeFence = fence[1][0];
      else if (codeFence === fence[1][0]) codeFence = null;
      continue;
    }
    if (codeFence) continue;
    const heading = line.match(/^ {0,3}(#{1,6})[ \t]+(.+?)\s*$/);
    if (heading) headings.push({ level: heading[1].length, text: heading[2], line: index + 1 });
  }
  if (!headings.length || headings[0].level !== 2) {
    errors.push(name + ': article body must use semantic H2 sections');
  }
  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];
    headingsChecked++;
    if (current.level === 1) errors.push(name + ':' + current.line + ': duplicate H1 in article body');
    if (i && current.level > headings[i - 1].level + 1) {
      errors.push(name + ':' + current.line + ': skipped H' + headings[i - 1].level + ' to H' + current.level);
    }
  }
  if (!headings.length || headings[headings.length - 1].text !== 'Оригинальное научное исследование') {
    errors.push(name + ': original scientific study must be the final section heading');
  }
  if (/<(?:h1|font)\b/i.test(body) || /font-(?:size|family)\s*:/i.test(body)) {
    errors.push(name + ': inline or duplicated heading typography is not allowed');
  }

  for (const key of [
    'title', 'slug', 'featuredImage', 'featuredImageAlt',
    'featuredImageCredit', 'featuredImageSourceUrl', 'featuredImageLicenseUrl',
    'originalTitle', 'journalOrOrganisation', 'publicationYear',
    'doi', 'sourceUrl', 'sourceStatusCheckedAt', 'publishedAt', 'updatedAt',
  ]) {
    if (!field(header, key)) errors.push(name + ': missing ' + key);
  }

  const doi = field(header, 'doi');
  if (!body.includes('https://doi.org/' + doi)) {
    errors.push(name + ': original DOI link missing from article body');
  }

  if (!body.includes(field(header, 'sourceUrl'))) {
    errors.push(name + ': original source link missing from article body');
  }

  if (!body.includes('## Оригинальное научное исследование')) {
    errors.push(name + ': final primary-study reference missing');
  }

  if (!/\*Материал .*не (?:предназначен|заменяет)/i.test(body)) {
    errors.push(name + ': research explainer boundary notice missing');
  }

  if (/\u2014/.test(markdown)) errors.push(name + ': forbidden em dash');

  const image = field(header, 'featuredImage');
  const credit = field(header, 'featuredImageCredit');
  const license = field(header, 'featuredImageLicenseUrl');
  const source = field(header, 'featuredImageSourceUrl');

  try {
    const url = new URL(image);
    const sourceUrl = new URL(source);
    const licenseUrl = new URL(license);

    if (url.protocol !== 'https:' || sourceUrl.protocol !== 'https:') {
      errors.push(name + ': image and attribution links require HTTPS');
    }
    if (licenseUrl.hostname !== 'creativecommons.org') {
      errors.push(name + ': missing independently identifiable Creative Commons rights link');
    }
    if (!/без изменений|не изменено/i.test(credit)) {
      errors.push(name + ': image attribution must disclose whether image changed');
    }

    if (url.hostname === 'upload.wikimedia.org') {
      if (sourceUrl.hostname !== 'commons.wikimedia.org') {
        errors.push(name + ': Wikimedia photo must link to Wikimedia file page');
      }

      const segments = url.pathname.split('/').filter(Boolean);
      const commonsIndex = segments.indexOf('commons');
      const parts = segments.slice(commonsIndex + 1).filter((part) => part !== 'thumb');
      if (commonsIndex < 0 || parts.length < 3) {
        errors.push(name + ': unsupported Wikimedia path');
      } else {
        const [folder1, folder2, encodedName] = parts;
        const filename = decodeURIComponent(encodedName);
        const digest = createHash('md5').update(filename).digest('hex');
        if (folder1 !== digest.slice(0, 1) || folder2 !== digest.slice(0, 2)) {
          errors.push(name + ': Wikimedia photo path does not match file-title hash');
        }
        if (!decodeURIComponent(sourceUrl.pathname).endsWith('File:' + filename)) {
          errors.push(name + ': Wikimedia source page does not match featured image');
        }
      }
    } else if (url.hostname === 'media.springernature.com') {
      if (sourceUrl.hostname !== 'www.nature.com') {
        errors.push(name + ': Nature figure must link to its original figure page');
      }
      if (!image.includes(encodeURIComponent(doi)) && !image.includes(doi.replace('/', '%2F'))) {
        errors.push(name + ': Nature figure filename does not match source DOI');
      }
    } else {
      errors.push(name + ': unreviewed image host ' + url.hostname);
    }
  } catch (error) {
    errors.push(name + ': malformed image metadata (' + error.message + ')');
  }
}

if (published < 10) {
  errors.push('Expected at least 10 published research explainers; found ' + published);
}

if (errors.length > 0) {
  for (const item of errors) console.error(item);
  process.exitCode = 1;
} else {
  console.log('Research editorial QA passed: ' + published + ' published articles, ' + headingsChecked + ' semantic headings, with primary sources and image metadata.');
}

import { spawn } from 'node:child_process';
import { mkdir, cp } from 'node:fs/promises';
import { chromium } from 'playwright';

const siteBase = '/central-asia-autism-hub';
const slug = 'pochemu-autizm-u-vseh-proyavlyaetsya-po-raznomu';
const reportPath = `${siteBase}/kz/ru/research/${slug}/`;
const root = 'qa-public';
const widths = [
  { width: 1440, height: 900, label: 'desktop' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 390, height: 844, label: 'mobile' },
  { width: 320, height: 720, label: 'small-mobile' },
];

await mkdir(`${root}${siteBase}`, { recursive: true });
await mkdir('qa-screenshots', { recursive: true });
await cp('dist', `${root}${siteBase}`, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
const checks = [];
let browser;
try {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:4173${reportPath}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      break;
    } catch (error) {
      if (attempt === 29) throw error;
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  browser = await chromium.launch({ headless: true });
  for (const viewport of widths) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1')) {
        errors.push(`HTTP ${response.status()} on ${response.url()}`);
      }
    });
    await page.goto(`http://127.0.0.1:4173${reportPath}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `qa-screenshots/research-${viewport.label}.png`, fullPage: true });
    await page.screenshot({ path: `qa-screenshots/research-${viewport.label}-viewport.png` });
    const metrics = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel);
      const r = (sel) => q(sel)?.getBoundingClientRect();
      const luminance = (rgb) => {
        const values = (rgb.match(/[\\d.]+/g) ?? []).slice(0, 3).map(Number);
        if (values.length !== 3) return 0;
        const linear = values.map((value) => {
          const v = value / 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
      };
      const contrastOnWhite = (sel) => {
        const x = q(sel);
        return x ? Number((1.05 / (luminance(getComputedStyle(x).color) + 0.05)).toFixed(2)) : null;
      };
      const style = (sel) => {
        const x = q(sel);
        if (!x) return null;
        const s = getComputedStyle(x);
        return { fontSize: parseFloat(s.fontSize), lineHeight: parseFloat(s.lineHeight), color: s.color, background: s.backgroundColor };
      };
      const ids = new Set([...document.querySelectorAll('[id]')].map((e) => e.id));
      const tocLinks = [...document.querySelectorAll('.article-v2__toc a[href^="#"]')];
      return {
        title: q('h1')?.textContent?.trim() ?? '',
        hasMain: Boolean(q('main')),
        hasPaper: Boolean(q('.article-v2__research-facts')),
        hasArticle: Boolean(q('.article-v2__body')),
        researchExpanded: Boolean(q('.article-v2__research-facts')?.open),
        tocExpanded: Boolean(q('.article-v2__toc')?.open),
        keyPointsTop: r('.article-v2__key-points')?.top,
        firstParagraphTop: r('.article-v2__body p')?.top,
        sourceLink: q('.article-v2__research-facts a[href*="pmc.ncbi.nlm.nih.gov"]')?.getAttribute('href'),
        doiLink: q('.article-v2__research-facts a[href*="doi.org"]')?.getAttribute('href'),
        heading: style('h1'),
        text: style('.article-v2__body p'),
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        titleRight: r('h1')?.right,
        textRight: r('.article-v2__body')?.right,
        navigationRight: r('.site-header')?.right,
        headerHeight: r('.site-header')?.height,
        tocCount: tocLinks.length,
        brokenToc: tocLinks.filter((a) => !ids.has(decodeURIComponent(a.getAttribute('href').slice(1)))).map((a) => a.getAttribute('href')),
        sourceLinksCount: document.querySelectorAll('.article-v2__sources a[href^="https://"]').length,
        tocLinkContrast: contrastOnWhite('.article-v2__toc a'),
        mutedLabelContrast: contrastOnWhite('.article-v2__sources-heading > p:last-child'),
        cssFiles: [...document.styleSheets].length,
      };
    });
    const issues = [];
    if (!metrics.hasMain || !metrics.hasPaper || !metrics.hasArticle) issues.push('Missing document structure');
    if (!metrics.title.includes('Почему аутизм у всех проявляется')) issues.push('Wrong title');
    if (!metrics.sourceLink?.includes('PMC12283356')) issues.push('Missing primary source URL');
    if (!metrics.doiLink?.includes('s41588-025-02224-z')) issues.push('Missing DOI URL');
    if (metrics.documentWidth > viewport.width + 2 || metrics.bodyWidth > viewport.width + 2) issues.push('Horizontal overflow');
    if (metrics.titleRight > viewport.width + 2 || metrics.textRight > viewport.width + 2) issues.push('Clipped heading or content');
    if ((metrics.text?.fontSize ?? 0) < 16 || (metrics.text?.lineHeight ?? 0) < 23) issues.push('Uncomfortable article typography');
    if ((metrics.heading?.fontSize ?? 0) < 28) issues.push('Title too small');
    if (metrics.tocCount < 7 || metrics.brokenToc.length) issues.push('Broken table of contents');
    if (viewport.width <= 768) {
      if (metrics.researchExpanded || metrics.tocExpanded) issues.push('Mobile disclosure should default to collapsed');
      if ((metrics.keyPointsTop ?? Infinity) > 1400) issues.push('Article key points begin too far below the fold');
    } else {
      if (!metrics.researchExpanded || !metrics.tocExpanded) issues.push('Desktop reference information should remain visible');
    }
    if (metrics.sourceLinksCount < 1) issues.push('Missing source links');
    if ((metrics.tocLinkContrast ?? 0) < 4.5 || (metrics.mutedLabelContrast ?? 0) < 4.5) {
      issues.push('Muted text does not meet WCAG AA contrast ratio');
    }
    if (errors.length) issues.push('Browser or network errors');
    const result = { viewport: viewport.label, width: viewport.width, metrics, errors, issues };
    checks.push(result);
    console.log(`VISUAL_QA ${JSON.stringify(result)}`);
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
const failures = checks.filter((c) => c.issues.length);
console.log(`VISUAL_QA_SUMMARY ${JSON.stringify({ viewports: checks.length, failed: failures.length, artifacts: 'qa-screenshots/*.png' })}`);
if (failures.length) process.exitCode = 1;

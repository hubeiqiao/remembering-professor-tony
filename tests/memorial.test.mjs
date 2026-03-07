import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = '/Users/joehu/Final Project_Local/Professor Tony';
const siteDir = path.join(rootDir, 'site');
const htmlPath = path.join(siteDir, 'index.html');
const cssPath = path.join(siteDir, 'styles.css');
const jsPath = path.join(siteDir, 'script.js');
const shareCardPath = path.join(siteDir, 'share-card.html');
const robotsPath = path.join(siteDir, 'robots.txt');
const sitemapPath = path.join(siteDir, 'sitemap.xml');
const llmsPath = path.join(siteDir, 'llms.txt');
const llmsFullPath = path.join(siteDir, 'llms-full.txt');
const assetsIgnorePath = path.join(siteDir, '.assetsignore');
const summaryPath = path.join(siteDir, 'summary', 'index.html');
const faqPath = path.join(siteDir, 'faq', 'index.html');
const sourcesPath = path.join(siteDir, 'sources', 'index.html');
const aboutPath = path.join(siteDir, 'about', 'index.html');
const privacyPath = path.join(siteDir, 'privacy', 'index.html');
const contactPath = path.join(siteDir, 'contact', 'index.html');
const readmePath = path.join(rootDir, 'README.md');
const memorialDraftPath = path.join(rootDir, 'how-professor-tony-encouraged-me.md');
const assetsDir = path.join(siteDir, 'assets');
const gaMeasurementId = 'G-E2KZJJP1BP';

const publicUrl = 'https://tony.hubeiqiao.com/';
const ogImageUrl = `${publicUrl}assets/social/og-image.jpg`;

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('site scaffold and memorial assets exist', () => {
  assert.ok(fs.existsSync(htmlPath), 'expected site/index.html to exist');
  assert.ok(fs.existsSync(cssPath), 'expected site/styles.css to exist');
  assert.ok(fs.existsSync(jsPath), 'expected site/script.js to exist');
  assert.ok(fs.existsSync(shareCardPath), 'expected site/share-card.html to exist');
  assert.ok(fs.existsSync(robotsPath), 'expected site/robots.txt to exist');
  assert.ok(fs.existsSync(sitemapPath), 'expected site/sitemap.xml to exist');
  assert.ok(fs.existsSync(llmsPath), 'expected site/llms.txt to exist');
  assert.ok(fs.existsSync(llmsFullPath), 'expected site/llms-full.txt to exist');
  assert.ok(fs.existsSync(assetsIgnorePath), 'expected site/.assetsignore to exist');
  assert.ok(fs.existsSync(summaryPath), 'expected site/summary/index.html to exist');
  assert.ok(fs.existsSync(faqPath), 'expected site/faq/index.html to exist');
  assert.ok(fs.existsSync(sourcesPath), 'expected site/sources/index.html to exist');
  assert.ok(fs.existsSync(aboutPath), 'expected site/about/index.html to exist');
  assert.ok(fs.existsSync(privacyPath), 'expected site/privacy/index.html to exist');
  assert.ok(fs.existsSync(contactPath), 'expected site/contact/index.html to exist');
  assert.ok(fs.existsSync(memorialDraftPath), 'expected memorial draft markdown to exist');
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'social', 'og-image.jpg')),
    'expected jpeg og image export to exist',
  );
});

test('workers assets ignore local Remotion exports that exceed Cloudflare size limits', () => {
  const assetsIgnore = read(assetsIgnorePath);

  assert.match(
    assetsIgnore,
    /^assets\/video\/professor-tony-site-walkthrough-16x9\.mp4$/m,
  );
  assert.match(
    assetsIgnore,
    /^assets\/video\/professor-tony-site-walkthrough-9x16\.mp4$/m,
  );
});

test('crawler and AI discovery files expose the memorial and stay broadly open', () => {
  const robots = read(robotsPath);
  const sitemap = read(sitemapPath);
  const llms = read(llmsPath);
  const llmsFull = read(llmsFullPath);

  assert.match(robots, /^User-agent:\s*\*/im);
  assert.match(robots, /^Allow:\s*\/$/im);
  assert.match(robots, /^User-agent:\s*OAI-SearchBot$/im);
  assert.match(robots, /^User-agent:\s*GPTBot$/im);
  assert.match(robots, /^Sitemap:\s*https:\/\/tony\.hubeiqiao\.com\/sitemap\.xml$/im);
  assert.doesNotMatch(robots, /^Disallow:\s*\/$/im);

  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/summary\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/faq\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/sources\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/about\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/privacy\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/tony\.hubeiqiao\.com\/contact\/<\/loc>/i);
  assert.doesNotMatch(sitemap, /share-card\.html/i);

  assert.match(llms, /^# Remembering Professor Tony$/m);
  assert.match(llms, /https:\/\/tony\.hubeiqiao\.com\/summary\//i);
  assert.match(llms, /https:\/\/tony\.hubeiqiao\.com\/faq\//i);
  assert.match(llms, /https:\/\/tony\.hubeiqiao\.com\/sources\//i);

  assert.match(llmsFull, /^# Remembering Professor Tony$/m);
  assert.match(llmsFull, /A public memorial from Joe Hu/i);
  assert.match(llmsFull, /Public-safe sources only/i);
  assert.match(llmsFull, /https:\/\/tony\.hubeiqiao\.com\/\s*$/i);
});

test('memorial draft stays publishable and avoids internal notes or product promotion', () => {
  const draft = read(memorialDraftPath);

  assert.match(draft, /^# Remembering Professor Tony: The Story of How He Changed Me/m);
  assert.match(draft, /Thank you, Professor Tony\./);
  assert.doesNotMatch(draft, /## Notes for Future Use/i);
  assert.doesNotMatch(draft, /starting from JoeSpeaking\.com/i);
  assert.doesNotMatch(draft, /real product and a real company/i);
});

test('memorial page ships dark memorial metadata and a tribute-first closing tone', () => {
  const html = read(htmlPath);
  const publicUrlPattern = publicUrl.replace(/\//g, '\\/');

  assert.match(html, /<title>Remembering Professor Tony: The Story of How He Changed Me<\/title>/i);
  assert.match(html, /<meta name="theme-color" content="#0a0a0b"\s*\/?>/i);
  assert.match(html, new RegExp(`<link rel="canonical" href="${publicUrlPattern}"\\s*\\/?>`, 'i'));
  assert.match(html, new RegExp(`<meta property="og:url" content="${publicUrlPattern}"\\s*\\/?>`, 'i'));
  assert.match(html, new RegExp(`<meta property="og:image" content="${ogImageUrl.replace(/\//g, '\\/')}"\\s*\\/?>`, 'i'));
  assert.match(html, new RegExp(`<meta property="og:image:secure_url" content="${ogImageUrl.replace(/\//g, '\\/')}"\\s*\\/?>`, 'i'));
  assert.match(html, /<meta property="og:image:width" content="1200"\s*\/?>/i);
  assert.match(html, /<meta property="og:image:height" content="630"\s*\/?>/i);
  assert.match(html, /<meta property="og:image:type" content="image\/jpeg"\s*\/?>/i);
  assert.match(html, /<meta property="og:locale" content="en_CA"\s*\/?>/i);
  assert.match(html, new RegExp(`<meta name="twitter:image" content="${ogImageUrl.replace(/\//g, '\\/')}"\\s*\\/?>`, 'i'));
  assert.match(html, /<meta name="twitter:image:alt" content="Remembering Professor Tony: The Story of How He Changed Me"\s*\/?>/i);
  assert.match(html, /<meta property="article:published_time" content="2026-03-05"\s*\/?>/i);
  assert.match(html, /<meta property="article:modified_time" content="2026-03-06"\s*\/?>/i);
  assert.match(html, /Remembering a builder, mentor, and friend\./i);
  assert.match(html, /The best way I can remember him is to keep building\./i);
  assert.doesNotMatch(html, /JoeSpeaking\.com/i);
  assert.doesNotMatch(html, /real product and a real company/i);
});

test('memorial page keeps AI support surfaces out of the visible tribute', () => {
  const html = read(htmlPath);

  assert.match(html, /<script type="application\/ld\+json">/i);
  assert.match(html, /"@type"\s*:\s*"Article"/i);
  assert.match(html, /"headline"\s*:\s*"Remembering Professor Tony: The Story of How He Changed Me"/i);
  assert.match(html, /"datePublished"\s*:\s*"2026-03-05"/i);
  assert.match(html, /"dateModified"\s*:\s*"2026-03-06"/i);
  assert.match(html, /"author"\s*:\s*\{\s*"@type"\s*:\s*"Person"/i);
  assert.match(html, /"name"\s*:\s*"Joe Hu"/i);
  assert.match(html, /"about"\s*:\s*\[/i);
  assert.match(html, /Professor Tony Bailetti/i);
  assert.doesNotMatch(html, /Published:\s*March 5, 2026/i);
  assert.doesNotMatch(html, /Updated:\s*March 6, 2026/i);
  assert.doesNotMatch(html, /Key facts/i);
  assert.doesNotMatch(html, /intended to remain publicly readable and citeable by AI systems and search crawlers/i);
  assert.doesNotMatch(html, /href="summary\/"/i);
  assert.doesNotMatch(html, /href="faq\/"/i);
  assert.doesNotMatch(html, /href="sources\/"/i);
  assert.doesNotMatch(html, /href="about\/"/i);
  assert.doesNotMatch(html, /href="privacy\/"/i);
  assert.doesNotMatch(html, /href="contact\/"/i);
  assert.doesNotMatch(html, /hero-actions/i);
  assert.doesNotMatch(html, /meta-band/i);
  assert.doesNotMatch(html, /resource-band/i);
});

test('memorial page includes the shared GA4 tag', () => {
  const html = read(htmlPath);

  assert.match(
    html,
    new RegExp(`<script async src="https://www.googletagmanager.com/gtag/js\\?id=${gaMeasurementId}"><\\/script>`, 'i'),
  );
  assert.match(html, /window\.dataLayer = window\.dataLayer \|\| \[\];/i);
  assert.match(html, /function gtag\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}/i);
  assert.match(html, new RegExp(`gtag\\('config', '${gaMeasurementId}'\\);`, 'i'));
});

test('memorial page includes skip navigation, focus hooks, and explicit media attributes', () => {
  const html = read(htmlPath);

  assert.match(html, /<a class="skip-link" href="#memorial-content">Skip to memorial<\/a>/i);
  assert.match(html, /<main id="memorial-content">/i);
  assert.match(html, /<link rel="preload" as="image" href="assets\/images\/hero-joe-tony-premium\.jpg"/i);
  assert.match(html, /hero-joe-tony-premium\.jpg"[^>]*fetchpriority="high"/i);

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  assert.ok(imgTags.length >= 10, 'expected at least 10 images in the memorial page');
  imgTags.forEach((tag) => {
    assert.match(tag, /\salt="[^"]+"/i);
    assert.match(tag, /\swidth="[^"]+"/i);
    assert.match(tag, /\sheight="[^"]+"/i);
  });

  const heroTag = imgTags.find((tag) => /hero-joe-tony-premium\.jpg/i.test(tag));
  const orientationTag = imgTags.find((tag) => /orientation-04\.jpg/i.test(tag));
  const boundariesTag = imgTags.find((tag) => /kanata-north-01\.jpg/i.test(tag));
  assert.ok(heroTag, 'expected hero image tag');
  assert.ok(orientationTag, 'expected orientation image tag');
  assert.ok(boundariesTag, 'expected boundaries image tag');
  assert.doesNotMatch(heroTag, /\sloading="lazy"/i);
  assert.doesNotMatch(orientationTag, /\sloading="lazy"/i);
  assert.doesNotMatch(boundariesTag, /\sloading="lazy"/i);

  const blankLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) ?? [];
  assert.ok(blankLinks.length >= 4, 'expected multiple external links');
  blankLinks.forEach((tag) => {
    assert.match(tag, /\srel="[^"]*noopener[^"]*"/i);
  });
});

test('styles, script hooks, and share card reflect the memorial polish work', () => {
  const css = read(cssPath);
  const js = read(jsPath);
  const shareCard = read(shareCardPath);

  assert.match(css, /\.skip-link\b/i);
  assert.match(css, /:focus-visible/i);
  assert.match(css, /scroll-margin-top:/i);
  assert.match(css, /prefers-reduced-motion/i);
  assert.doesNotMatch(css, /outline:\s*none/i);

  assert.match(js, /IntersectionObserver/i);
  assert.match(js, /prefers-reduced-motion/i);

  assert.match(shareCard, /--paper:\s*#0a0a0b/i);
  assert.match(shareCard, /Remembering Professor Tony/i);
  assert.match(shareCard, /A public memorial from Joe Hu/i);
  assert.match(shareCard, /For Professor Tony Bailetti/i);
  assert.match(shareCard, /This is the story of how he encouraged me step by step/i);
  assert.match(shareCard, /47 years at Carleton • Founder of TIM • Mentor and builder/i);
  assert.match(shareCard, /\swidth="1200"/i);
  assert.match(shareCard, /\sheight="1800"/i);
  assert.match(shareCard, /<meta name="robots" content="noindex, nofollow"\s*\/?>/i);
  assert.match(shareCard, /<link rel="canonical" href="https:\/\/tony\.hubeiqiao\.com\/"\s*\/?>/i);
});

test('support pages are crawlable HTML documents with canonical metadata and fit-for-purpose copy', () => {
  const pages = [
    [summaryPath, 'Remembering Professor Tony Summary', /fact-first summary/i],
    [faqPath, 'Remembering Professor Tony FAQ', /Frequently asked questions/i],
    [sourcesPath, 'Remembering Professor Tony Sources', /public-safe sources only/i],
    [aboutPath, 'About This Memorial for Professor Tony', /Joe Hu/i],
    [privacyPath, 'Privacy Policy for the Professor Tony Memorial', /Google Analytics/i],
    [contactPath, 'Contact Joe Hu About This Memorial', /hubeiqiao\.com/i],
  ];

  for (const [pagePath, title, bodyPattern] of pages) {
    const html = read(pagePath);
    assert.match(html, /<!DOCTYPE html>/i);
    assert.match(html, /<html lang="en">/i);
    assert.match(html, new RegExp(`<title>${title}<\\/title>`, 'i'));
    assert.match(html, /<link rel="canonical" href="https:\/\/tony\.hubeiqiao\.com\//i);
    assert.match(html, /<meta name="description" content="[^"]+"/i);
    assert.match(html, /<meta property="og:title" content="[^"]+"/i);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"\s*\/?>/i);
    assert.match(html, bodyPattern);
    assert.match(html, /href="\/"|href="\.\.\/"/i);
  }
});

test('faq page ships FAQPage schema that matches visible questions', () => {
  const faqHtml = read(faqPath);

  assert.match(faqHtml, /<script type="application\/ld\+json">/i);
  assert.match(faqHtml, /"@type"\s*:\s*"FAQPage"/i);
  assert.match(faqHtml, /Who was Professor Tony Bailetti\?/i);
  assert.match(faqHtml, /Who created this memorial\?/i);
  assert.match(faqHtml, /Can AI systems cite this site\?/i);
});

test('readme explains the memorial in plain language', () => {
  assert.ok(fs.existsSync(readmePath), 'expected README.md to exist');

  const readme = read(readmePath);

  assert.match(readme, /^# Remembering Professor Tony/m);
  assert.match(readme, /https:\/\/tony\.hubeiqiao\.com\//i);
  assert.match(readme, /a public memorial from Joe Hu/i);
  assert.match(readme, /why this exists/i);
  assert.match(readme, /what this memorial holds/i);
  assert.doesNotMatch(readme, /npm|yarn|pnpm|build|deploy|localhost/i);
});

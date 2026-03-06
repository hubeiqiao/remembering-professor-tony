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
const memorialDraftPath = path.join(rootDir, 'how-professor-tony-encouraged-me.md');
const assetsDir = path.join(siteDir, 'assets');

const publicUrl = 'https://hubeiqiao.com/professor-tony/';
const ogImageUrl = `${publicUrl}assets/social/og-image.png`;

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('site scaffold and memorial assets exist', () => {
  assert.ok(fs.existsSync(htmlPath), 'expected site/index.html to exist');
  assert.ok(fs.existsSync(cssPath), 'expected site/styles.css to exist');
  assert.ok(fs.existsSync(jsPath), 'expected site/script.js to exist');
  assert.ok(fs.existsSync(shareCardPath), 'expected site/share-card.html to exist');
  assert.ok(fs.existsSync(memorialDraftPath), 'expected memorial draft markdown to exist');
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'social', 'og-image.png')),
    'expected og image export to exist',
  );
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

  assert.match(html, /<title>Remembering Professor Tony: The Story of How He Changed Me<\/title>/i);
  assert.match(html, /<meta name="theme-color" content="#0a0a0b"\s*\/?>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/hubeiqiao\.com\/professor-tony\/"\s*\/?>/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/hubeiqiao\.com\/professor-tony\/"\s*\/?>/i);
  assert.match(html, new RegExp(`<meta property="og:image" content="${ogImageUrl.replace(/\//g, '\\/')}"\\s*\\/?>`, 'i'));
  assert.match(html, new RegExp(`<meta name="twitter:image" content="${ogImageUrl.replace(/\//g, '\\/')}"\\s*\\/?>`, 'i'));
  assert.match(html, /Remembering a builder, mentor, and friend\./i);
  assert.match(html, /The best way I can remember him is to keep building\./i);
  assert.doesNotMatch(html, /JoeSpeaking\.com/i);
  assert.doesNotMatch(html, /real product and a real company/i);
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
  assert.match(shareCard, /\swidth="1200"/i);
  assert.match(shareCard, /\sheight="1800"/i);
});

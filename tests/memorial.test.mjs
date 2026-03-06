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
const assetsDir = path.join(siteDir, 'assets');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('site scaffold and og export exist', () => {
  assert.ok(fs.existsSync(htmlPath), 'expected site/index.html to exist');
  assert.ok(fs.existsSync(cssPath), 'expected site/styles.css to exist');
  assert.ok(fs.existsSync(jsPath), 'expected site/script.js to exist');
  assert.ok(fs.existsSync(shareCardPath), 'expected site/share-card.html to exist');
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'images', 'orientation-04.jpg')),
    'expected premium orientation image export to exist',
  );
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'images', 'tim-ai-workshop-02-wide.jpg')),
    'expected premium workshop image export to exist',
  );
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'images', 'perplexity-03.jpg')),
    'expected premium Perplexity image export to exist',
  );
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'images', 'scoping-review.webp')),
    'expected scoping review image export to exist',
  );
  assert.ok(
    fs.existsSync(path.join(assetsDir, 'social', 'og-image.png')),
    'expected og image export to exist',
  );
});

test('memorial page follows the premium narrative structure and source details', () => {
  const html = read(htmlPath);

  assert.match(html, /<title>Remembering Professor Tony: The Story of How He Changed Me/i);
  assert.match(html, /id="hero"/i);
  assert.match(html, /id="threshold"/i);
  assert.match(html, /id="backed-ideas"/i);
  assert.match(html, /id="superpower"/i);
  assert.match(html, /id="personal"/i);
  assert.match(html, /id="build"/i);
  assert.match(html, /id="legacy-end"/i);

  assert.match(html, /Remembering Professor Tony: The Story of How He Changed Me/i);
  assert.match(html, /how he encouraged me step by step/i);
  assert.match(html, /August 2024/i);
  assert.match(html, /use my Carleton email/i);
  assert.match(html, /Perplexity is an important AI tool for us at TIM/i);
  assert.match(html, /Very proud of you/i);
  assert.match(html, /This is YOUR course/i);
  assert.match(html, /Joe, congratulations! Make it happen/i);
  assert.match(html, /last project I supervise at Carleton since I joined the university in 1979/i);
  assert.match(html, /JoeSpeaking/i);
  assert.match(html, /Theories and Mechanisms for AI-Powered ESL Speaking System Design/i);
  assert.match(html, /https:\/\/eslr\.hubeiqiao\.com\//i);
  assert.match(html, /https:\/\/joespeaking\.com\//i);

  assert.match(html, /assets\/images\/orientation-04\.jpg/i);
  assert.match(html, /assets\/images\/tim-ai-workshop-02-wide\.jpg/i);
  assert.match(html, /assets\/images\/perplexity-03\.jpg/i);
  assert.match(html, /assets\/images\/scoping-review\.webp/i);
  assert.match(html, /story-content--media-first/i);
  assert.match(html, /story-plate story-plate--lead[\s\S]*tim-reunion-community\.webp/i);
  assert.match(html, /story-plate story-plate--fit[\s\S]*tim-ai-workshop-02-wide\.jpg/i);
  assert.match(html, /story-aside story-aside--bottom/i);

  assert.doesNotMatch(html, /assets\/images\/orientation-community\.webp/i);
  assert.doesNotMatch(html, /assets\/images\/perplexity-workshop\.webp/i);
  assert.doesNotMatch(html, /assets\/images\/ai-workshop-stage\.webp/i);

  assert.doesNotMatch(html, /I am dying/i);
  assert.doesNotMatch(html, /Please focus on developing your entrepreneurial skills\./i);
});

test('memorial page removes click-heavy exhibit UI and keeps accessible media', () => {
  const html = read(htmlPath);

  assert.doesNotMatch(html, /Exhibit Path/i);
  assert.doesNotMatch(html, /progress-rail/i);
  assert.doesNotMatch(html, /<details\b/i);
  assert.doesNotMatch(html, /<summary/i);
  assert.doesNotMatch(html, /data-scene-link/i);

  assert.match(html, /property="og:image"/i);
  assert.match(html, /name="twitter:card"/i);
  assert.match(html, /<figure/gi);
  assert.match(html, /<figcaption/gi);

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  assert.ok(imgTags.length >= 6, 'expected at least 6 images in the memorial page');
  imgTags.forEach((tag) => {
    assert.match(tag, /\salt="[^"]+"/i);
    assert.doesNotMatch(tag, /\salt=""/i);
  });
});

test('styles and scripts reflect a restrained editorial scroll experience and safe og hooks', () => {
  const css = read(cssPath);
  const js = read(jsPath);
  const shareCard = read(shareCardPath);

  assert.match(css, /\.hero\b/i);
  assert.match(css, /\.story-band\b/i);
  assert.match(css, /\.quote-panel\b/i);
  assert.match(css, /\.full-bleed\b/i);
  assert.match(css, /\.hero-kicker\b/i);
  assert.match(css, /\.story-content--media-first\b/i);
  assert.match(css, /\.story-plate--lead\b/i);
  assert.match(css, /\.story-aside--bottom\b/i);
  assert.match(css, /margin-bottom:\s*clamp\(/i);
  assert.match(css, /prefers-reduced-motion/i);

  assert.doesNotMatch(css, /\.progress-rail\b/i);
  assert.doesNotMatch(css, /\.artifact-drawer\b/i);

  assert.match(js, /IntersectionObserver/i);
  assert.match(js, /reveal/i);
  assert.doesNotMatch(js, /data-scene-link/i);

  assert.match(shareCard, /safe-frame/i);
  assert.match(shareCard, /safe-copy/i);
  assert.match(shareCard, /Remembering Professor Tony: The Story of How He Changed Me/i);
});

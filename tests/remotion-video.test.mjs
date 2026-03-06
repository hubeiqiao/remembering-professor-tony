import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const rootDir = '/Users/joehu/Final Project_Local/Professor Tony';
const rootPackagePath = path.join(rootDir, 'package.json');
const videoDir = path.join(rootDir, 'video');
const videoPackagePath = path.join(videoDir, 'package.json');
const walkthroughModulePath = path.join(videoDir, 'src', 'data', 'walkthrough.mjs');
const validationModulePath = path.join(videoDir, 'src', 'lib', 'walkthrough-validation.mjs');
const captureReadinessModulePath = path.join(videoDir, 'src', 'lib', 'capture-readiness.mjs');
const renderPropsModulePath = path.join(videoDir, 'src', 'lib', 'render-props.mjs');
const renderingModulePath = path.join(videoDir, 'src', 'data', 'walkthrough-rendering.mjs');
const browserShellPath = path.join(videoDir, 'src', 'components', 'BrowserShell.jsx');
const compositionPath = path.join(videoDir, 'src', 'compositions', 'WebsiteWalkthrough.jsx');

const EXPECTED_CAPTURE_IDS = [
  'hero-open',
  'threshold-burst',
  'backed-ideas-focus',
  'superpower-build-rush',
  'legacy-focus',
  'closing-settle',
];

const EXPECTED_SCENE_IDS = [
  'hero-open',
  'threshold-burst',
  'backed-ideas-focus',
  'superpower-build-rush',
  'ai-workshop-impact',
  'legacy-focus',
  'reunion-release',
  'closing-settle',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('root package exposes remotion proxy scripts', () => {
  const pkg = readJson(rootPackagePath);

  assert.equal(pkg.scripts['video:dev'], 'npm --prefix video run dev');
  assert.equal(pkg.scripts['video:capture'], 'npm --prefix video run capture');
  assert.equal(pkg.scripts['video:check'], 'npm --prefix video run check');
  assert.equal(pkg.scripts['video:render'], 'npm --prefix video run render');
});

test('video workspace declares remotion and capture tooling', () => {
  const pkg = readJson(videoPackagePath);

  assert.equal(pkg.type, 'module');
  assert.equal(pkg.private, true);
  assert.equal(pkg.scripts.dev, 'remotion studio src/index.jsx');
  assert.equal(pkg.scripts.capture, 'node ./scripts/capture.mjs');
  assert.equal(pkg.scripts.check, 'node ./scripts/check.mjs');
  assert.equal(pkg.scripts.render, 'node ./scripts/render.mjs');
  assert.ok(pkg.dependencies.remotion, 'expected remotion dependency');
  assert.ok(pkg.dependencies['@remotion/cli'], 'expected @remotion/cli dependency');
  assert.ok(pkg.dependencies.react, 'expected react dependency');
  assert.ok(pkg.dependencies['@remotion/media'], 'expected @remotion/media dependency');
  assert.ok(pkg.dependencies['@remotion/transitions'], 'expected @remotion/transitions dependency');
  assert.ok(pkg.dependencies.playwright, 'expected playwright dependency');
});

test('walkthrough data exports planned capture targets and scene timing', async () => {
  const walkthrough = await import(pathToFileURL(walkthroughModulePath).href);

  assert.deepEqual(
    walkthrough.CAPTURE_TARGETS.map((target) => target.id),
    EXPECTED_CAPTURE_IDS,
  );
  assert.deepEqual(
    walkthrough.CAPTURE_TARGETS.map((target) => target.anchor),
    [
      '#hero',
      '#threshold',
      '#backed-ideas',
      '#build',
      '#legacy-end',
      '#hero-closing',
    ],
  );
  assert.deepEqual(
    walkthrough.CAPTURE_TARGETS.map((target) => target.captureMode),
    ['viewport', 'element', 'element', 'element', 'element', 'viewport'],
  );
  assert.deepEqual(
    walkthrough.WALKTHROUGH_SCENES.map((scene) => scene.id),
    EXPECTED_SCENE_IDS,
  );
  assert.deepEqual(
    walkthrough.WALKTHROUGH_SCENES.map((scene) => scene.motionPreset),
    [
      'hero-open',
      'threshold-burst',
      'backed-ideas-focus',
      'superpower-build-rush',
      'ai-workshop-impact',
      'legacy-focus',
      'reunion-release',
      'closing-settle',
    ],
  );
  assert.ok(
    walkthrough.WALKTHROUGH_SCENES.every((scene) => typeof scene.transitionPreset === 'string'),
    'expected every scene to declare a transitionPreset',
  );
  assert.ok(
    !walkthrough.WALKTHROUGH_SCENES.some((scene) =>
      ['boundaries', 'personal', 'welcome-threshold-clip'].includes(scene.id),
    ),
    'expected dropped sections to be absent from the active teaser manifest',
  );
  assert.equal(walkthrough.DEFAULT_PROPS.muted, true);
  assert.equal(walkthrough.DEFAULT_PROPS.musicFile, null);
  assert.equal(walkthrough.DEFAULT_PROPS.outputBasename, 'professor-tony-site-walkthrough-16x9');
  assert.equal(walkthrough.getTotalDurationInFrames(), 1086);
  assert.equal(walkthrough.getLastFrame(), 1085);
  assert.equal(walkthrough.getSceneCount(), 8);
});

test('walkthrough validation exposes smoke frames and source video requirements', async () => {
  const validation = await import(pathToFileURL(validationModulePath).href);

  assert.deepEqual(
    validation.SOURCE_VIDEO_FILES.map((file) => file.fileName),
    ['ai-workshop-beat.mp4', 'reunion-presence.mp4'],
  );
  assert.deepEqual(validation.getSmokeStillFrames(), [0, 1085]);
  assert.doesNotThrow(() => validation.assertWalkthroughManifestIsValid());
});

test('walkthrough validation confirms capture anchors exist in the memorial site', async () => {
  const validation = await import(pathToFileURL(validationModulePath).href);

  assert.doesNotThrow(() => validation.assertCaptureAnchorsExist());
});

test('capture readiness ignores offscreen lazy images but blocks on visible incomplete media', async () => {
  const readiness = await import(pathToFileURL(captureReadinessModulePath).href);

  assert.equal(
    readiness.isCaptureReady({
      images: [
        {complete: true, loading: 'eager', top: 0, bottom: 400, viewportHeight: 1080},
        {complete: false, loading: 'lazy', top: 1800, bottom: 2400, viewportHeight: 1080},
      ],
    }),
    true,
  );

  assert.equal(
    readiness.isCaptureReady({
      images: [{complete: false, loading: 'eager', top: 0, bottom: 400, viewportHeight: 1080}],
    }),
    false,
  );

  assert.equal(
    readiness.isCaptureReady({
      images: [{complete: false, loading: 'lazy', top: 100, bottom: 700, viewportHeight: 1080}],
    }),
    false,
  );
});

test('teaser composition removes memorial copy overlays and keeps only minimal chrome', () => {
  const browserShellSource = fs.readFileSync(browserShellPath, 'utf8');
  const compositionSource = fs.readFileSync(compositionPath, 'utf8');

  assert.doesNotMatch(browserShellSource, /Memorial walkthrough/i);
  assert.doesNotMatch(browserShellSource, /caption/i);
  assert.doesNotMatch(compositionSource, /Guided focus/i);
  assert.doesNotMatch(compositionSource, /scene\.caption/i);
});

test('rendering presets avoid aggressive crop on section captures and align soundtrack excerpt to the teaser', async () => {
  const rendering = await import(pathToFileURL(renderingModulePath).href);
  const walkthrough = await import(pathToFileURL(walkthroughModulePath).href);

  assert.equal(
    rendering.getCaptureRenderProfile('element').foregroundObjectFit,
    'contain',
  );
  assert.equal(
    rendering.getCaptureRenderProfile('viewport').foregroundObjectFit,
    'cover',
  );
  assert.ok(rendering.MOTION_PRESETS['threshold-burst'].fromScale <= 1.03);
  assert.ok(rendering.MOTION_PRESETS['closing-settle'].fromScale <= 1.03);
  assert.ok(rendering.getSceneFocusProfile('threshold-burst').scale >= 1.35);
  assert.ok(
    rendering.getSceneFocusProfile('threshold-burst').fromY >
      rendering.getSceneFocusProfile('threshold-burst').toY,
  );
  assert.ok(rendering.getSceneFocusProfile('backed-ideas-focus').scale >= 1.3);
  assert.ok(
    rendering.getSceneFocusProfile('backed-ideas-focus').fromY >
      rendering.getSceneFocusProfile('backed-ideas-focus').toY,
  );
  assert.ok(rendering.getSceneFocusProfile('superpower-build-rush').scale >= 1.3);
  assert.ok(
    rendering.getSceneFocusProfile('superpower-build-rush').fromY >
      rendering.getSceneFocusProfile('superpower-build-rush').toY,
  );
  assert.ok(rendering.getSceneFocusProfile('legacy-focus').scale >= 1.45);
  assert.ok(
    rendering.getSceneFocusProfile('legacy-focus').fromY >
      rendering.getSceneFocusProfile('legacy-focus').toY,
  );
  assert.equal(rendering.TRANSITION_PRESETS['closing-settle'].type, 'fade');
  assert.deepEqual(
    rendering.getSoundtrackWindow({
      durationInFrames: walkthrough.getTotalDurationInFrames(),
    }),
    {
      trimBeforeInFrames: 1920,
      trimAfterInFrames: 3006,
    },
  );
});

test('soundtrack auto-detection stays muted without soundtrack and enables music when present', async () => {
  const renderProps = await import(pathToFileURL(renderPropsModulePath).href);
  const tempMusicDir = fs.mkdtempSync(path.join(rootDir, 'tmp-music-'));

  try {
    assert.deepEqual(renderProps.resolveRenderProps({musicRoot: tempMusicDir}), {
      musicFile: null,
      muted: true,
      outputBasename: 'professor-tony-site-walkthrough-16x9',
    });

    fs.writeFileSync(path.join(tempMusicDir, 'soundtrack.mp3'), 'placeholder');

    assert.deepEqual(renderProps.resolveRenderProps({musicRoot: tempMusicDir}), {
      musicFile: 'soundtrack.mp3',
      muted: false,
      outputBasename: 'professor-tony-site-walkthrough-16x9',
    });
  } finally {
    fs.rmSync(tempMusicDir, {recursive: true, force: true});
  }
});

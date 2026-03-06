import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

import {
  CAPTURE_TARGETS,
  MOBILE_CAPTURE_TARGETS,
  VARIANTS,
  WALKTHROUGH_SCENES,
  getCaptureTargetsForVariant,
  getLastFrame,
  getWalkthroughScenesForVariant,
} from '../data/walkthrough.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const VIDEO_ROOT = path.resolve(__dirname, '..', '..');
export const REPO_ROOT = path.resolve(VIDEO_ROOT, '..');
export const SITE_ROOT = path.join(REPO_ROOT, 'site');
export const PUBLIC_ROOT = path.join(VIDEO_ROOT, 'public');
export const CAPTURE_ROOT = path.join(PUBLIC_ROOT, 'captures');
export const SOURCE_VIDEO_ROOT = path.join(PUBLIC_ROOT, 'source-video');
export const MUSIC_ROOT = path.join(PUBLIC_ROOT, 'music');

export const SOURCE_VIDEO_FILES = [
  {
    id: 'ai-workshop-beat',
    fileName: 'ai-workshop-beat.mp4',
    sourcePath: path.join(SITE_ROOT, 'assets', 'video', 'ai-workshop-beat.mp4'),
    publicPath: path.join(SOURCE_VIDEO_ROOT, 'ai-workshop-beat.mp4'),
  },
  {
    id: 'reunion-presence',
    fileName: 'reunion-presence.mp4',
    sourcePath: path.join(SITE_ROOT, 'assets', 'video', 'reunion-presence.mp4'),
    publicPath: path.join(SOURCE_VIDEO_ROOT, 'reunion-presence.mp4'),
  },
];

export const getSmokeStillFrames = (variant = 'desktop') => [0, getLastFrame(variant)];

export const getCaptureOutputPath = (fileName) => path.join(CAPTURE_ROOT, fileName);

export const assertCaptureAnchorsExist = () => {
  const html = fs.readFileSync(path.join(SITE_ROOT, 'index.html'), 'utf8');

  for (const target of CAPTURE_TARGETS) {
    if (!html.includes(`id="${target.anchor.slice(1)}"`)) {
      throw new Error(`Capture anchor ${target.anchor} was not found in site/index.html`);
    }
  }
};

const assertVariantWalkthroughManifestIsValid = (variant) => {
  const captureTargets = getCaptureTargetsForVariant(variant);
  const scenes = getWalkthroughScenesForVariant(variant);
  const captureIds = new Set(captureTargets.map((target) => target.id));
  const clipFiles = new Set(SOURCE_VIDEO_FILES.map((file) => file.fileName));
  const sceneIds = new Set();

  for (const target of captureTargets) {
    if (!['viewport', 'element'].includes(target.captureMode)) {
      throw new Error(`Capture target ${target.id} must declare a valid captureMode`);
    }
  }

  for (const scene of scenes) {
    if (sceneIds.has(scene.id)) {
      throw new Error(`Duplicate scene id: ${scene.id}`);
    }

    sceneIds.add(scene.id);

    if (scene.durationInFrames <= 0) {
      throw new Error(`Scene ${scene.id} must have a positive duration`);
    }

    if (scene.transitionInFrames < 0) {
      throw new Error(`Scene ${scene.id} cannot have a negative transition`);
    }

    if (scene.transitionInFrames >= scene.durationInFrames) {
      throw new Error(`Scene ${scene.id} transition must be shorter than the scene duration`);
    }

    if (typeof scene.motionPreset !== 'string' || scene.motionPreset.length === 0) {
      throw new Error(`Scene ${scene.id} must declare a motionPreset`);
    }

    if (typeof scene.transitionPreset !== 'string' || scene.transitionPreset.length === 0) {
      throw new Error(`Scene ${scene.id} must declare a transitionPreset`);
    }

    if (scene.kind === 'capture') {
      if (!scene.captureFile) {
        throw new Error(`Capture scene ${scene.id} is missing captureFile`);
      }

      if (!captureIds.has(scene.id)) {
        throw new Error(`Capture scene ${scene.id} does not match a ${variant} capture target`);
      }
    }

    if (scene.kind === 'clip') {
      if (!scene.clipFile) {
        throw new Error(`Clip scene ${scene.id} is missing clipFile`);
      }

      if (!clipFiles.has(scene.clipFile)) {
        throw new Error(`Clip scene ${scene.id} references an unknown source video`);
      }
    }
  }
};

export const assertWalkthroughManifestIsValid = (variant = 'desktop') => {
  if (variant === 'all') {
    for (const variantName of VARIANTS) {
      assertVariantWalkthroughManifestIsValid(variantName);
    }

    return;
  }

  assertVariantWalkthroughManifestIsValid(variant);
};

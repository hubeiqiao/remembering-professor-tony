import fs from 'node:fs';
import path from 'node:path';

import {getDefaultPropsForVariant} from '../data/walkthrough.mjs';
import {SOUNDTRACK_EDIT} from '../data/walkthrough-rendering.mjs';
import {MUSIC_ROOT, REPO_ROOT} from './walkthrough-validation.mjs';

export const SOUNDTRACK_FILE = SOUNDTRACK_EDIT.fileName;

export const resolveMusicFile = ({musicRoot = MUSIC_ROOT} = {}) => {
  const soundtrackPath = path.join(musicRoot, SOUNDTRACK_FILE);
  return fs.existsSync(soundtrackPath) ? SOUNDTRACK_FILE : null;
};

export const resolveRenderProps = ({
  musicRoot = MUSIC_ROOT,
  outputBasename,
  variant = 'desktop',
} = {}) => {
  const musicFile = resolveMusicFile({musicRoot});
  const defaultProps = getDefaultPropsForVariant(variant);

  return {
    muted: musicFile === null,
    musicFile,
    outputBasename: outputBasename ?? defaultProps.outputBasename,
  };
};

export const getRenderOutputPath = ({
  outputBasename = getDefaultPropsForVariant('desktop').outputBasename,
  repoRoot = REPO_ROOT,
} = {}) => path.join(repoRoot, 'site', 'assets', 'video', `${outputBasename}.mp4`);

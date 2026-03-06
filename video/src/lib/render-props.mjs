import fs from 'node:fs';
import path from 'node:path';

import {DEFAULT_PROPS} from '../data/walkthrough.mjs';
import {SOUNDTRACK_EDIT} from '../data/walkthrough-rendering.mjs';
import {MUSIC_ROOT, REPO_ROOT} from './walkthrough-validation.mjs';

export const SOUNDTRACK_FILE = SOUNDTRACK_EDIT.fileName;

export const resolveMusicFile = ({musicRoot = MUSIC_ROOT} = {}) => {
  const soundtrackPath = path.join(musicRoot, SOUNDTRACK_FILE);
  return fs.existsSync(soundtrackPath) ? SOUNDTRACK_FILE : null;
};

export const resolveRenderProps = ({
  musicRoot = MUSIC_ROOT,
  outputBasename = DEFAULT_PROPS.outputBasename,
} = {}) => {
  const musicFile = resolveMusicFile({musicRoot});

  return {
    muted: musicFile === null,
    musicFile,
    outputBasename,
  };
};

export const getRenderOutputPath = ({
  outputBasename = DEFAULT_PROPS.outputBasename,
  repoRoot = REPO_ROOT,
} = {}) => path.join(repoRoot, 'site', 'assets', 'video', `${outputBasename}.mp4`);

import path from 'node:path';
import {spawn} from 'node:child_process';

import {VARIANTS, getCompositionId} from '../src/data/walkthrough.mjs';
import {resolveRenderProps, getRenderOutputPath} from '../src/lib/render-props.mjs';

const remotionBin = path.join(process.cwd(), 'node_modules', '.bin', 'remotion');

const getRequestedVariant = () => {
  const variantFlag = process.argv.find((arg) => arg.startsWith('--variant='));
  const variantValue =
    variantFlag?.split('=')[1] ??
    (process.argv.includes('--variant') ? process.argv[process.argv.indexOf('--variant') + 1] : null) ??
    'desktop';

  if (!VARIANTS.includes(variantValue)) {
    throw new Error(`Unknown render variant: ${variantValue}`);
  }

  return variantValue;
};

const variant = getRequestedVariant();
const renderProps = resolveRenderProps({variant});
const outputPath = getRenderOutputPath({outputBasename: renderProps.outputBasename});

const child = spawn(
  remotionBin,
  [
    'render',
    'src/index.jsx',
    getCompositionId(variant),
    outputPath,
    `--props=${JSON.stringify(renderProps)}`,
  ],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
  },
);

child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});

child.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});

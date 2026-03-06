import path from 'node:path';
import {spawn} from 'node:child_process';

import {resolveRenderProps, getRenderOutputPath} from '../src/lib/render-props.mjs';

const remotionBin = path.join(process.cwd(), 'node_modules', '.bin', 'remotion');

const renderProps = resolveRenderProps();
const outputPath = getRenderOutputPath({outputBasename: renderProps.outputBasename});

const child = spawn(
  remotionBin,
  [
    'render',
    'src/index.jsx',
    'ProfessorTonyWebsiteWalkthrough16x9',
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

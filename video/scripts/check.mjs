import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

import {
  CAPTURE_TARGETS,
} from '../src/data/walkthrough.mjs';
import {resolveRenderProps} from '../src/lib/render-props.mjs';
import {
  CAPTURE_ROOT,
  SOURCE_VIDEO_FILES,
  assertCaptureAnchorsExist,
  assertWalkthroughManifestIsValid,
  getCaptureOutputPath,
  getSmokeStillFrames,
} from '../src/lib/walkthrough-validation.mjs';

const remotionBin = path.join(process.cwd(), 'node_modules', '.bin', 'remotion');

const assertFileExists = (filePath, label) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
};

const runRemotionStill = (frame, outputPath, renderProps) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      remotionBin,
      [
        'still',
        'src/index.jsx',
        'ProfessorTonyWebsiteWalkthrough16x9',
        outputPath,
        `--frame=${frame}`,
        `--props=${JSON.stringify(renderProps)}`,
      ],
      {
        cwd: process.cwd(),
        stdio: 'inherit',
      },
    );

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`remotion still failed for frame ${frame} with exit code ${code}`));
    });
    child.on('error', reject);
  });

const main = async () => {
  assertWalkthroughManifestIsValid();
  assertCaptureAnchorsExist();

  for (const target of CAPTURE_TARGETS) {
    assertFileExists(getCaptureOutputPath(target.file), `capture target ${target.id}`);
  }

  for (const video of SOURCE_VIDEO_FILES) {
    assertFileExists(video.publicPath, `source video ${video.id}`);
  }

  const [introFrame, closingFrame] = getSmokeStillFrames();
  const introOutput = path.join(os.tmpdir(), 'professor-tony-video-smoke-intro.png');
  const closingOutput = path.join(os.tmpdir(), 'professor-tony-video-smoke-closing.png');
  const renderProps = resolveRenderProps();

  await runRemotionStill(introFrame, introOutput, renderProps);
  await runRemotionStill(closingFrame, closingOutput, renderProps);

  console.log(
    `Validated captures in ${CAPTURE_ROOT} and rendered smoke stills for frames ${introFrame} and ${closingFrame}.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

import {
  VARIANTS,
  getCaptureTargetsForVariant,
  getCompositionId,
} from '../src/data/walkthrough.mjs';
import {resolveRenderProps} from '../src/lib/render-props.mjs';
import {
  SOURCE_VIDEO_FILES,
  assertCaptureAnchorsExist,
  assertWalkthroughManifestIsValid,
  getCaptureOutputPath,
  getSmokeStillFrames,
} from '../src/lib/walkthrough-validation.mjs';

const remotionBin = path.join(process.cwd(), 'node_modules', '.bin', 'remotion');

const getRequestedVariants = () => {
  const variantFlag = process.argv.find((arg) => arg.startsWith('--variant='));
  const variantValue =
    variantFlag?.split('=')[1] ??
    (process.argv.includes('--variant') ? process.argv[process.argv.indexOf('--variant') + 1] : null) ??
    'desktop';

  if (variantValue === 'all') {
    return VARIANTS;
  }

  if (!VARIANTS.includes(variantValue)) {
    throw new Error(`Unknown check variant: ${variantValue}`);
  }

  return [variantValue];
};

const assertFileExists = (filePath, label) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
};

const runRemotionStill = (variant, frame, outputPath, renderProps) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      remotionBin,
      [
        'still',
        'src/index.jsx',
        getCompositionId(variant),
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
  const requestedVariants = getRequestedVariants();

  assertWalkthroughManifestIsValid('all');
  assertCaptureAnchorsExist();

  for (const video of SOURCE_VIDEO_FILES) {
    assertFileExists(video.publicPath, `source video ${video.id}`);
  }

  for (const variant of requestedVariants) {
    for (const target of getCaptureTargetsForVariant(variant)) {
      assertFileExists(getCaptureOutputPath(target.file), `${variant} capture target ${target.id}`);
    }

    const [introFrame, closingFrame] = getSmokeStillFrames(variant);
    const introOutput = path.join(os.tmpdir(), `professor-tony-video-${variant}-smoke-intro.png`);
    const closingOutput = path.join(
      os.tmpdir(),
      `professor-tony-video-${variant}-smoke-closing.png`,
    );
    const renderProps = resolveRenderProps({variant});

    await runRemotionStill(variant, introFrame, introOutput, renderProps);
    await runRemotionStill(variant, closingFrame, closingOutput, renderProps);
  }

  console.log(
    `Validated ${requestedVariants.join(', ')} captures and rendered smoke stills for each requested variant.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

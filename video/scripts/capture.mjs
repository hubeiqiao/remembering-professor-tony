import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

import {chromium, devices} from 'playwright';

import {
  VARIANTS,
  getCaptureTargetsForVariant,
  getWalkthroughScenesForVariant,
} from '../src/data/walkthrough.mjs';
import {
  CAPTURE_ROOT,
  MUSIC_ROOT,
  SITE_ROOT,
  SOURCE_VIDEO_FILES,
  SOURCE_VIDEO_ROOT,
  assertCaptureAnchorsExist,
  assertWalkthroughManifestIsValid,
  getCaptureOutputPath,
} from '../src/lib/walkthrough-validation.mjs';

const MOBILE_DEVICE = devices['iPhone 14 Pro Max'];

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
    throw new Error(`Unknown capture variant: ${variantValue}`);
  }

  return [variantValue];
};

const ensureDirectories = async () => {
  await fs.mkdir(CAPTURE_ROOT, {recursive: true});
  await fs.mkdir(path.join(CAPTURE_ROOT, 'mobile'), {recursive: true});
  await fs.mkdir(SOURCE_VIDEO_ROOT, {recursive: true});
  await fs.mkdir(MUSIC_ROOT, {recursive: true});
};

const syncSourceVideos = async () => {
  await Promise.all(
    SOURCE_VIDEO_FILES.map((video) => fs.copyFile(video.sourcePath, video.publicPath)),
  );
};

const waitForImages = async (page) => {
  await page.waitForFunction(() => {
    const viewportHeight = window.innerHeight;
    const images = Array.from(document.images).map((image) => {
      const rect = image.getBoundingClientRect();

      return {
        bottom: rect.bottom,
        complete: image.complete,
        loading: image.loading || 'eager',
        top: rect.top,
        viewportHeight,
      };
    });

    return images.length > 0 && !images.some((image) => {
      if (image.complete) {
        return false;
      }

      if (image.loading !== 'lazy') {
        return true;
      }

      return image.bottom > 0 && image.top < image.viewportHeight;
    });
  });
};

const captureTargets = async (page, baseUrl, targets) => {
  for (const target of targets) {
    await page.goto(`${baseUrl}${target.anchor}`, {waitUntil: 'domcontentloaded'});
    await waitForImages(page);
    await page.waitForTimeout(target.waitMs);
    await page.locator(target.anchor).scrollIntoViewIfNeeded();
    await page.waitForTimeout(target.waitMs);

    if (target.captureMode === 'element') {
      await page.locator(target.anchor).screenshot({
        path: getCaptureOutputPath(target.file),
        type: 'png',
      });
      continue;
    }

    await page.screenshot({
      path: getCaptureOutputPath(target.file),
      type: 'png',
      fullPage: false,
    });
  }
};

const getContextOptionsForVariant = (variant) =>
  variant === 'mobile'
    ? {
        ...MOBILE_DEVICE,
        colorScheme: 'dark',
        deviceScaleFactor: 3,
        reducedMotion: 'no-preference',
      }
    : {
        colorScheme: 'dark',
        reducedMotion: 'no-preference',
        viewport: {width: 1920, height: 1080},
      };

const main = async () => {
  const requestedVariants = getRequestedVariants();

  assertWalkthroughManifestIsValid('all');
  assertCaptureAnchorsExist();

  const baseUrl = pathToFileURL(path.join(SITE_ROOT, 'index.html')).href;
  const browser = await chromium.launch();

  try {
    await ensureDirectories();
    await syncSourceVideos();

    for (const variant of requestedVariants) {
      const context = await browser.newContext(getContextOptionsForVariant(variant));

      try {
        const page = await context.newPage();
        await captureTargets(page, baseUrl, getCaptureTargetsForVariant(variant));
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log(
    `Captured ${requestedVariants.length} variant(s) of screenshots in ${CAPTURE_ROOT} and synced ${SOURCE_VIDEO_FILES.length} videos for ${getWalkthroughScenesForVariant('desktop').length} scenes.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

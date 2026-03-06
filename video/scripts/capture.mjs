import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

import {chromium} from 'playwright';

import {
  CAPTURE_TARGETS,
  WALKTHROUGH_SCENES,
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

const ensureDirectories = async () => {
  await fs.mkdir(CAPTURE_ROOT, {recursive: true});
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

const captureTargets = async (page, baseUrl) => {
  for (const target of CAPTURE_TARGETS) {
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

const main = async () => {
  assertWalkthroughManifestIsValid();
  assertCaptureAnchorsExist();

  const baseUrl = pathToFileURL(path.join(SITE_ROOT, 'index.html')).href;
  const browser = await chromium.launch();

  try {
    await ensureDirectories();
    await syncSourceVideos();

    const page = await browser.newPage({
      viewport: {width: 1920, height: 1080},
      colorScheme: 'dark',
      reducedMotion: 'no-preference',
    });

    await captureTargets(page, baseUrl);
  } finally {
    await browser.close();
  }

  console.log(
    `Captured ${CAPTURE_TARGETS.length} screenshots and synced ${SOURCE_VIDEO_FILES.length} videos for ${WALKTHROUGH_SCENES.length} scenes.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

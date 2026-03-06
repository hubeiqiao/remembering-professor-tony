export const shouldWaitForImage = (image) => {
  if (image.complete) {
    return false;
  }

  if (image.loading !== 'lazy') {
    return true;
  }

  return image.bottom > 0 && image.top < image.viewportHeight;
};

export const isCaptureReady = ({images}) => !images.some(shouldWaitForImage);

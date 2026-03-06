export const CAPTURE_RENDER_PROFILES = {
  viewport: {
    foregroundInsetPx: 0,
    foregroundObjectFit: 'cover',
    foregroundObjectPosition: 'center center',
    hasBackdrop: false,
  },
  element: {
    backgroundBlurPx: 26,
    backgroundBrightness: 0.34,
    backgroundOpacity: 0.34,
    backgroundSaturate: 0.78,
    backgroundScale: 1.04,
    foregroundInsetPx: 18,
    foregroundObjectFit: 'contain',
    foregroundObjectPosition: 'center center',
    hasBackdrop: true,
  },
};

export const getCaptureRenderProfile = (captureMode = 'viewport') =>
  CAPTURE_RENDER_PROFILES[captureMode] ?? CAPTURE_RENDER_PROFILES.viewport;

export const SCENE_FOCUS_PROFILES = {
  'threshold-burst': {
    fromX: 0,
    originX: '50%',
    originY: '50%',
    toX: 0,
    fromY: 72,
    toY: 8,
    scale: 1.36,
  },
  'backed-ideas-focus': {
    fromX: 0,
    originX: '50%',
    originY: '50%',
    toX: 0,
    fromY: 62,
    toY: 12,
    scale: 1.32,
  },
  'superpower-build-rush': {
    fromX: 0,
    originX: '50%',
    originY: '50%',
    toX: 0,
    fromY: 68,
    toY: 10,
    scale: 1.34,
  },
  'legacy-focus': {
    fromX: 0,
    originX: '50%',
    originY: '24%',
    toX: 0,
    fromY: 104,
    toY: 60,
    scale: 1.6,
  },
};

export const getSceneFocusProfile = (sceneId) =>
  SCENE_FOCUS_PROFILES[sceneId] ?? {
    fromX: 0,
    originX: '50%',
    originY: '50%',
    toX: 0,
    fromY: 0,
    toY: 0,
    scale: 1,
  };

export const MOTION_PRESETS = {
  'hero-open': {fromScale: 1.03, toScale: 1, fromX: 0, toX: 0, fromY: 10, toY: -18, glow: 0.08},
  'threshold-burst': {
    fromScale: 1.02,
    toScale: 1,
    fromX: -4,
    toX: 4,
    fromY: 12,
    toY: -18,
    glow: 0.06,
  },
  'backed-ideas-focus': {
    fromScale: 1.02,
    toScale: 1,
    fromX: -10,
    toX: 8,
    fromY: 10,
    toY: -14,
    glow: 0.06,
  },
  'superpower-build-rush': {
    fromScale: 1.03,
    toScale: 1.01,
    fromX: 10,
    toX: -8,
    fromY: 14,
    toY: -20,
    glow: 0.08,
  },
  'ai-workshop-impact': {
    fromScale: 1.04,
    toScale: 1.01,
    fromX: 0,
    toX: 0,
    fromY: 12,
    toY: -14,
    glow: 0.14,
    playbackRate: 1.1,
  },
  'legacy-focus': {
    fromScale: 1.015,
    toScale: 1,
    fromX: -6,
    toX: 4,
    fromY: 8,
    toY: -12,
    glow: 0.05,
  },
  'reunion-release': {
    fromScale: 1.03,
    toScale: 1.01,
    fromX: 0,
    toX: 0,
    fromY: 10,
    toY: -12,
    glow: 0.12,
    playbackRate: 1.04,
  },
  'closing-settle': {
    fromScale: 1.025,
    toScale: 1,
    fromX: 0,
    toX: 0,
    fromY: 18,
    toY: 0,
    glow: 0.04,
  },
};

export const TRANSITION_PRESETS = {
  'impact-wipe': {
    config: {damping: 200, mass: 0.9},
    direction: 'from-right',
    durationInFrames: 12,
    type: 'wipe',
  },
  'closing-settle': {
    config: {damping: 120, mass: 0.92},
    durationInFrames: 12,
    type: 'fade',
  },
  'scroll-push': {
    config: {damping: 210, mass: 1},
    direction: 'from-bottom',
    durationInFrames: 12,
    type: 'slide',
  },
};

export const SOUNDTRACK_EDIT = {
  fadeInInFrames: 36,
  fadeOutInFrames: 84,
  fileName: 'soundtrack.mp3',
  targetVolume: 0.72,
  trimBeforeInFrames: 1920,
};

export const getSoundtrackWindow = ({durationInFrames}) => ({
  trimBeforeInFrames: SOUNDTRACK_EDIT.trimBeforeInFrames,
  trimAfterInFrames: SOUNDTRACK_EDIT.trimBeforeInFrames + durationInFrames,
});

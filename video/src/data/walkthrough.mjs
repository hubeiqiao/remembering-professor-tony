/**
 * @typedef {Object} CaptureTarget
 * @property {string} id
 * @property {string} anchor
 * @property {'viewport' | 'element'} captureMode
 * @property {string} file
 * @property {number} waitMs
 */

/**
 * @typedef {Object} WalkthroughScene
 * @property {string} id
 * @property {'capture' | 'clip'} kind
 * @property {string | null} captureFile
 * @property {string | null} clipFile
 * @property {number} durationInFrames
 * @property {number} transitionInFrames
 * @property {string} motionPreset
 * @property {string} transitionPreset
 * @property {string} urlLabel
 * @property {string} sectionLabel
 */

export const DEFAULT_PROPS = {
  muted: true,
  musicFile: null,
  outputBasename: 'professor-tony-site-walkthrough-16x9',
};

/** @type {CaptureTarget[]} */
export const CAPTURE_TARGETS = [
  {
    id: 'hero-open',
    anchor: '#hero',
    captureMode: 'viewport',
    file: 'hero-open.png',
    waitMs: 220,
  },
  {
    id: 'threshold-burst',
    anchor: '#threshold',
    captureMode: 'element',
    file: 'threshold-burst.png',
    waitMs: 220,
  },
  {
    id: 'backed-ideas-focus',
    anchor: '#backed-ideas',
    captureMode: 'element',
    file: 'backed-ideas-focus.png',
    waitMs: 220,
  },
  {
    id: 'superpower-build-rush',
    anchor: '#build',
    captureMode: 'element',
    file: 'superpower-build-rush.png',
    waitMs: 220,
  },
  {
    id: 'legacy-focus',
    anchor: '#legacy-end',
    captureMode: 'element',
    file: 'legacy-focus.png',
    waitMs: 220,
  },
  {
    id: 'closing-settle',
    anchor: '#hero-closing',
    captureMode: 'viewport',
    file: 'closing-settle.png',
    waitMs: 220,
  },
];

const DEFAULT_TRANSITION = 12;

/** @type {WalkthroughScene[]} */
export const WALKTHROUGH_SCENES = [
  {
    id: 'hero-open',
    kind: 'capture',
    captureFile: 'hero-open.png',
    clipFile: null,
    durationInFrames: 150,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'hero-open',
    transitionPreset: 'scroll-push',
    urlLabel: 'tony.hubeiqiao.com/',
    sectionLabel: 'Hero',
  },
  {
    id: 'threshold-burst',
    kind: 'capture',
    captureFile: 'threshold-burst.png',
    clipFile: null,
    durationInFrames: 150,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'threshold-burst',
    transitionPreset: 'scroll-push',
    urlLabel: 'tony.hubeiqiao.com/#threshold',
    sectionLabel: 'Threshold',
  },
  {
    id: 'backed-ideas-focus',
    kind: 'capture',
    captureFile: 'backed-ideas-focus.png',
    clipFile: null,
    durationInFrames: 120,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'backed-ideas-focus',
    transitionPreset: 'scroll-push',
    urlLabel: 'tony.hubeiqiao.com/#backed-ideas',
    sectionLabel: 'Backed Ideas',
  },
  {
    id: 'superpower-build-rush',
    kind: 'capture',
    captureFile: 'superpower-build-rush.png',
    clipFile: null,
    durationInFrames: 120,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'superpower-build-rush',
    transitionPreset: 'impact-wipe',
    urlLabel: 'tony.hubeiqiao.com/#build',
    sectionLabel: 'Build Rush',
  },
  {
    id: 'ai-workshop-impact',
    kind: 'clip',
    captureFile: null,
    clipFile: 'ai-workshop-beat.mp4',
    durationInFrames: 90,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'ai-workshop-impact',
    transitionPreset: 'impact-wipe',
    urlLabel: 'tony.hubeiqiao.com/#superpower',
    sectionLabel: 'Workshop',
  },
  {
    id: 'legacy-focus',
    kind: 'capture',
    captureFile: 'legacy-focus.png',
    clipFile: null,
    durationInFrames: 180,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'legacy-focus',
    transitionPreset: 'scroll-push',
    urlLabel: 'tony.hubeiqiao.com/#legacy-end',
    sectionLabel: 'Legacy',
  },
  {
    id: 'reunion-release',
    kind: 'clip',
    captureFile: null,
    clipFile: 'reunion-presence.mp4',
    durationInFrames: 120,
    transitionInFrames: DEFAULT_TRANSITION,
    motionPreset: 'reunion-release',
    transitionPreset: 'closing-settle',
    urlLabel: 'tony.hubeiqiao.com/#legacy-end',
    sectionLabel: 'Reunion',
  },
  {
    id: 'closing-settle',
    kind: 'capture',
    captureFile: 'closing-settle.png',
    clipFile: null,
    durationInFrames: 240,
    transitionInFrames: 0,
    motionPreset: 'closing-settle',
    transitionPreset: 'none',
    urlLabel: 'tony.hubeiqiao.com/#hero-closing',
    sectionLabel: 'Closing',
  },
];

export const getSceneCount = () => WALKTHROUGH_SCENES.length;

export const getTotalDurationInFrames = () =>
  WALKTHROUGH_SCENES.reduce(
    (total, scene) => total + scene.durationInFrames - scene.transitionInFrames,
    0,
  );

export const getLastFrame = () => getTotalDurationInFrames() - 1;

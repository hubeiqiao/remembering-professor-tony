import React from 'react';
import {Audio, Video} from '@remotion/media';
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {BrowserShell} from '../components/BrowserShell.jsx';
import {CAPTURE_TARGETS, WALKTHROUGH_SCENES} from '../data/walkthrough.mjs';
import {
  MOTION_PRESETS,
  SOUNDTRACK_EDIT,
  TRANSITION_PRESETS,
  getCaptureRenderProfile,
  getSceneFocusProfile,
  getSoundtrackWindow,
} from '../data/walkthrough-rendering.mjs';

const clampConfig = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const CAPTURE_MODES = Object.fromEntries(
  CAPTURE_TARGETS.map((target) => [target.id, target.captureMode]),
);

const getTransitionConfig = (preset) => {
  const transitionPreset = TRANSITION_PRESETS[preset] ?? TRANSITION_PRESETS['scroll-push'];

  switch (transitionPreset.type) {
    case 'fade':
      return {
        presentation: fade(),
        timing: springTiming({
          durationInFrames: transitionPreset.durationInFrames,
          config: transitionPreset.config,
        }),
      };
    case 'wipe':
      return {
        presentation: wipe({direction: transitionPreset.direction}),
        timing: springTiming({
          durationInFrames: transitionPreset.durationInFrames,
          config: transitionPreset.config,
        }),
      };
    case 'slide':
    default:
      return {
        presentation: slide({direction: transitionPreset.direction}),
        timing: springTiming({
          durationInFrames: transitionPreset.durationInFrames,
          config: transitionPreset.config,
        }),
      };
  }
};

const MediaLayer = ({scene}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const preset = MOTION_PRESETS[scene.motionPreset];
  const captureMode = CAPTURE_MODES[scene.id] ?? 'viewport';
  const renderProfile = getCaptureRenderProfile(captureMode);
  const sceneFocus = getSceneFocusProfile(scene.id);
  const settle = spring({
    fps,
    frame,
    config: {damping: 170, mass: 0.9, stiffness: 120},
  });
  const settleScale = interpolate(settle, [0, 1], [0.988, 1], clampConfig);
  const entranceRamp = interpolate(frame, [0, 10], [0.992, 1], clampConfig);
  const entranceOpacity = interpolate(frame, [0, 10], [0.92, 1], clampConfig);
  const scale = interpolate(
    frame,
    [0, durationInFrames - 1],
    [preset.fromScale, preset.toScale],
    clampConfig,
  );
  const translateX = interpolate(
    frame,
    [0, durationInFrames - 1],
    [preset.fromX, preset.toX],
    clampConfig,
  );
  const focusTranslateX = interpolate(
    frame,
    [0, durationInFrames - 1],
    [sceneFocus.fromX, sceneFocus.toX],
    clampConfig,
  );
  const translateY = interpolate(
    frame,
    [0, durationInFrames - 1],
    [preset.fromY, preset.toY],
    clampConfig,
  );
  const focusTranslateY = interpolate(
    frame,
    [0, durationInFrames - 1],
    [sceneFocus.fromY, sceneFocus.toY],
    clampConfig,
  );
  const flashOpacity = interpolate(frame, [0, 5, 14], [preset.glow, preset.glow * 0.66, 0], clampConfig);
  const shadowOpacity = interpolate(frame, [0, 20], [0.12, 0.2], clampConfig);
  const contrastBoost = interpolate(frame, [0, durationInFrames - 1], [1.01, 1.04], clampConfig);
  const brightnessBoost = interpolate(frame, [0, 14, durationInFrames - 1], [1.03, 1.01, 0.99], clampConfig);
  const mediaTransform = `translate3d(${translateX + focusTranslateX}px, ${translateY + focusTranslateY}px, 0) scale(${scale * sceneFocus.scale * settleScale * entranceRamp})`;

  const sharedStyle = {
    filter: `brightness(${brightnessBoost}) contrast(${contrastBoost}) saturate(1.03)`,
    height: '100%',
    objectFit: renderProfile.foregroundObjectFit,
    objectPosition: renderProfile.foregroundObjectPosition,
    opacity: entranceOpacity,
    transform: mediaTransform,
    transformOrigin: `${sceneFocus.originX} ${sceneFocus.originY}`,
    width: '100%',
  };

  return (
    <AbsoluteFill style={{background: '#050608'}}>
      {scene.kind === 'capture' ? (
        captureMode === 'element' ? (
          <>
            <Img
              src={staticFile(`captures/${scene.captureFile}`)}
              style={{
                filter: `blur(${renderProfile.backgroundBlurPx}px) brightness(${renderProfile.backgroundBrightness}) saturate(${renderProfile.backgroundSaturate})`,
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                opacity: renderProfile.backgroundOpacity,
                transform: `translate3d(${(translateX + focusTranslateX) * 0.18}px, ${(translateY + focusTranslateY) * 0.18}px, 0) scale(${renderProfile.backgroundScale})`,
                width: '100%',
              }}
            />
            <AbsoluteFill style={{padding: renderProfile.foregroundInsetPx}}>
              <Img src={staticFile(`captures/${scene.captureFile}`)} style={sharedStyle} />
            </AbsoluteFill>
          </>
        ) : (
          <Img src={staticFile(`captures/${scene.captureFile}`)} style={sharedStyle} />
        )
      ) : (
        <Video
          src={staticFile(`source-video/${scene.clipFile}`)}
          style={sharedStyle}
          muted
          playbackRate={preset.playbackRate ?? 1}
          trimAfter={scene.durationInFrames}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5, 6, 8, 0.02) 0%, rgba(5, 6, 8, 0.2) 54%, rgba(5, 6, 8, 0.48) 100%)',
          opacity: shadowOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 12%, rgba(255, 250, 241, 0.85), rgba(255, 250, 241, 0.1) 36%, transparent 58%)',
          mixBlendMode: 'screen',
          opacity: flashOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

const WalkthroughScene = ({scene}) => {
  return (
    <BrowserShell sectionLabel={scene.sectionLabel} urlLabel={scene.urlLabel}>
      <MediaLayer scene={scene} />
    </BrowserShell>
  );
};

export const WebsiteWalkthrough = ({muted = true, musicFile = null}) => {
  const {durationInFrames} = useVideoConfig();
  const soundtrackWindow = getSoundtrackWindow({durationInFrames});

  return (
    <AbsoluteFill style={{background: '#07080b'}}>
      {!muted && musicFile ? (
        <Sequence premountFor={30}>
          <Audio
            src={staticFile(`music/${musicFile}`)}
            trimBefore={soundtrackWindow.trimBeforeInFrames}
            trimAfter={soundtrackWindow.trimAfterInFrames}
            volume={(frame) => {
              const fadeIn = interpolate(
                frame,
                [0, SOUNDTRACK_EDIT.fadeInInFrames],
                [0, SOUNDTRACK_EDIT.targetVolume],
                clampConfig,
              );
              const fadeOut = interpolate(
                frame,
                [durationInFrames - SOUNDTRACK_EDIT.fadeOutInFrames, durationInFrames],
                [SOUNDTRACK_EDIT.targetVolume, 0],
                clampConfig,
              );

              return Math.min(fadeIn, fadeOut);
            }}
          />
        </Sequence>
      ) : null}

      <TransitionSeries>
        {WALKTHROUGH_SCENES.map((scene) => {
          const transitionConfig = getTransitionConfig(scene.transitionPreset);

          return (
            <React.Fragment key={scene.id}>
              <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
                <WalkthroughScene scene={scene} />
              </TransitionSeries.Sequence>
              {scene.transitionInFrames > 0 ? (
                <TransitionSeries.Transition
                  timing={transitionConfig.timing}
                  presentation={transitionConfig.presentation}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
